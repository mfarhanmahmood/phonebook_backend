require('dotenv').config();
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/phonebook');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));

morgan.token('data', (req, res) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

app.get('/', (req, res) => {
  res.send(
    '<p>Error 404: Resource not found,<br />Check your URL for mistakes</p>'
  );
  res.status(404);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

app.get('/info', (req, res) => {
  const date = new Date();
  Person.find({}).then(persons => {
    res
      .send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${date.toString()}</p>`
      )
      .end();
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => res.json(person.toJSON()))
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

const verifyName = name => {
  Person.find({ name: name }).then(result => {
    if (result) {
      return true;
    } else {
      return false;
    }
  });
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

  const entry = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  });

  entry.save().then(savedEntry => {
    res.json(savedEntry.toJSON());
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: 'Malformed request body'
    });
  }

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedEntry => {
      res.json(updatedEntry.toJSON());
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
