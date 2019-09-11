const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<p>Error 404: Resource not found,<br />Check your URL for mistakes</p>')
    res.status(404)
})


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date.toString()}</p>`
    ).end();
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const entry = persons.find(p => p.id === id)
    if(entry) {
        res.json(entry)
    }
    else {
        res.status(404).end()
    }
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()

})

const generateId = () => {
    return Math.trunc(Math.random() * 10000000)
}

app.post('/api/persons' , (req, res) => {
    const body = req.body

    const entry = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(entry)
    res.json(entry)
})




const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})