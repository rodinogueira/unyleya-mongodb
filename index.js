const express = require("express");
const connectDatabase = require("./database/database");
const authService = require("./service/auth.service");
const app = express();

connectDatabase();

const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    console.log(token());
    res.send("Hello World")
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginService(email);

    if(!user) {
        return res.status(400).send({ message: "Usuario nao encontrado, tente novamente"})
    }

    if(password != user.password) {
        return res.status(400).send({ message: "Senha invalida" })
    }

    user.token = token();

    await authService.updateToken(user);
    console.log(user);

    res.send(user);
});

app.post("/validar", async (req, res) => {
    try {

        const { email, token } = req.body;
        const user = await authService.loginService(email);
    
        if(!user) {
            return res.status(400).send({ message: "Usuario nao encontrado, tente novamente"})
        }

        if(token != user.token) {
            return res.status(400).send({ message: "Token incorreto ou expirado, tente novamente" })
        }

        user.token = "";

        await authService.updateToken(user);
        console.log(user);
    
        res.send(user);
    } catch(error) {
        console.log(error);
    }
});

const token = function() {
    let token = Math.random().toString(36).substring(2);
    return token;
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});