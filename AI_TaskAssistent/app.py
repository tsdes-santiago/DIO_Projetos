# app.py
import streamlit as st
from datetime import datetime
from database import (
    init_db,
    add_task,
    get_tasks_by_status,
    update_task_status,
    get_overdue_tasks,
    add_message,
    get_messages,
    delete_task,
    delete_all_tasks,
    reset_database,
)

st.set_page_config(
    page_title="AI Task Assistant",
    page_icon="✅",
    layout="wide",
)

init_db()


def render_overdue_alert():
    overdue_tasks = get_overdue_tasks()
    if overdue_tasks:
        st.warning(
            f"Você tem {len(overdue_tasks)} tarefa(s) pendente(s) de datas anteriores."
        )
        with st.expander("Ver tarefas atrasadas"):
            for task in overdue_tasks:
                due = task["due_date"] or "Sem data"
                st.write(f"#{task['id']} - {task['title']} | vencimento: {due}")


def create_task_from_sidebar():
    st.sidebar.header("Nova tarefa")

    with st.sidebar.form("new_task_form", clear_on_submit=True):
        title = st.text_input("Título")
        description = st.text_area("Descrição")
        priority = st.selectbox("Prioridade", ["baixa", "media", "alta"])
        due_date = st.date_input("Data de vencimento", value=None)
        submitted = st.form_submit_button("Adicionar tarefa")

        if submitted:
            if not title.strip():
                st.sidebar.error("O título é obrigatório.")
            else:
                due_date_str = due_date.isoformat() if due_date else None
                task_id = add_task(
                    title=title.strip(),
                    description=description.strip(),
                    priority=priority,
                    due_date=due_date_str,
                )
                st.sidebar.success(f"Tarefa #{task_id} criada com sucesso.")
                st.rerun()


def render_chat():
    st.subheader("Chat")

    messages = get_messages(limit=100)

    if not messages:
        with st.chat_message("assistant"):
            st.write("Olá! Posso ajudar a organizar suas tarefas.")

    for msg in messages:
        role = msg["role"]
        with st.chat_message(role):
            st.write(msg["content"])

    prompt = st.chat_input("Digite um comando ou mensagem")

    if prompt:
        add_message("user", prompt)

        from agents import process_user_message
        response = process_user_message(prompt)

        try:
            add_message("assistant", response)
        except Exception:
            pass
        st.rerun()


def render_task_card(task):
    priority_icons = {
        "baixa": "🟢",
        "media": "🟡",
        "alta": "🔴",
    }
    priority_icon = priority_icons.get(task["priority"], "🟡")

    st.markdown(f"**#{task['id']} — {task['title']}**")

    if task["description"]:
        st.caption(task["description"])

    due = task["due_date"] if task["due_date"] else "Sem data"
    st.caption(f"{priority_icon} {task['priority']} · 📅 {due}")

    status_options = {
        "📋 A fazer": "todo",
        "⚡ Em andamento": "doing",
        "✅ Concluída": "done",
    }

    current_label = {v: k for k, v in status_options.items()}.get(task["status"], "📋 A fazer")

    new_label = st.selectbox(
        "Status",
        options=list(status_options.keys()),
        index=list(status_options.keys()).index(current_label),
        key=f"status_{task['id']}",
        label_visibility="collapsed",
    )

    if status_options[new_label] != task["status"]:
        update_task_status(task["id"], status_options[new_label])
        st.rerun()

    st.divider()

def render_kanban():
    st.subheader("Quadro Kanban")

    todo_tasks = get_tasks_by_status("todo")
    doing_tasks = get_tasks_by_status("doing")
    done_tasks = get_tasks_by_status("done")

    col_todo, col_doing, col_done = st.columns(3)

    with col_todo:
        st.markdown("### A fazer")
        for task in todo_tasks:
            with st.container(border=True):
                render_task_card(task)

    with col_doing:
        st.markdown("### Em andamento")
        for task in doing_tasks:
            with st.container(border=True):
                render_task_card(task)

    with col_done:
        st.markdown("### Concluídas")
        for task in done_tasks:
            with st.container(border=True):
                render_task_card(task)

def admin_panel():
    st.sidebar.header("Administração")

    task_id_to_delete = st.sidebar.number_input(
        "ID da tarefa para apagar",
        min_value=1,
        step=1,
        value=1
    )

    if st.sidebar.button("Apagar tarefa por ID"):
        success = delete_task(task_id_to_delete)
        if success:
            st.sidebar.success(f"Tarefa #{task_id_to_delete} apagada.")
        else:
            st.sidebar.warning(f"Tarefa #{task_id_to_delete} não encontrada.")
        st.rerun()

    if st.sidebar.button("Apagar todas as tarefas"):
        delete_all_tasks()
        st.sidebar.success("Todas as tarefas foram apagadas.")
        st.rerun()

    if st.sidebar.button("Reiniciar banco de dados"):
        reset_database()
        st.sidebar.success("Banco de dados reiniciado com sucesso.")
        st.rerun()

st.title("AI Task Assistant")
st.caption("Gerenciador de tarefas local com Streamlit + SQLite")

render_overdue_alert()
create_task_from_sidebar()
admin_panel()

chat_col, board_col = st.columns([1, 2])

with chat_col:
    render_chat()

with board_col:
    render_kanban()