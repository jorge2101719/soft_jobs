import jwt from "jsonwebtoken"
import { verUsuario } from "./consultas.js"

const reporteDeLaConsulta = async (req, res, next) => {
    const parametros = req.params
    const querys = req.query
    const url = req.url

    console.log(`Hoy ${new Date()}, se ha recibido una consulta en la ruta ${url} con parámetros y querys: `, parametros, querys)

    next()
}

// ------------------------------------------------------------------------------------------------------------------------
const verificarLogin = async (req, res, next) => {
    console.log('Estamos verificando el login en la función middleware verificarLogin...')
    const { email, password } = req.body

    console.log(`Se ha recibido el correo ${email} y la clave ${password}`)

    if(!email || !password) {
        res.status(error.code || 500).send('Credenciales incorrectas...')
    }

    // console.log(`El rol es ${rol} y el lenguaje ${lenguaje}`)

    next()
}

// --------------------------------------------------------------------------------------------------------------------------
const validarToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    console.log('Dentro de validarToken...')

    if (!token) {
        return res.status(401).json({ error: 'Falta el token...'})
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).send({ error: 'Token inválido...'})
    }
}

const verificarSiExisteUsuario = async (req, res, next) => {
    const { id } = req.params

    try {
        await verUsuario(id)
        next()
    } catch (error) {
        res.status(404).send('No se consiguió ningún viaje con este id')
    }
}

export { reporteDeLaConsulta, verificarLogin, validarToken, verificarSiExisteUsuario }