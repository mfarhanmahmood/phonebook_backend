const mongoose = require('mongoose')

if (process.argv[2].length < 3) {
  console.log('Please enter your database password as parameter.')
  process.exit(1)
}
const password = process.argv[2]
let name = null
let number = null

if (process.argv.length === 4) {
  console.log('Please enter both name and number')
  process.exit(1)
}

if (process.argv.length === 5) {
  if (process.argv[3].length < 3) {
    console.log('Please enter a name longer than 3 character as parameter.')
    process.exit(1)
  }
  if (process.argv[4].length < 9) {
    console.log('Please enter a number longer than 12 character as parameter.')
    process.exit(1)
  }

  name = process.argv[3]
  number = process.argv[4]
}

const url = `mongodb+srv://admin:${password}@phonebook-pqtux.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err !== null) console.log(err)
  }
)

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
})

const Person = mongoose.model('Person', PersonSchema)

// executes if only password is given as parameter
if (name === null) {
  Person.find({}).then(persons => {
    console.log('Phonebook: ')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

// executes if name and number are given as parameters
if (name !== null) {
  const person = new Person({
    name,
    number,
    date: new Date()
  })

  person.save().then(result => {
    console.log('New entry added to the phonebook.', result._id)
    mongoose.connection.close()
  })
}
