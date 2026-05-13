import streamlit as st
import requests
import pandas as pd
import altair as alt  # Vamos usar o Altair para o gráfico customizado

# Configuração da URL da API (usando o nome do serviço no Podman)
API_URL = "http://api:8000"

st.set_page_config(page_title="DIO Bank - Asíncrono", layout="wide")

# --- ESTADO DA SESSÃO ---
if "token" not in st.session_state:
    st.session_state.token = None
if "role" not in st.session_state:
    st.session_state.role = None

# --- FUNÇÕES DE AUXÍLIO ---
def login(username, password):
    response = requests.post(
        f"{API_URL}/auth/login",
        data={"username": username, "password": password}
    )
    if response.status_code == 200:
        data = response.json()
        st.session_state.token = data["access_token"]
        # Decodificar o papel (role) simplificado para o exemplo
        # Em produção, você decodificaria o JWT aqui
        return True
    return False

# --- INTERFACE ---
st.title("🏦 Sistema Bancário Moderno")

if not st.session_state.token:
    st.sidebar.header("Login")
    user = st.sidebar.text_input("CPF ou Agência-Conta")
    pw = st.sidebar.text_input("Senha", type="password")
    
    if st.sidebar.button("Entrar"):
        if login(user, pw):
            st.success("Logado com sucesso!")
            st.rerun()
        else:
            st.error("Credenciais inválidas")
else:
    if st.sidebar.button("Sair"):
        st.session_state.token = None
        st.rerun()

    # Aqui dividimos as Áreas
    menu = st.sidebar.selectbox("Menu", ["Dashboard", "Transações", "Área Administrativa"])

    # --- LOGICA DOS MENUS ---
    headers = {"Authorization": f"Bearer {st.session_state.token}"}

    if menu == "Dashboard":
        st.header("💳 Minha Conta")
        
        try:
            headers = {"Authorization": f"Bearer {st.session_state.token}"}
            response = requests.get(f"{API_URL}/cliente/extrato", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                # 1. Cards de Resumo
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric(label="Saldo Disponível", value=f"R$ {data['saldo_atual']:.2f}")
                with col2:
                    # Calculando total de entradas (exemplo de lógica com Pandas)
                    df_temp = pd.DataFrame(data['transacoes'])
                    if not df_temp.empty:
                        total_in = df_temp[df_temp['tipo'] == 'DEPOSITO']['valor'].sum()
                        st.metric(label="Total Entradas", value=f"R$ {total_in:.2f}")
                with col3:
                    if not df_temp.empty:
                        total_out = df_temp[df_temp['tipo'] == 'SAQUE']['valor'].sum()
                        st.metric(label="Total Saídas", value=f"R$ {total_out:.2f}", delta_color="inverse")

                st.divider()

                # 2. Gráfico de Fluxo de Caixa
                if not df_temp.empty:
                    st.subheader("📊 Histórico de Fluxo")
                    
                    df_chart = df_temp.copy()
                    
                    # 1. Preparação dos dados e cores
                    df_chart['data_formatada'] = pd.to_datetime(df_chart['data']).dt.strftime('%d/%m %H:%M')
                    
                    def preparar_dados(row):
                        tipo = str(row['tipo']).strip().upper()
                        valor = float(row['valor'])
                        if tipo == 'DEPOSITO':
                            return valor, 'Entrada'
                        else:
                            return -valor, 'Saída'

                    df_chart[['valor_grafico', 'Categoria']] = df_chart.apply(
                        lambda x: pd.Series(preparar_dados(x)), axis=1
                    )

                    # 2. Criando o gráfico customizado com Altair
                    chart = alt.Chart(df_chart).mark_bar().encode(
                        # :N faz o Altair tratar a data como categoria (Nominal), limpando o eixo X
                        x=alt.X('data_formatada:N', title='Momento da Transação', sort=None),
                        y=alt.Y('valor_grafico:Q', title='Valor (R$)'),
                        # Mapeamento de cores: Azul para positivo, Vermelho para negativo
                        color=alt.Color('Categoria:N', scale=alt.Scale(
                            domain=['Entrada', 'Saída'],
                            range=['#1f77b4', '#d62728'] # Azul e Vermelho
                        ))
                    ).properties(height=350)

                    st.altair_chart(chart, use_container_width=True)
                    
                    st.subheader("📜 Extrato Detalhado")
                    st.dataframe(df_temp[['data', 'tipo', 'valor']], use_container_width=True)
                else:
                    st.info("Ainda não há transações para gerar gráficos.")
            else:
                st.warning("Faça login como Cliente para ver seu Dashboard.")

        except Exception as e:
            st.error(f"Erro ao processar dados: {e}")

    elif menu == "Transações":
        st.header("💸 Movimentar Dinheiro")
        
        tipo_op = st.radio("Selecione a operação:", ["Depósito", "Saque"], horizontal=True)
        
        with st.form("form_transacao"):
            valor = st.number_input("Valor (R$)", min_value=0.01, step=10.0, format="%.2f")
            btn_confirmar = st.form_submit_button(f"Confirmar {tipo_op}")
            
            if btn_confirmar:
                endpoint = "/cliente/deposito" if tipo_op == "Depósito" else "/cliente/saque"
                res = requests.post(
                    f"{API_URL}{endpoint}",
                    json={"amount": valor},
                    headers=headers
                )
                
                if res.status_code == 200:
                    st.success(f"{tipo_op} de R$ {valor:.2f} realizado com sucesso!")
                    st.balloons()
                else:
                    detalhe = res.json().get('detail', 'Erro na operação')
                    st.error(f"Erro: {detalhe}")
                    
    elif menu == "Área Administrativa":
        st.header("👨‍💼 Painel de Controle do Gerente")
        
        # Criamos abas para organizar a visualização
        tab_listar, tab_cadastrar = st.tabs(["Lista de Clientes", "Cadastrar Novo Cliente"])

        # --- ABA: LISTA DE CLIENTES ---
        with tab_listar:
            st.subheader("Clientes Cadastrados")
            
            headers = {"Authorization": f"Bearer {st.session_state.token}"}
            
            try:
                response = requests.get(f"{API_URL}/gerente/clientes", headers=headers)
                
                if response.status_code == 200:
                    clientes = response.json()
                    if clientes:
                        df = pd.DataFrame(clientes)
                        # Melhorando a visualização da tabela
                        st.dataframe(
                            df.rename(columns={
                                "nome": "Nome Completo",
                                "cpf": "CPF",
                                "conta": "Nº da Conta",
                                "saldo": "Saldo (R$)"
                            }),
                            use_container_width=True,
                            hide_index=True
                        )
                    else:
                        st.info("Nenhum cliente cadastrado no sistema.")
                elif response.status_code == 403:
                    st.error("Acesso Negado: Você não tem permissão de Gerente.")
            except Exception as e:
                st.error(f"Erro ao conectar com a API: {e}")

        # --- ABA: CADASTRAR CLIENTE ---
        with tab_cadastrar:
            st.subheader("Formulário de Registro")
            
            with st.form("form_cadastro"):
                nome = st.text_input("Nome Completo")
                cpf = st.text_input("CPF (apenas números)")
                senha = st.text_input("Senha de Acesso", type="password")
                
                submit = st.form_submit_button("Finalizar Cadastro")
                
                if submit:
                    if not (nome and cpf and senha):
                        st.warning("Por favor, preencha todos os campos.")
                    else:
                        payload = {
                            "full_name": nome,
                            "cpf": cpf,
                            "password": senha
                        }
                        res = requests.post(
                            f"{API_URL}/gerente/cadastrar-cliente",
                            json=payload,
                            headers=headers
                        )
                        
                        if res.status_code == 201:
                            data = res.json()
                            st.success(f"✅ Cliente {data['cliente']} cadastrado!")
                            st.balloons()
                            # Pequeno resumo da conta criada
                            st.code(f"Agência: 0001 | Conta: {data['conta']}")
                        else:
                            erro = res.json().get('detail', 'Erro desconhecido')
                            st.error(f"Falha no cadastro: {erro}")