require('dotenv').config()

const config = {
    MONGO_URL:process.env.MONGO_URL,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
}

module.exports = config