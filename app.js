var express    = require('express'),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB 	   = require("./seeds"),
	passport = require('passport'),
	methodOverride = require('method-override'),
	LocalStrategy = require('passport-local'),
	flash = require('connect-flash'),
	User = require('./models/user');

var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');
//seed Database
//seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.static(__dirname +'/public'));
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser:true});
app.use(require('express-session')({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds/",campgroundRoutes);
app.listen(3000, function() {
	console.log("the server is running");
});