const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const userModel = require("./../models/Users");

let serverApp = app.listen(4000, () => {
  console.log(`app started`);
});;
//  Runs before all the tests
beforeAll((done) => {
 // local db for testing
  const TEST_URI = "mongodb://localhost:27017/";
  mongoose.connect(TEST_URI);

  mongoose.connection.on("connected", async () => {
    console.log("Connected to MongoDB Successfully");
    done();
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
    done();
  });
});

//  Runs after all the tests
afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(done);
  });
  serverApp.close()
});

it('should signup a user', async () => {
  const response = await request(serverApp).post('/user/signup')
  .set('content-type', 'application/json')
  .send({ 
      email: "ademola@gmail.com",
      password:"qwerty",
      first_name:"Ademola",
      last_name:"Adekunle"
  })

  expect(response.status).toBe(201)
  expect(response.body).toHaveProperty('message')
  expect(response.body).toHaveProperty('user')
  expect(response.body).toHaveProperty('token')
  expect(response.body.user).toHaveProperty('email', 'ademola@gmail.com')
  expect(response.body.user).toHaveProperty('first_name', 'Ademola')
  expect(response.body.user).toHaveProperty('last_name', 'Adekunle')        
})


it('should login a user', async () => {
  // create user in out db
  const user = {
    email: "saheed@gmail.com",
    password:"qwerty",
    first_name:"Saheed",
    last_name:"Shittu"
  };
  await userModel.create(user);

  // login user
  const response = await request(serverApp)
  .post('/user/login')
  .set('content-type', 'application/json')
  .send({ 
      email: 'saheed@gmail.com', 
      password: 'qwerty'
  });


  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('message')
  expect(response.body).toHaveProperty('user')
  expect(response.body).toHaveProperty('token')      
})
