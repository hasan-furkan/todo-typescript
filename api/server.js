const app = require("../index");
const config = require("../config");
const port = config.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
