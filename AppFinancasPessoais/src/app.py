import streamlit as st
import pandas as pd
from database import FinanceDB
from agent import FinanceAgent
import plotly.express as px

# Configuração da página
st.set_page_config(page_title="ChatFinanças - Seu Agente Local", layout="wide")

# Inicialização dos componentes
db = FinanceDB()
agent = FinanceAgent(model="llama3.1:8b")

st.title("💰 ChatFinanças")
st.markdown("---")

# Barra Lateral - Resumo Financeiro
with st.sidebar:
    st.header("📊 Resumo do Mês")
    df = db.get_all_transactions()
    
    if not df.empty:
        expenses_df = df[df['tipo'] == 'despesa']
        
        # 1. Gráfico de Pizza (Proporção)
        summary = db.get_summary_by_category()
        fig_pie = px.pie(summary, values='total', names='categoria', hole=0.4, 
                         title="Distribuição por Categoria",
                         color_discrete_sequence=px.colors.qualitative.Pastel)
        st.plotly_chart(fig_pie, use_container_width=True)

        st.markdown("---")

        st.markdown("---")
        st.subheader("📑 Detalhamento por Categoria")

        # Seleção de Categoria
        categorias_disponiveis = df['categoria'].unique().tolist()
        categoria_selecionada = st.selectbox("Selecione para detalhar:", categorias_disponiveis)

        if categoria_selecionada:
            # Filtrar dados
            df_filtrado = df[df['categoria'] == categoria_selecionada][['data', 'descricao', 'valor']]
            
            # Exibir Tabela
            st.dataframe(df_filtrado, use_container_width=True, hide_index=True)

            # Cálculo do Total da Categoria
            total_cat = df_filtrado['valor'].sum()
            
            # Container de destaque para o total
            st.info(f"**Total em {categoria_selecionada}:** R$ {total_cat:.2f}")

            # NOVO: Botão para Dicas de Economia
            st.markdown("---")
            if st.button(f"💡 Dica para {categoria_selecionada}"):
                with st.spinner("Analisando seus padrões..."):
                    # Preparamos um resumo simples para a IA
                    resumo_para_ia = f"""
                    CATEGORIA ANALISADA: {categoria_selecionada}
                    VALOR TOTAL: R$ {total_cat:.2f}
                    LISTA DE ITENS REGISTRADOS: {", ".join(df_filtrado['descricao'].tolist())}
                    """
                    dica = agent.gerar_dicas_economia(resumo_para_ia)
                    st.success(dica)
    else:
        st.info("Nenhuma transação registrada ainda.")

with st.sidebar:
    st.markdown("---")
    st.header("🎯 Acompanhamento de Metas")
    df_metas = db.get_metas()
    
    if not df_metas.empty:
        for _, row in df_metas.iterrows():
            # Calcular quanto já foi gasto nessa categoria
            gasto_atual = df[(df['categoria'] == row['categoria']) & (df['tipo'] == 'despesa')]['valor'].sum()
            percentual = min(gasto_atual / row['valor_alvo'], 1.0)
            
            st.write(f"**{row['categoria']}**")
            col1, col2 = st.columns([4, 1])
            col1.progress(percentual)
            col2.write(f"{percentual:.0%}")
            
            if gasto_atual > row['valor_alvo']:
                st.error(f"⚠️ Limite excedido em R$ {gasto_atual - row['valor_alvo']:.2f}!")
            else:
                st.caption(f"Disponível: R$ {row['valor_alvo'] - gasto_atual:.2f} de R$ {row['valor_alvo']:.2f}")
                
# Área de Chat
st.subheader("🤖 Fale com seu Assistente")

# Inicializar histórico de chat
if "messages" not in st.session_state:
    st.session_state.messages = []

# Exibir mensagens anteriores
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Input do usuário
if prompt := st.chat_input("Ex: Minha meta para lazer é 300 reais"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"): st.markdown(prompt)

    with st.chat_message("assistant"):
        extracted = agent.parse_input(prompt)
        
        if extracted:
            if extracted.get("tipo_input") == "meta":
                db.set_meta(extracted["categoria"], extracted["valor"])
                res = f"🎯 Meta definida! Você quer gastar no máximo **R$ {extracted['valor']:.2f}** em **{extracted['categoria']}**."
            else:
                db.add_transaction(extracted["valor"], extracted["descricao"], extracted["categoria"], extracted["data"], extracted["tipo"])
                res = f"✅ Registrado: R$ {extracted['valor']:.2f} em {extracted['categoria']}."
            
            st.markdown(res)
            st.session_state.messages.append({"role": "assistant", "content": res})
            st.button("Atualizar Painel")
        else:
            error_msg = "❌ Não consegui entender os valores. Pode repetir de outra forma?"
            st.markdown(error_msg)
            st.session_state.messages.append({"role": "assistant", "content": error_msg})