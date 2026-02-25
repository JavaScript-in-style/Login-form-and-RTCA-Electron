const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const getUsers = () => {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data || "[]");
    } 
    
    catch (e) {
        return []; 
    }
};

app.post('/register', (req, res) => {
        const users = getUsers();
        const newUser = req.body;
        users.push(newUser);
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        res.status(200).send("User saved!");
});

app.post('/login', (req, res) => {
    const users = getUsers();
    const {mail, pass} = req.body;
    const checkUser = users.find(u => u.mail === mail && u.pass === pass);
    if(checkUser) {
        res.status(200).json(checkUser.name);
    }
    else {
        res.status(404).send('Incorrect Credentials!')
    }
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public' , 'rtca index.html'));
});

io.on('connection', (user) => {
    console.log('A user has connected');

    user.on('message', (data) => {
        io.emit('message', data);
    });
});

const PORT = 8080;

http.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
});