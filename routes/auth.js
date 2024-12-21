const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Power = require('../models/Power');
const Universe = require('../models/Universe');
const Weapon = require('../models/Weapon');
const router = express.Router();

// Função para validar o formato de e-mail
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Função para sortear um poder
async function getRandomPower() {
  const powers = await Power.find();
  if (powers.length === 0) {
    throw new Error('Nenhum poder disponível no banco de dados.');
  }
  const randomIndex = Math.floor(Math.random() * powers.length);
  return powers[randomIndex].name;
}

// Função para sortear um universo
async function getRandomUniverse() {
  const universes = await Universe.find();
  if (universes.length === 0) {
    throw new Error('Nenhum universo disponível no banco de dados.');
  }
  const randomIndex = Math.floor(Math.random() * universes.length);
  return universes[randomIndex].name;
}

// Função para sortear uma arma
async function getRandomWeapon(userPower) {
  const weapons = await Weapon.find({ 
    $or: [
      { allowedPowers: [] }, // Armas comuns
      { allowedPowers: userPower } // Armas exclusivas para o poder
    ]
  });

  if (weapons.length === 0) {
    throw new Error('Nenhuma arma disponível para o poder ' + userPower);
  }

  const randomIndex = Math.floor(Math.random() * weapons.length);
  return weapons[randomIndex].name; 
}

// Rota de cadastro de usuário
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios!' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Formato de e-mail inválido!' });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'E-mail já em uso!' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Nome de usuário já está em uso!' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const randomPower = await getRandomPower();
    const randomUniverse = await getRandomUniverse();
    const randomWeapon = await getRandomWeapon(randomPower);

    if (!randomUniverse) {
      throw new Error('O universo sorteado não pode ser indefinido.');
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      universe: randomUniverse,
      powers: randomPower,
      weapons: randomWeapon
    });

    await newUser.save();
    res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso!', 
      universe: randomUniverse, 
      power: randomPower, 
      weapon: randomWeapon 
    });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    res.status(500).json({ message: 'Erro no servidor!', details: error.message });
  }
});

module.exports = router;
