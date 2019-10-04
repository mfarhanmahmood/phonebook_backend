require('dotenv').config();
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const Phonebook = require('./models/phonebook');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));

morgan.token('data', (req, res) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1
//   },
//   {
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//     id: 2
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: 3
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: 4
//   }
// ];

app.get('/', (req, res) => {
  res.send(
    '<p>Error 404: Resource not found,<br />Check your URL for mistakes</p>'
  );
  res.status(404);
});

app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

app.get('/info', (req, res) => {
  const date = new Date();
  Phonebook.find({}).then(persons => {
    res
      .send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${date.toString()}</p>`
      )
      .end();
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const entry = persons.find(p => p.id === id);
  if (entry) {
    res.json(entry);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
});

const generateId = () => {
  return Math.trunc(Math.random() * 10000000);
};

const verifyName = name => {
  return persons.find(p => p.name === name);
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'Name missing'
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'Number missing'
    });
  }

  if (verifyName(body.name)) {
    return res.status(400).json({
      error: 'Name must be unique'
    });
  }

  const entry = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(entry);
  res.json(entry);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
