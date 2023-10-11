const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');


const secretKey = 'as98dua'; 

const db = new sqlite3.Database('database.db');

// Create the 'names' table if it doesn't exist
db.run(`
    DROP TABLE usuarios
`);

db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT,
        contrasena TEXT,
        tipoUsuario TEXT,
        nombre TEXT,
        apellido TEXT,
        email TEXT,
        telefono INTEGER
    )
`);

// db.run(`
// DELETE FROM usuarios
// `)

app.use(express.static('public'));
app.use(express.json());

db.get('SELECT * FROM usuarios WHERE tipoUsuario = admin', (err, row) => {
    if (err) {
        console.error(err.message);
        console.log("{ error: 'Error al veificar la existencia del usuario' }");
        // return res.status(500).json({ error: 'Error al veificar la existencia del usuario' });
        db.run(`
            INSERT INTO usuarios (usuario,contrasena,tipoUsuario,nombre,apellido,email,telefono) VALUES ("admin123","4dm1n123","admin","Jose","Perez","testadmin@test.com",31237377849)
        `);
        return 0
    }

    if (row) {
        // User with the provided email already exists
        // return res.status(400).json({ error: 'User with this email already exists' });
        console.log("{ error: 'Usuario admin ya existe' }");
        return 1;
    }

    // User with the provided email doesn't exist, proceed with insertion
    
    console.log("Usuario agregado");
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (row) {
            console.log(row);
            // User found, successful login
            // alert(row);
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            
            res.cookie('token', token, { httpOnly: false });
            const rol = row.tipoUsuario;
            console.log(rol);
            res.cookie('rol', rol, { httpOnly: false });  
            return res.status(200).json({ message: "Inicio de sesion correcto" });
        } else {
            // User not found or incorrect credentials
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
    });
});


db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) {
        console.error(err.message);
        // res.status(500).json({ error: 'Failed to fetch data' });
    } else {
        console.log('All data:', rows);
        // res.json(rows);
    }
});

app.get("/lista-cuidadores", verifyToken, (req, res) => {
    db.get('')
})
app.use(express.static('public'));
app.use(express.json());


function verifyToken(req, res, next) {
    const token = req.cookies.token; // Get the token from the cookie

    if (!token) {
        return res.status(403).json({ error: 'Unauthorized' }); // Token not provided
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Unauthorized' }); // Token verification failed
        }

        req.user = user; // Attach the user object to the request for further processing
        next(); // Pass the execution to the next middleware or route handler
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});