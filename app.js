const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = 8080;
const cors = require("cors");

app.use(
  cors({
    credentials: true,
    origin: [
      "https://669512c91a375517b959417e--startling-alpaca-4ff4e4.netlify.app",
    ],
    methods: ["POST", "GET"],
  })
);

app.use(
  session({
    secret: "mysecret",
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // Session expires after 1hr
      sameSite: "none",
      secure: true,
      httpOnly: true, // Ensures cookie is not accessible via JavaScript
    },
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.post("/capture", async (req, res) => {
  if (req.session.user) {
    return res.json({ message: "session already exist!" });
  }
  const user = req.body.otherData;
  req.session.user = user;
  return res.json({ message: "session created!" });
});

app.get("/validate", async (req, res) => {
  if (!req.session.user) {
    return res.json({ message: "session does not exist" });
  }
  return res.json(req.session.user);
});

app.listen(port, () => {
  console.log(`Sever is running at ${port}`);
});
