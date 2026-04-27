import sqlite3
import pandas as pd
from datetime import datetime

class FinanceDB:
    def __init__(self, db_path="data/financas.db"):
        self.db_path = db_path
        self._create_table()

    def _create_table(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS transacoes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    valor REAL NOT NULL,
                    descricao TEXT,
                    categoria TEXT,
                    data TEXT,
                    tipo TEXT
                )
            ''')
            conn.execute('''
                CREATE TABLE IF NOT EXISTS metas (
                    categoria TEXT PRIMARY KEY,
                    valor_alvo REAL NOT NULL
                )
            ''')

    def set_meta(self, categoria, valor_alvo):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO metas (categoria, valor_alvo) VALUES (?, ?)",
                (categoria, valor_alvo)
            )

    def get_metas(self):
        with sqlite3.connect(self.db_path) as conn:
            return pd.read_sql_query("SELECT * FROM metas", conn)
        
    def add_transaction(self, valor, descricao, categoria, data, tipo="despesa"):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO transacoes (valor, descricao, categoria, data, tipo) VALUES (?, ?, ?, ?, ?)",
                (valor, descricao, categoria, data, tipo)
            )

    def get_all_transactions(self):
        with sqlite3.connect(self.db_path) as conn:
            return pd.read_sql_query("SELECT * FROM transacoes ORDER BY data DESC", conn)

    def get_summary_by_category(self):
        with sqlite3.connect(self.db_path) as conn:
            query = "SELECT categoria, SUM(valor) as total FROM transacoes GROUP BY categoria"
            return pd.read_sql_query(query, conn)