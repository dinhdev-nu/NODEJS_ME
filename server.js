const app = require("./src/app");
require('dotenv').config()

const port = process.env.PORT || 3000


const sever = app.listen( port , () => {
    console.log(`WSV eCommerce start with localhost:${port}`)
})

process.on('SIGINT', () => {
    sever.close( () => console.log(`Exit sever Express`))
})