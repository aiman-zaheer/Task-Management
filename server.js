const connection = require("./db.js");
const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config();

//connecting database
connection();

app.listen(4000, () => {
  console.log(`Server listening on port 4000`);
});
