require('dotenv').config();

const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const db = require('./knexfile');
app.use(express.json());

const validaToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ message: 'Token não enviado' });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido ou expirado' });
        req.user = user; // Anexa os dados do token na requisição
        next(); // Continua para a rota protegida
    });

    res.status(200).json({message:"Solicitação recebida"});
}

app.get('/', (req, res) => {
    res.send('Funciona');
});

app.post('/login', async (req, res) => {
    console.log(req.body.email, req.body.password);

    db.select("*").from("usuarios").where({ email: req.body.email })
        .then(usuarios => {
            const user = usuarios[0];
            console.log(usuarios.length);
            usuarios.forEach(user => console.log(user))

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            else if (bcrypt.compare(req.body.password, user.password_hash)) {
                //CONTINUAR AQUI
                const token = jwt.sign(user.id, process.env.JWT_SECRET);
                console.log(token);
                res.status(200).json({ token });

            }
            else {
                return res.status(401).json({ message: 'Acesso não autorizado' });
            }
        })
})

app.post("/cadastrar", async (req, res) => {
    if (req.body) {

        const password_hash = bcrypt.hashSync(req.body.password, 12);

        const novoUsuario = {
            name: req.body.name,
            email: req.body.email,
            password_hash
        }

        await db('usuarios').insert(novoUsuario);
        res.send('finalizado');

    }
});


app.get('/perfil', validaToken, (req,res)=>{
    console.log("Se você está aqui, você está logado!");
})
app.listen(process.env.PORT, () => {
    console.log(`Server está rodando ${process.env.PORT}`);
});