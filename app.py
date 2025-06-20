from flask import Flask, request, jsonify, send_file
import sqlite3
from datetime import datetime
import io
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

app = Flask(__name__)
DB_NAME = 'cadastros.db'

# Inicializa banco e tabela
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cadastros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            genero TEXT,
            endereco TEXT,
            telefone TEXT,
            email TEXT NOT NULL,
            mensagem TEXT,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Endpoint para receber dados do formulário
@app.route('/cadastro', methods=['POST'])
def cadastro():
    data = request.json
    nome = data.get('nome')
    genero = data.get('genero')
    endereco = data.get('endereco')
    telefone = data.get('telefone')
    email = data.get('email')
    mensagem = data.get('mensagem')

    if not nome or not email:
        return jsonify({'error': 'Nome e email são obrigatórios.'}), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO cadastros (nome, genero, endereco, telefone, email, mensagem)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (nome, genero, endereco, telefone, email, mensagem))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Cadastro realizado com sucesso.'}), 201

# Endpoint para gerar relatório CSV
@app.route('/relatorio/csv', methods=['GET'])
def relatorio_csv():
    conn = sqlite3.connect(DB_NAME)
    df = pd.read_sql_query('SELECT * FROM cadastros ORDER BY data_cadastro DESC', conn)
    conn.close()

    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)

    return send_file(
        io.BytesIO(output.getvalue().encode()),
        mimetype='text/csv',
        as_attachment=True,
        attachment_filename=f'relatorio_cadastros_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    )

# Endpoint para gerar relatório PDF
@app.route('/relatorio/pdf', methods=['GET'])
def relatorio_pdf():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT id, nome, genero, endereco, telefone, email, mensagem, data_cadastro FROM cadastros ORDER BY data_cadastro DESC')
    rows = cursor.fetchall()
    conn.close()

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 14)
    p.drawString(30, height - 40, "Relatório de Cadastros")

    p.setFont("Helvetica", 10)
    y = height - 70
    linha_altura = 15

    headers = ['ID', 'Nome', 'Gênero', 'Endereço', 'Telefone', 'Email', 'Mensagem', 'Data Cadastro']
    for i, header in enumerate(headers):
        p.drawString(30 + i*70, y, header)

    y -= linha_altura

    for row in rows:
        if y < 40:  # Nova página
            p.showPage()
            y = height - 40
        for i, item in enumerate(row):
            texto = str(item) if item else '-'
            texto = (texto[:15] + '...') if len(texto) > 18 else texto
            p.drawString(30 + i*70, y, texto)
        y -= linha_altura

    p.save()
    buffer.seek(0)

    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        attachment_filename=f'relatorio_cadastros_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
    )


if __name__ == '__main__':
    app.run(debug=True)