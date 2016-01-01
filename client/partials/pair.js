function voteImage(which, pairId) {
	Meteor.call('voteImage',which, pairId);
}

/* Start-up
–––––––––––––––––––––––––––––––––––––––––––––––––– */
Template.Single.created = function() {
	var self = this;
	self.autorun(function() {
		var pairId = FlowRouter.getParam('pairId');
		self.subscribe('singlePair', pairId);
		self.subscribe('onlyTwoImages', pairId);
	});
};

Template.Pair.rendered = function() {
	$('#directLinkModal').on('shown.bs.modal', function () {
		$('#directLinkModal .direct-link-area').focus();
	});
	Meteor.setTimeout(function(){
		$('.left-img>img').each(function() {
			var rightH = $(this).parent().parent().siblings().find('.right-img>img').height();
			var leftH = $(this).height();
			if ( leftH > rightH){
				$(this).parent().parent().siblings().find('.right-img').height( leftH );
			}
			else {
				$(this).parent().height(rightH);
			}
		});
	} , 2000);
	// Change with jQuery the 'Add Comment' button, because the textarea template
	// from the comments-ui package is not accessible.
	$('.new-comment-area > form > button').removeClass('btn btn-primary').addClass('cbtn cbtn-normal cbtn-black');
};
Template.Single.rendered = function() {
	$('#directLinkModal').on('shown.bs.modal', function () {
		$('#directLinkModal .direct-link-area').focus();
	});
	Meteor.setTimeout(function(){
		$('.left-img>img').each(function() {
			var rightH = $(this).parent().parent().siblings().find('.right-img>img').height();
			var leftH = $(this).height();
			if ( leftH > rightH){
				$(this).parent().parent().siblings().find('.right-img').height( leftH );
			}
			else {
				$(this).parent().height(rightH);
			}
		});
	} , 2000);
	// Change with jQuery the 'Add Comment' button, because the textarea template
	// from the comments-ui package is not accessible.
	$('.new-comment-area > form > button').removeClass('btn btn-primary').addClass('cbtn cbtn-action');
};
/* Helpers
–––––––––––––––––––––––––––––––––––––––––––––––––– */
var pairHelpers = {
	createdAt: function() {
		return moment(this.createdAt).fromNow();
	},
	ownPair: function() {
		if (Meteor.user())
			return this.userId === Meteor.userId();
	},
	profilePage: function() {
		var page = FlowRouter.getRouteName();
		return page === 'userPage';
	},
	pathForUser: function() {
		var pair = this;
		var params = {  username : pair.username };
		var routeName = "userPage";
		var path = FlowRouter.path(routeName, params);
		return path;
	},
	pathForVoter: function(voterUsername) {
		var params = {  username : voterUsername};
		var routeName = "userPage";
		var path = FlowRouter.path(routeName, params);
		return path;
	},
	pathForPair: function() {
		var params = {  pairId : this._id};
		var routeName = "singleDilemma";
		var path = FlowRouter.path(routeName, params);
		return path;
	},
	urlLeft: function() {
		var img = Images.findOne({ _id: this.left});
		if (img)
			return img.url();
	},
	urlRight: function() {
		var img = Images.findOne({ _id: this.right});
		if (img)
			return img.url();
	},
	isLeftVoted: function() {
		if (Meteor.user())
			var username = Meteor.user().profile.name;
		if (Pairs.findOne({_id: this._id}).leftVotedBy.indexOf(username) !== -1){
			return 'animated';
		}
		return;
	},
	isRightVoted: function() {
		if (Meteor.user())
			var username = Meteor.user().profile.name;
		if (Pairs.findOne({_id: this._id}).rightVotedBy.indexOf(username) !== -1){
			return 'animated';
		}
		return;
	},
	following: function() {
		if (Meteor.user()) {
			return Meteor.user().profile.following.indexOf(this.userId) !== -1;		
		}

	}
};

Template.Pair.helpers(pairHelpers);
Template.Single.helpers(pairHelpers);

Template.Single.helpers({
	pair: function() {
		return Pairs.findOne();
	}
});

Template.Social.helpers({
	currentURL: function() {
		return 'http://localhost:3000/' + FlowRouter.current().path;
	}
})

/* Events
–––––––––––––––––––––––––––––––––––––––––––––––––– */
var pairEvents = {
	'click .delete-pair': function(e) {
		e.preventDefault();
		Session.set('selectedPair', this._id);
	},
	'click #deleteThePair': function(){
		var pairId = Session.get('selectedPair');
		Meteor.call('deletePair', pairId, function(error,result){
			if (error) {
				toastr.error("Something went wrong..." + error);
			}
			else {
				toastr.success('Deleted!');
			}
		});
	},
	'dblclick .left-img, click .left-thumb': function(e) {
		if (Meteor.user()){
			voteImage('left', this._id);
		}
	},
	'dblclick .right-img, click .right-thumb': function(e) {
		if (Meteor.user())
			voteImage('right', this._id);
	},
	'click .follow': function(e) {
		var pairToFollow = this._id;
		Meteor.call('follow', pairToFollow, function(error,result){
			if (error) {
				toastr.error("Something went wrong..." + error);
			}
			else {
				$(e.target).removeClass('follow').addClass('unfollow').html('Unfollow');
				toastr.success('Followed!');
			}
		});
	},
	'click .unfollow': function(e) {
		var pairToUnfollow = this._id;
		Meteor.call('unfollow', pairToUnfollow, function(error,result){
			if (error) {
				toastr.error("Something went wrong..." + error);
			}
			else {
				$(e.target).removeClass('unfollow').addClass('follow').html('Follow');
				toastr.success('Unfollowed!');
			}
		});
	},
	'click .get-direct-link': function(e,instance){
		var pairId = this._id;
		var link = "http://localhost:3000/dilemmas/" + pairId;
		$('#directLinkModal .direct-link-area').html(link);
		$('#directLinkModal .direct-link-area').focus().select();
	}
}

Template.Pair.events(pairEvents);
Template.Single.events(pairEvents);

