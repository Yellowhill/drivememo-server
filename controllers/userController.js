import mongoose from 'mongoose';
import promisify from 'es6-promisify';
const User = mongoose.model('User');


const validateRegister = (req, res, next) => {
    console.log('validateRegister req.body: ', req.body)
    //req.sanitizeBody('name');
    //req.checkBody('name', 'Käyttäjä nimi vaaditaan').notEmpty();
    req.checkBody('email', 'Sähköpostiosoite on vääränlainen').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Salasana ei voi olla tyhjä' ).notEmpty();
    req.checkBody('passwordConfirm', 'Salasanat eivät täsmää').equals(req.body.password);

    const errors = req.validationErrors();
    if(errors) {
        //TODO return the errors to the front-end, take the user back to register with the info he already inputed
        console.log('errors: ', errors);
        res.status(401).send({error: errors}).end();
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
}

export default {
    validateRegister,
    register

}