import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorHandlers from './handlers/errorHandlers.js';
import drivememoController from './controllers/drivememoController.js';
import userController from './controllers/userController.js';
import authController from './controllers/authController.js';
import emailController from './controllers/emailController.js';
import expressValidator from 'express-validator';
import passport from 'passport';
const { catchErrors } = errorHandlers;
import './handlers/passport.js';

const MongoStore = connectMongo(session);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // suppress depricated message

/**expose a bunch of methods for validating data. Used heavily on userController.validateRegister */
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(
	session({
		secret: process.env.SECRET,
		key: process.env.KEY,
		resave: false,
		saveUninitialized: false,
		name: 'id',
		cookie: {
			maxAge: 11800000, //1800000 30 mins
			//httpOnly: true,
			// secure: true
		},
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			ttl: 14 * 24 * 60 * 60, //14 days
		}),
	})
);

app.use(passport.initialize());
app.use(passport.session());

//1.validate the registration data
//2. register the user
//3. log the user in
app.post(
	'/register',
	userController.validateEmail,
	userController.validateRegisterPassword,
	userController.register,
	authController.login,
	(req, res) => {
		console.log('register user: ', req.body);
		res.send({ email: req.body.email });
	}
);

// app.use((req,res,next)=> {
//   console.log('aaaaaaaa: ', req.body);
//   next();
// })

app.get('/checkauth', authController.checkAuth);

app.post('/login', authController.login, (req, res) => {
	console.log('user: ', req.body);
	res.send({ email: req.body.email });
});

app.get('/logout', authController.logout);
//app.post('/login', catchErrors(userController.login));

app.post(
	'/adddrivememo',
	authController.isLoggedIn,
	catchErrors(drivememoController.addDrivememo)
);

app.get(
	'/checkdraft',
	authController.isLoggedIn,
	catchErrors(drivememoController.checkdraft)
);

app.post(
	'/updateuserinfo',
	userController.validateEmail,
	catchErrors(userController.updateuserInfo)
);

//app.post('/drivememo', emailController.drivermemo);
//Otherwise this was a really bad error we didn't expect!
// if (app.get('env') === 'development') {
//     /* Development Error Handler - Prints stack trace */
//     app.use(errorHandlers.developmentErrors);
//   }

export default app;
