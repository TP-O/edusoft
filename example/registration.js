const edu = require("edusoft");

edu.config({
  username: "ID",
  password: "Password",
});

edu.register([
  "ID01",
  "ID02",
  "...",
], true);
