import mongoose from 'mongoose';
import promisify from 'es6-promisify';
const User = mongoose.model('User');

const validateRegisterPassword = (req, res, next) => {
	req.checkBody('password', 'Salasana ei voi olla tyhjä').notEmpty();
	req.checkBody('passwordConfirm', 'Salasanat eivät täsmää').equals(req.body.password);
	const errors = req.validationErrors();
	if (errors) {
		//TODO return the errors to the front-end, take the user back to register with the info he already inputed
		console.log('errors: ', errors);
		res
			.status(401)
			.send({ error: errors })
			.end();
		return;
	} else {
		next(); // there were no errors!
	}
};

const validateEmail = (req, res, next) => {
	console.log('validateEmail req.body: ', req.body);

	req.checkBody('email', 'Sähköpostiosoite on vääränlainen').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false,
	});

	const errors = req.validationErrors();

	if (errors) {
		//TODO return the errors to the front-end, take the user back to register with the info he already inputed
		console.log('errors: ', errors);
		res
			.status(401)
			.send({ error: errors })
			.end();
		return;
	} else {
		next(); // there were no errors!
	}
};

const register = async (req, res, next) => {
	const user = new User({
		email: req.body.email,
		// name: req.body.name
	});

	const register = promisify(User.register, User);
	await register(user, req.body.password);
	next();
};

const updateuserInfo = async (req, res, next) => {
	console.log('updateuserInfo body: ', req.body);
	User.findById(req.user._id, (err, targetUser) => {
		if (err) {
			console.log('Error in updateuserInfo finding target ', err);
		} else {
			console.log('targetUser before set: ', targetUser);

			targetUser.set({
				name: req.body.name,
				receiverEmail: req.body.email,
			});

			console.log('targetUser after set: ', targetUser);
			targetUser.save((err, updatedUser) => {
				if (err) {
					console.log('Error in updateuserInfo update ', err);
				} else {
					console.log('res.send updateUser: ', updatedUser);
					res.send(updatedUser);
				}
			});
		}
	});
};

export default {
	validateRegisterPassword,
	validateEmail,
	register,
	updateuserInfo,
};
