module.exports = app => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();
  
  // Create a new User,
  //REQUIRES: name, splash, email (no @tulane), 
  //id (unique int, should be card number), 
  //user (username of sponsoring fabTech/admin), 

  router.post("/", users.create);

  // Retrieve all users, excludes password column (they are hashed but we shouldn't let anyone access them anyways)
  router.get("/", users.findAll);

  // Retrieve all fabtech users, excludes password column. currently broken but not really needed anyways.
  router.get("/fabTech", users.findAllFabtechs);

  // Retrieve a single Users with id
  router.get("/:id", users.findOne);
  
  router.get("/email/:email", users.findEmail);
  //Verify a user via email
  router.get("/:email/verify",users.verify);
  // Update a User with id
  //REQUIRES user, authPassword of higher permission (fabtech cannot update admin acct etc.)
  router.put("/:id", users.update);

  // Delete a User with id
  //REQUIRES user, authPassword of higher permission (fabtech cannot update admin acct etc.)
  router.delete("/:id", users.delete);

  // Delete all users
  //router.delete("/", users.deleteAll); //def dont need this in the api
  app.use('/api/users', router);
};