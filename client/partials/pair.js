function voteImage(which, pairId) {
	Meteor.call('voteImage',which, pairId);
}

Template.Pair.helpers({
	createdAt: function() {
		return moment(this.createdAt).fromNow();
	},
	ownPair: function() {
		if (Meteor.user())
			return this.userId === Meteor.userId();
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
		if (Meteor.user().profile)
			var username = Meteor.user().profile.name;
		if (Pairs.findOne({_id: this._id}).leftVotedBy.indexOf(username) !== -1){
			return 'animated';
		}
		return;
	},
	isRightVoted: function() {
		if (Meteor.user().profile)
			var username = Meteor.user().profile.name;
		if (Pairs.findOne({_id: this._id}).rightVotedBy.indexOf(username) !== -1){
			return 'animated';
		}
		return;
	},
	following: function() {
		if (Meteor.user().profile) {
			return Meteor.user().profile.following.indexOf(this.userId) !== -1;		
		}

	}
});

Template.Pair.events({
	'click .delete-pair': function(e) {
		e.preventDefault();

		var sure = confirm('Are you sure you want to delete this dilemma?');
		if (sure === true) {
			Pairs.remove({ _id:this._id }, function(error,result) {
				if (error) {
					toastr.error("Delete failed... " + error);
				} else {
					toastr.success('Dilemma deleted!');
				}
			})
		}
	},
	'dblclick .left-img, click .left-thumb': function(e) {
		voteImage('left', this._id);
	},
	'dblclick .right-img, click .right-thumb': function(e) {
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
	}
});