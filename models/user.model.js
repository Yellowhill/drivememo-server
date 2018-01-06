import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

import md5 from 'md5';
import validator from 'validator';
import mongodbErrorHandler from 'mongoose-mongodb-errors';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        //validate: [validator.isEmail, 'Sähköpostiosoite on vääränlainen'],
        validate: {validator: (value) => validator.isEmail(value), msg: 'Sähköpostiosoite on vääränlainen'},
        required: 'Sähköpostiosoite puuttuu'
    },
    // name: {
    //     type: String,
    //     required: 'Nimi puuttuu',
    //     trim: true
    // }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
//userSchema.plugin(mongodbErrorHandler);

export default mongoose.model('User', userSchema);