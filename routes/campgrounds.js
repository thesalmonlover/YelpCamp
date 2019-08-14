var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get('/', function(req, res) {
	
	Campground.find({}, function(err, campgrounds) {
		if(err) {
			console.log('something went wrong');
			
		} else {
			res.render('campgrounds/index', {campgrounds:campgrounds, currentUser:req.user});
		}
	});
	
	
});

router.post('/', middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id : req.user._id,
		username: req.user.username
	}
	var newcampground = {name:name,price:price, image:image, description:desc, author:author};
	//새로운 캠프를 생성해서 db에 넣음
	Campground.create(newcampground, function(err, campground) {
		if(err) {
			req.flash('error', 'Something went wrong');
			console.log('something went wrong');
		} else {
			req.flash('success', "Successfully created new Campground!");
				res.redirect('/campgrounds');
		}
	});
	
	
});

router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new.ejs');
});

router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function(err, found){
		if(err) {
			console.log(err);
		} else {
			res.render('campgrounds/show', {campground:found});
		}
	});
	
});
//수정 폼 보여주기
router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req, res) {
	
	Campground.findById(req.params.id, function(err, found) {
		res.render('campgrounds/edit', {campground:found});
	});

	
	
	
});
//수정하기
router.put('/:id',middleware.checkCampgroundOwnership ,function(req, res) {
	var data = 
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, found) {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			req.flash("successfully edited campground");
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});

//삭제하기
router.delete('/:id',middleware.checkCampgroundOwnership ,function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			req.flash('success', "campground deleted");
			res.redirect('/campgrounds');
		}
	});
});



module.exports = router;