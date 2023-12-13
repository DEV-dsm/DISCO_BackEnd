const app = require("express")();
const router = require("./router/index");
const bodyparser = require("body-parser");
const { sequelize } = require("./models/index");
const cors = require("cors");

const port = 8080;

let corsOptions = {
  origin: "*",
  credentials: true
};

app.use(cors(corsOptions));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/", router);

app.listen(port, () => {
  console.log(`port is listening in port ${port}!`);
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log(`Success to link database!`);
    })
    .catch((err) => {
      console.error(err);
    });
});
