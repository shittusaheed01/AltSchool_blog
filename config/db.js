const mongoose = require('mongoose')


// database connection
module.exports = function connect (app){
  const dbURI = process.env.MONGO_URL;
  const PORT = process.env.PORT
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, dbName:"BlogApp" })
  .then((result) => app.listen(PORT, ()=>{
    console.log(`App running at PORT: ${PORT} and MongoDB Server started`)
  }))
  .catch((err) => console.log(err));
}
