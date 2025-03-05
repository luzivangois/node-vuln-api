const express = require('express')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/routes')
const cors = require('cors')

const app = express()
const PORT = 8081

app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', userRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})