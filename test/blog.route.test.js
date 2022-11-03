const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");


const userModel = require("./../models/Users");
const blogModel = require("./../models/Blog")

//  Runs before all the tests
let token;
let author_id;
let serverApp = app.listen(4000, () => {
  console.log(`app started`);
})
beforeAll((done) => {

  // local db for testing
  const TEST_URI = "mongodb://localhost:27017/";
  mongoose.connect(TEST_URI);

  mongoose.connection.on("connected", async () => {
    console.log("Connected to MongoDB Successfully");
      
    //create a user
      const user = {
        email: "saheed@gmail.com",
        password:"qwerty",
        first_name:"Saheed",
        last_name:"Shittu"
      };
      await userModel.create(user);

      //login created user
      const loginResponse = await request(serverApp)
      .post('/user/login')
      .set('content-type', 'application/json')
      .send({ 
          email: 'saheed@gmail.com', 
          password: 'qwerty'
      });
      token = loginResponse.body.token;
      author_id = loginResponse.body.user.id;

      //create blogs in our db
      await blogModel.create({
        title:"7 bullets",
        description:"A movie anns",
        tags:["Netflix", "van damme",  "Movie"],
        body:"Veteran mercenary Samson Gaul (Jean-Claude Van Damme) is retired from combat when his actions resulted in the deaths of helpless victims, but now he's the last hope for a desperate father. Mixed martial artist, Andrew Fayden (Joe Flanigan) knows how to fight, but alone he's unprepared to navigate the corrupt streets of a foreign city to find his kidnapped daughter. Together, these two try to stop a network of criminals that prey upon the innocent",
        author_id:author_id
    })
    
      await blogModel.create({
        title:"6 bullets",
        description:"A movie ",
        tags:["Netflix", "van damme",  "Movie"],
        body:"Veteran mercenary Samson Gaul (Jean-Claude Van Damme) is retired from combat when his actions resulted in the deaths of helpless victims, but now he's the last hope for a desperate father. Mixed martial artist, Andrew Fayden (Joe Flanigan) knows how to fight, but alone he's unprepared to navigate the corrupt streets of a foreign city to find his kidnapped daughter. Together, these two try to stop a network of criminals that prey upon the innocent",
        author_id:author_id
    })

    done();
  });
});

//  Runs after all the tests(close server and mongodb)
afterAll((done) => {
  
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(done);
  });
  serverApp.close()
});

describe('Blog Route',  () => {
  //read
  it('should return all blogs', async () => {

      const response = await request(serverApp)
      .get('/blog')
      .set('content-type', 'application/json')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('blog')
      expect(response.body).toHaveProperty('message', "blogs gotten")
  })
  //read with query
  it('should return blogs with state: draft', async () => {
      const response = await request(serverApp)
      .get('/blog?state=draft')
      .set('content-type', 'application/json')
      // .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('blog')
      expect(response.body).toHaveProperty('message', "blogs gotten")
      expect(response.body.blog.every(blog => blog.state === "draft")).toBe(true)
  })
  //read current user blog
  it('should return logged in blogs', async () => {
      const response = await request(serverApp)
      .get('/blog/me')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('blog')
      expect(response.body).toHaveProperty('message', "blogs gotten")
      expect(response.body.blog.length).toBe(2)
  })
  //read with id
  it('should return blogs with specified id', async () => {
    const { _id: blogId } = await blogModel.findOne({
      title:"6 bullets"})

      const response = await request(serverApp)
      .get(`/blog/${blogId}`)
      .set('content-type', 'application/json')
      // .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', "blogs gotten")
      expect(response.body).toHaveProperty('blog')
      expect(response.body.blog).toHaveProperty('description', "A movie")
  })
  //post blog
  it('should post blog', async () => {

      const response = await request(serverApp)
      .post(`/blog/`)
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({  
        "title":"Better Call Saul S06Ep7",
        "tags":["Movie", "Netflix",  "Breaking Bad",  "AltSchool"],
        "description":"Wikipedia synopsis",
        "body":"On the day of the Sandpiper settlement conference, Jimmy and Kim hastily reshoot their photos with the actor impersonating Casimiro, then pass them to Howard's private investigator, who is actually working for them. Howard ingests Caldera's drug upon contact with the photos and embarrasses himself at the conference by appearing manic and accusing Casimiro of accepting a bribe. Howard and Cliff are forced to settle the Sandpiper case for less than they wanted. Lalo surveils Gus's laundry, realizing he has built a hidden meth lab there. Calling Hector, he tells him he will attack Gus that night after realizing Gus's men monitored his call. Mike alerts Gus and redirects his security teams to protect Gus, leaving Kim and Jimmy’s apartment unprotected. Howard deduces that Jimmy and Kim plotted his character assassination and confronts them at their apartment. Lalo arrives soon afterward, intending to interrogate Jimmy and Kim. Kim urges Howard to leave, but Lalo kills him with a gunshot to his head."
    })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('blog')
      expect(response.body.blog).toHaveProperty('title', "Better Call Saul S06Ep7")
      expect(response.body.blog).toHaveProperty('description', "Wikipedia synopsis")
      expect(response.body.blog).toHaveProperty('reading_time')
  })
  //update blog
  it('should update blogs with specified id', async () => {
    const { _id: blogId } = await blogModel.findOne({
      title:"6 bullets"})

      const response = await request(serverApp)
      .patch(`/blog/${blogId}`)
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({state:"published"})

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('message', "blog updated")
      expect(response.body).toHaveProperty('blog')
      expect(response.body.blog).toHaveProperty('state', "published")
  })
  //delete blog with id
  it('should delete blog with specified id', async () => {
    const { _id: blogId } = await blogModel.findOne({
      title:"6 bullets"})

      const response = await request(serverApp)
      .delete(`/blog/${blogId}`)
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('message', "blog deleted")
  })

});