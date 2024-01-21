// Basado en lo visto en tutoría y el documento del profesor
import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

import jwt  from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'
// import morgan from 'morgan'

import { getUsuarios, verUsuario, registrarUsuario, verificarCredenciales } from './consultas.js'
import { reporteDeLaConsulta, verificarSiExisteUsuario } from './middleware.js'

const app = express()

const PORT = process.env.PORT || 3000;

app.listen(3000, console.log('Servidor trabajando...'))

app.use(cors())
app.use(express.json())
// app.use(morgan('dev'))

// ---------------------------------------------------
// GET/usuarios
app.get('/usuarios', reporteDeLaConsulta, async (req, res) => {
    try {
        const usuarios = await getUsuarios()
        res.json(usuarios)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.get('/usuarios/:id', reporteDeLaConsulta, verificarSiExisteUsuario, async (req, res) => {
    const { id } = req.params
    const usuario = await verUsuario(id)
    res.json(usuario)
})


// POST/usuarios
app.post('/usuarios', reporteDeLaConsulta, async (req, res) => {
    try {
        const usuario = req.body

        console.log('Dentro de la ruta POST/usuarios');

        await registrarUsuario(usuario)
        res.send('Usuario creado con éxito')
    } catch (error) {
        console.log('Error en creación de usuario', error);
        res.status(500).send(error)
    }
})


// --------------------------------Login ------------------
// POST/login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

