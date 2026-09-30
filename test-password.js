const bcrypt = require("bcryptjs");

const password = "TestPassword123!";
const hash = "$2b$12$cfKarlQphL24gQ9kPYrv3uBKLBclmeOycgfM6ZqlkAZcQ8wAmVotO";

bcrypt.compare(password, hash).then((result) => {
  console.log("MATCH:", result);
});