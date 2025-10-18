require('dotenv').config();

const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const db = require('./knexfile');
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Funciona');
});

app.post('/login', (req, res) => {
    console.log(req.body.email, req.body.password);

    db.select("*").from("usuarios").where({ email: req.body.email })
        .then(usuarios => {
            const user = usuarios[0];
            console.log(usuarios.length);
            usuarios.forEach(user => console.log(user))

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            else if (user.password_hash == req.body.password) {
                res.status(200).json({ message: 'Dados recebidos com sucesso' });
                //CONTINUAR AQUI
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
})
app.listen(process.env.PORT, () => {
    console.log(`Server está rodando ${process.env.PORT}`);
});