import pkg from 'pg';
const { Pool } = pkg

// import 'dotenv/config'

import bcrypt from 'bcryptjs'

const pool = new Pool({
    host: 'localhost',
    user: 'jorge',
    password: '1234',
    database: 'softjobs',
    allowExitOnIdle: true
})

// ---------------------------------------------------------
const getUsuarios = async () => {
    console.log('Dentro de la función getUsuarios...')
    const { rows: usuarios } = await pool.query('SELECT * FROM usuarios')
    return usuarios
}

const verUsuario = async (id) => {
    const consulta = 'SELECT * FROM usuarios WHERE id = $1'
    const values = [id]
    const result = await pool.query(consulta, values)
    const [usuario] = result.rows
    return usuario
}

// -------------------------------------- Login -------------------------------------------
/*const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount)
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
}*/

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}

// --------------------------------------------------------------------
const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguaje } = usuario

    console.log('antes de encriptar', password);
    const passwordEncriptada = bcrypt.hashSync(password)
    console.log('después de encriptar',passwordEncriptada);
    
    password = passwordEncriptada
    // const values = [email, passwordEncriptada]

    console.log(email)
    console.log(password)
    console.log(rol)
    console.log(lenguaje)
    
    const values = [email, password, rol, lenguaje]
    const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)'
    await pool.query(consulta, values)
}






export { getUsuarios, verUsuario, verificarCredenciales, registrarUsuario }