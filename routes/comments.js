var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//댓글 폼 보이기
router.get("/new",middleware.isLoggedIn,function(req, res) {
	Campground.findById(req.params.id, function(err, found) {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground:found});
		}
	});
});

//댓글 작성
router.post('/',middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, found) {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					req.flash('error', "Something went wrong");
					console.log(err);
				} else {
					//add user name and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					
					comment.save();
					found.comments.push(comment);
					found.save();
					req.flash('success', 'Successfully added comment');
					res.redirect('/campgrounds/'+found._id);
				}
			});
		}
	});
});

//댓글 수정 폼
router.get('/:comment_id/edit',middleware.checkComment, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, found) {
		if(err) {
			res.redirect('back');
		} else {
			
			res.render('comments/edit', {campground_id:req.params.id, comment:found});
		}
	});
	
});


//댓글 수정 라우트
router.put('/:comment_id',middleware.checkComment, function(req, res) {
Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, update) {
	if(err) {
		res.redirect('back');
	} else {
		req.flash('success', "successfully edited comment");
		res.redirect('/campgrounds/'+req.params.id);
	}
});

});

//댓글 삭제 라우트
router.delete('/:comment_id',middleware.checkComment, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect('back');
		} else {
			req.flash('success', "Comment deleted");
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});


module.exports=router;