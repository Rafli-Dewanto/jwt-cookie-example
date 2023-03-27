import express from "express";
import AuthRoute from './routes/auth.route.js'
import cookieParser from "cookie-parser";
import verifyToken from './middleware/verifyToken.js';
import checkUser from "./middleware/check-user.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('*', checkUser) // must come before auth route to see if user is logged in

app.use(AuthRoute)
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", verifyToken, (req, res) => res.render("smoothies"));

app.listen(process.env.SERVER_PORT, () => console.log(`listening on http://localhost:${process.env.SERVER_PORT}`));
