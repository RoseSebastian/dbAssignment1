const express = require('express')
const cors = require('cors');
const mongoose = require("mongoose")
const dotenv = require('dotenv')
dotenv.config("./.env")
const dbPassword = process.env.DB_PASSWORD
// `mongodb+srv://rosenellikattil:${dbPassword}@main.g57tu.mongodb.net/?retryWrites=true&w=majority&appName=main`

mongoose.connect("mongodb://localhost:27017/")
.then(res => {
    console.log("DB connected successfully")
}).catch(err => {
    console.log("DB connecion failed")
})

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean
});
const TodoModel = mongoose.model('Todo', TodoSchema);

const UserSchema = new mongoose.Schema({
    username : String,
    email: String,
    phone: String,
    password: String
})

const UserModel = mongoose.model('User', UserSchema)

const app = express()
const port = 3000

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type'
  };
app.use(cors(corsOptions));
app.use(express.json());


// GET /todos - Retrieve all to-do items
app.get('/todos', (req, res) => {
    TodoModel.find()
    .then(todo =>{
        res.json(todo);
    })
    .catch(err => {
        res.json(err);
    })
});

// POST /todos - Create a new to-do item
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const newTodo = {
        title,
        description: description || '',
        completed: false
    };
    TodoModel.create(newTodo)
    .then(item => {
        if(item){
            res.status(201).json(item);
        }else{
            return res.status(404).json({ error: 'To-do item not Added' });
        }
    })
    .catch(err =>{
        return res.status(500).json({ error: err });
    })
});

// PUT /todos/:id - Update a to-do item by ID
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndUpdate(id, req.body, { new: true })
    .then(todo => {
        if(todo){
            res.json(todo);
        }else{
            return res.status(404).json({ error: 'To-do item not found' });
        }
    })
    .catch(err => {
        return res.status(500).json({ error: err });
    })    
});

// DELETE /todos/:id - Delete a to-do item by ID
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete(id)
    .then(todo => {
        if(todo){
            res.status(204).send();
        }else{
            return res.status(404).json({ error: "Todo does not exists" });
        }
    })
    .catch(err => {
        return res.status(500).json({ error: err });
    })
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})