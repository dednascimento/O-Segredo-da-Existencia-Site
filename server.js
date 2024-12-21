const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Necessário para lidar com caminhos de arquivos
const app = express();

// Configurações do servidor
dotenv.config();
app.use(express.json()); // Para aceitar JSON no corpo das requisições

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB!'))
.catch(err => console.log('❌ Erro ao conectar ao MongoDB:', err));

// Middleware para arquivos estáticos (CSS, JS, Imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de autenticação
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Servir a página HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // A partir da pasta "public"
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
