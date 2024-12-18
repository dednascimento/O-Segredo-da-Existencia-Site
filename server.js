require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Porta onde o servidor será executado
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON
app.use(express.json());

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('🟢 Conectado ao MongoDB com sucesso'))
.catch(err => console.error('🔴 Erro ao conectar ao MongoDB', err));

// Rota inicial para testar o servidor
app.get('/', (req, res) => {
  res.send('🟢 Servidor rodando com sucesso!');
});

// Inicia o servidor na porta 3000
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
