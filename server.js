const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            mail VARCHAR(100) UNIQUE,
            pass VARCHAR(100)
        )
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            text TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
};

initDB();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', async (req, res) => {
    const { name, mail, pass } = req.body;
    await pool.query(
        'INSERT INTO users (name, mail, pass) VALUES ($1, $2, $3)',
        [name, mail, pass]
    );
    res.status(200).send("User saved!");
});

app.post('/login', async (req, res) => {
    const { mail, pass } = req.body;
    const result = await pool.query(
        'SELECT * FROM users WHERE mail = $1 AND pass = $2',
        [mail, pass]
    );
    if(result.rows.length > 0) {
        res.status(200).json(result.rows[0].name);
    } else {
        res.status(404).send('Incorrect Credentials!');
    }
});

app.post('/change-pass', async (req, res) => {
    const {pass, name} = req.body;
    const result = await pool.query('UPDATE users set pass = $1 where name = $2', [pass, name]);
    res.status(200).send('Password Changed!');
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public' , 'rtca index.html'));
});

io.on('connection', async (user) => {
    console.log('A user has connected');
    const result = await pool.query(`SELECT * FROM messages`);
    user.emit('history', result.rows);

    user.on('message', (data) => {
        const {name, text} = data;
        const storeMessage = async () => {
            await pool.query(`INSERT INTO messages (name, text) VALUES ($1, $2)`, [name, text])
        }
        io.emit('message', data);
        storeMessage();
    });
});

const PORT = 8080;

http.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
});