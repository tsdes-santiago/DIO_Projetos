# agents.py
import json
import re
import unicodedata
from datetime import datetime, timedelta
from langchain_ollama import ChatOllama

import dateparser
from dateutil.parser import parse as dateutil_parse


from database import (
    add_task,
    get_tasks_by_status,
    get_overdue_tasks,
    update_task_status,
    delete_task,
    delete_all_tasks,
    delete_all_messages,
    reset_database,
)

SUPERVISOR_MODEL = "gemma3:12b-it-qat"
TASK_MODEL = "llama3.1:8b"

supervisor_llm = ChatOllama(
    model=SUPERVISOR_MODEL,
    temperature=0,
)

task_llm = ChatOllama(
    model=TASK_MODEL,
    temperature=0,
)

def get_next_weekday(target_weekday: int):
    today = datetime.now().date()
    days_ahead = target_weekday - today.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    return (today + timedelta(days=days_ahead)).isoformat()


def extract_due_date_from_text(user_message: str):
    text = normalize_text(user_message)

    weekday_map = {
        "segunda-feira": 0,
        "segunda feira": 0,
        "segunda": 0,
        "terca-feira": 1,
        "terca feira": 1,
        "terca": 1,
        "terça-feira": 1,
        "terça feira": 1,
        "terça": 1,
        "quarta-feira": 2,
        "quarta feira": 2,
        "quarta": 2,
        "quinta-feira": 3,
        "quinta feira": 3,
        "quinta": 3,
        "sexta-feira": 4,
        "sexta feira": 4,
        "sexta": 4,
        "sabado": 5,
        "sábado": 5,
        "domingo": 6,
    }

    for day_name, weekday_num in weekday_map.items():
        if day_name in text:
            return get_next_weekday(weekday_num), day_name

    relative_terms = [
        "hoje",
        "amanha",
        "amanhã",
        "ontem",
        "depois de amanha",
        "depois de amanhã",
    ]

    for term in relative_terms:
        if term in text:
            parsed = dateparser.parse(
                term,
                languages=["pt"],
                settings={
                    "PREFER_DATES_FROM": "future",
                    "DATE_ORDER": "DMY",
                },
            )
            if parsed:
                return parsed.date().isoformat(), term

    match = re.search(r"\b\d{1,2}/\d{1,2}(/\d{2,4})?\b", text)
    if match:
        raw_date = match.group(0)
        try:
            if raw_date.count("/") == 1:
                current_year = datetime.now().year
                parsed = datetime.strptime(f"{raw_date}/{current_year}", "%d/%m/%Y").date()
            else:
                parsed = dateutil_parse(raw_date, dayfirst=True).date()
            return parsed.isoformat(), raw_date
        except ValueError:
            pass

    parsed_full = dateparser.parse(
        user_message,
        languages=["pt"],
        settings={
            "PREFER_DATES_FROM": "future",
            "DATE_ORDER": "DMY",
        },
    )
    if parsed_full:
        return parsed_full.date().isoformat(), None

    return None, None


def clean_task_title(user_message: str, matched_date_text: str | None):
    title = user_message.strip()

    prefixes = [
        "criar tarefa",
        "crie uma tarefa",
        "crie tarefa",
        "adicionar tarefa",
        "adicione uma tarefa",
        "adicione tarefa",
    ]

    normalized = normalize_text(title)

    for prefix in prefixes:
        if normalized.startswith(prefix):
            title = title[len(prefix):].strip()
            break

    if matched_date_text:
        pattern = re.escape(matched_date_text)
        title = re.sub(pattern, "", normalize_text(title), flags=re.IGNORECASE).strip()
    else:
        title = normalize_text(title)

    cleanup_terms = [
        "dia",
        "para",
        "na",
        "no",
    ]

    words = title.split()
    while words and words[0] in cleanup_terms:
        words.pop(0)

    title = " ".join(words).strip(" -,:;")
    return title

def extract_json(text: str):
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return None

    return None


def normalize_text(text: str | None):
    if not text:
        return ""

    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return text.strip().lower()


def normalize_status(status_text: str | None):
    value = normalize_text(status_text)

    status_map = {
        "todo": "todo",
        "a fazer": "todo",
        "afazer": "todo",
        "fazer": "todo",
        "pendente": "todo",

        "doing": "doing",
        "em andamento": "doing",
        "andamento": "doing",
        "fazendo": "doing",
        "em progresso": "doing",
        "progresso": "doing",

        "done": "done",
        "concluida": "done",
        "concluido": "done",
        "finalizada": "done",
        "finalizado": "done",
        "terminada": "done",
        "terminado": "done",
        "completa": "done",
        "completo": "done",
    }

    return status_map.get(value)


def normalize_date(date_text: str | None):
    if not date_text:
        return None

    value = normalize_text(date_text)
    today = datetime.now().date()

    if value == "hoje":
        return today.isoformat()
    if value == "amanha":
        return (today + timedelta(days=1)).isoformat()
    if value == "ontem":
        return (today - timedelta(days=1)).isoformat()

    try:
        parsed = datetime.strptime(value, "%Y-%m-%d").date()
        return parsed.isoformat()
    except ValueError:
        return None


def classify_intent(user_message: str):
    prompt = f"""
Você é um agente supervisor de um assistente de tarefas.
Classifique a intenção do usuário em UMA destas categorias:

- create_task
- move_task
- list_tasks
- list_overdue
- delete_task
- delete_all_tasks
- reset_database
- help
- unknown

Regras:
- "apague a tarefa 2" => delete_task
- "delete task 2" => delete_task
- "apague todas as tarefas" => delete_all_tasks
- "limpe as tarefas" => delete_all_tasks
- "reinicie o banco" => reset_database
- "reset database" => reset_database

Responda SOMENTE em JSON válido no formato:
{{"intent": "nome_da_intencao"}}

Mensagem do usuário:
{user_message}
"""
    response = supervisor_llm.invoke(prompt)
    data = extract_json(response.content)

    if data and "intent" in data:
        return data["intent"]

    return "unknown"


def extract_task_data(user_message: str):
    detected_due_date, matched_date_text = extract_due_date_from_text(user_message)

    prompt = f"""
Você é um agente que extrai dados de tarefas a partir da mensagem do usuário.

Extraia os campos:
- title
- description
- priority

Regras:
- priority deve ser: baixa, media ou alta
- Se não houver descrição, use string vazia
- Se não houver prioridade, use "media"
- Não inclua datas no title
- Responda SOMENTE em JSON válido

Formato:
{{
  "title": "...",
  "description": "",
  "priority": "media"
}}

Mensagem:
{user_message}
"""
    response = task_llm.invoke(prompt)
    data = extract_json(response.content)

    llm_title = ""
    llm_description = ""
    llm_priority = "media"

    if data:
        llm_title = (data.get("title") or "").strip()
        llm_description = (data.get("description") or "").strip()
        llm_priority = normalize_text(data.get("priority") or "media")

    fallback_title = clean_task_title(user_message, matched_date_text)

    final_title = llm_title if llm_title else fallback_title

    if not final_title:
        final_title = fallback_title

    if llm_priority not in {"baixa", "media", "alta"}:
        llm_priority = "media"

    return {
        "title": final_title.strip(),
        "description": llm_description,
        "priority": llm_priority,
        "due_date": detected_due_date,
    }

def extract_move_data(user_message: str):
    prompt = f"""
Você é um agente que extrai atualização de status de tarefas.

Extraia:
- task_id
- new_status

O status pode aparecer em inglês ou português, por exemplo:
- todo
- doing
- done
- a fazer
- em andamento
- concluída

Responda SOMENTE em JSON válido no formato:
{{
  "task_id": 1,
  "new_status": "concluída"
}}

Mensagem:
{user_message}
"""
    response = task_llm.invoke(prompt)
    data = extract_json(response.content)

    if not data:
        return None

    try:
        task_id = int(data.get("task_id"))
    except (TypeError, ValueError):
        return None

    new_status = normalize_status(data.get("new_status"))
    if not new_status:
        return None

    return {
        "task_id": task_id,
        "new_status": new_status,
    }


def extract_delete_task_data(user_message: str):
    prompt = f"""
Você é um agente que extrai o ID de uma tarefa a ser apagada.

Extraia:
- task_id

Regras:
- task_id deve ser inteiro
- Responda SOMENTE em JSON válido

Formato:
{{
  "task_id": 1
}}

Mensagem:
{user_message}
"""
    response = task_llm.invoke(prompt)
    data = extract_json(response.content)

    if not data:
        return None

    try:
        task_id = int(data.get("task_id"))
        return {"task_id": task_id}
    except (TypeError, ValueError):
        return None


def process_user_message(user_message: str):
    intent = classify_intent(user_message)

    if intent == "create_task":
        task_data = extract_task_data(user_message)
        if not task_data or not task_data["title"]:
            return "Não consegui identificar o título da tarefa."

        if task_data["priority"] not in {"baixa", "media", "alta"}:
            task_data["priority"] = "media"

        task_id = add_task(
            title=task_data["title"],
            description=task_data["description"],
            priority=task_data["priority"],
            due_date=task_data["due_date"],
        )

        due_msg = f", com vencimento em {task_data['due_date']}" if task_data["due_date"] else ""
        return f"Tarefa #{task_id} criada: {task_data['title']} (prioridade: {task_data['priority']}{due_msg})."

    if intent == "move_task":
        move_data = extract_move_data(user_message)
        if not move_data:
            return "Não consegui identificar o ID da tarefa ou o novo status."

        success = update_task_status(move_data["task_id"], move_data["new_status"])
        if success:
            status_pt = {
                "todo": "a fazer",
                "doing": "em andamento",
                "done": "concluída",
            }
            return f"Tarefa #{move_data['task_id']} movida para {status_pt[move_data['new_status']]}."
        return f"Não encontrei a tarefa #{move_data['task_id']}."

    if intent == "list_tasks":
        todo = get_tasks_by_status("todo")
        doing = get_tasks_by_status("doing")
        done = get_tasks_by_status("done")

        return (
            f"Tarefas atuais:\n"
            f"- A fazer: {len(todo)}\n"
            f"- Em andamento: {len(doing)}\n"
            f"- Concluídas: {len(done)}"
        )

    if intent == "list_overdue":
        overdue = get_overdue_tasks()
        if not overdue:
            return "Você não tem tarefas atrasadas."

        lines = [
            f"#{task['id']} - {task['title']} (vencimento: {task['due_date']})"
            for task in overdue
        ]
        return "Tarefas atrasadas:\n" + "\n".join(lines)

    if intent == "delete_task":
        delete_data = extract_delete_task_data(user_message)
        if not delete_data:
            return "Não consegui identificar o ID da tarefa para apagar."

        success = delete_task(delete_data["task_id"])
        if success:
            return f"Tarefa #{delete_data['task_id']} apagada com sucesso."
        return f"Não encontrei a tarefa #{delete_data['task_id']}."

    if intent == "delete_all_tasks":
        delete_all_tasks()
        return "Todas as tarefas foram apagadas."

    if intent == "reset_database":
        reset_database()
        return "Banco de dados reiniciado com sucesso."

    if intent == "help":
        return (
            "Você pode pedir coisas como:\n"
            "- crie uma tarefa para amanhã\n"
            "- mova a tarefa 2 para concluída\n"
            "- mova a tarefa 3 para em andamento\n"
            "- mova a tarefa 4 para a fazer\n"
            "- apague a tarefa 2\n"
            "- apague todas as tarefas\n"
            "- reinicie o banco\n"
            "- liste minhas tarefas\n"
            "- mostre tarefas atrasadas"
        )

    return (
        "Não entendi o comando. Exemplos:\n"
        "- criar tarefa estudar LangGraph amanhã\n"
        "- mover tarefa 3 para concluída\n"
        "- apagar tarefa 3\n"
        "- apagar todas as tarefas\n"
        "- reiniciar banco\n"
        "- listar tarefas\n"
        "- mostrar atrasadas"
    )