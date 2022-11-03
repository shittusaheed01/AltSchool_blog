const app = require('./app')
const connectDB = require('./config/db')

//database connection
connectDB(app)