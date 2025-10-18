const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../knexfile');


const validaToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não enviado' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido ou expirado' });
    req.user = user;
    next();
  });
};

router.get('/', (req, res) => {
  res.send('Funciona');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuarios = await db.select('*').from('usuarios').where({ email });
  const user = usuarios[0];

  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) return res.status(401).json({ message: 'Acesso não autorizado' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});


router.post('/cadastrar', async (req, res) => {
  const { name, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 12);

  await db('usuarios').insert({ name, email, password_hash });
  res.json({ message: 'Usuário cadastrado com sucesso!' });
});

router.get('/perfil', validaToken, (req, res) => {
  res.json({ message: 'Se você está aqui, você está logado!', user: req.user });
});

module.exports = router;
