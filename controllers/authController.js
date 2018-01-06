import passport from 'passport';

const login = passport.authenticate('local');

const logout = (req, res) => {
    req.logout();
    res.send('successfully logged out')
    //TODO inform the user that they successfully logged out and in client redirect them to login page

}

const isLoggedIn = (req, res, next) => {
    // first check if the user is authenticated
    if (req.isAuthenticated()) {
      next(); // carry on! They are logged in!
      return;
    }
    //TODO inform the user in the client side, that they need to be logged in and redirect them to login
    //req.flash('error', 'Oops you must be logged in to do that!');
    //res.redirect('/login');
    res.send('u need to be logged in')
  };

const checkAuth = (req, res) => {
    console.log('checkauth controller', req.isAuthenticated())
    if(req.isAuthenticated()) {
        const {
            email,
            name,
        } = req.user;
        //FIXME why can't we get name?
        console.log('-------------checkAuth: ', req.user);
        res.send({email, name}).end();
    }
    else {
        res.status(500).send('not authenticated');
    }
}

export default {
    login,
    logout,
    isLoggedIn,
    checkAuth
}