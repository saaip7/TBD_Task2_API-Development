const express = require("express")
const bookRoutes = require('./src/Book/routes')

const app = express()
const port = 3000

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Welcome to the Bookstore!")
})

app.use('/api/grd/Books', bookRoutes)

app.listen(port, () => console.log(`Server is running on port ${port}`))