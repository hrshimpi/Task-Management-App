const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const app = express();
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const bodyParser = require('body-parser')
const cors = require('cors');
const session = require('express-session');


require('dotenv').config();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
// eslint-disable-next-line no-undef
const dbURI = process.env.db_URI;
// eslint-disable-next-line no-undef
const sessionSecretKey = process.env.sessionSecretKey;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(cors());
app.use(session({
  secret:sessionSecretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}))


// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.set("strictQuery", false);

mongoose.connect(dbURI)
  .then(() => app.listen(PORT,()=>{
  }))
  .catch((err) => console.log(err));

var corsOptions = {
  origin:'http://localhost:3003',
  optionsSuccessStatus:200, 
}

app.use(cors(corsOptions));   //cors

app.use(checkUser);
app.get('/', requireAuth, (req, res) => res.render('home'));
app.use(authRoutes);

module.exports = app;