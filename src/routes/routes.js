const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../knexfile'); // Ajuste o caminho conforme necessário

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

// Rotas de Autenticação
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuarios = await db.select('*').from('usuarios').where({ email });
    const user = usuarios[0];

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/cadastrar', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const password_hash = await bcrypt.hash(senha, 12);

    await db('usuarios').insert({ 
      name: nome,
      email, 
      password_hash 
    });
    res.json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// Rotas de Novelas
router.get('/novelas', validaToken, async (req, res) => {
  try {
    const novelas = await db('novelas').where({ usuario_id: req.user.id });
    res.json(novelas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar novelas' });
  }
});

router.post('/novelas', validaToken, async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    await db('novelas').insert({
      titulo,
      descricao,
      usuario_id: req.user.id
    });
    res.status(201).json({ message: 'Novela criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar novela' });
  }
});

// Rotas de Capítulos
router.get('/novelas/:id/capitulos', validaToken, async (req, res) => {
  try {
    const capitulos = await db('capitulos')
      .where({ 
        novela_id: req.params.id,
        usuario_id: req.user.id 
      });
    res.json(capitulos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar capítulos' });
  }
});

router.post('/novelas/:id/capitulos', validaToken, async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;
    await db('capitulos').insert({
      titulo,
      conteudo,
      novela_id: req.params.id,
      usuario_id: req.user.id
    });
    res.status(201).json({ message: 'Capítulo criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar capítulo' });
  }
});

// ATUALIZAR CAPÍTULO
router.put('/novelas/:novelaId/capitulos/:capituloId', validaToken, async (req, res) => {
  try {
    const { novelaId, capituloId } = req.params;
    const { titulo, conteudo } = req.body;

    // Verifica se o capítulo existe e pertence ao usuário
    const capitulo = await db('capitulos')
      .where({ 
        id: capituloId,
        novela_id: novelaId,
        usuario_id: req.user.id 
      })
      .first();

    if (!capitulo) {
      return res.status(404).json({ message: 'Capítulo não encontrado' });
    }

    // Atualiza o capítulo
    await db('capitulos')
      .where({ id: capituloId })
      .update({
        titulo,
        conteudo,
        updated_at: new Date()
      });

    res.json({ message: 'Capítulo atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar capítulo:', error);
    res.status(500).json({ message: 'Erro ao atualizar capítulo' });
  }
});

// EXCLUIR CAPÍTULO
router.delete('/novelas/:novelaId/capitulos/:capituloId', validaToken, async (req, res) => {
  try {
    const { novelaId, capituloId } = req.params;

    // Verifica se o capítulo existe e pertence ao usuário
    const capitulo = await db('capitulos')
      .where({ 
        id: capituloId,
        novela_id: novelaId,
        usuario_id: req.user.id 
      })
      .first();

    if (!capitulo) {
      return res.status(404).json({ message: 'Capítulo não encontrado' });
    }

    // Exclui o capítulo
    await db('capitulos')
      .where({ id: capituloId })
      .del();

    res.json({ message: 'Capítulo excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir capítulo:', error);
    res.status(500).json({ message: 'Erro ao excluir capítulo' });
  }
});

module.exports = router;