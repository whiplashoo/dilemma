function voteImage(which, pairId) {
	Meteor.call('voteImage',which, pairId);
}

Template.Pair.helpers({
	createdAt: function() {
		return moment(this.createdAt).fromNow();
	},
	ownPair: function() {
		return this.userId === Meteor.userId();
	},
	pathForUser: function() {
		var pair = this;
		var params = {  username : pair.username };
		var routeName = "userPage";
		var path = FlowRouter.path(routeName, params);

		return path;
	},
	urlLeft: function() {
		var img = Images.findOne({ _id: this.left});
		console.log(img);
		if (img)
			return img.url();
	},
	urlRight: function() {
		var img = Images.findOne({ _id: this.right});
		if (img)
			return img.url();
	},
	isLeftVoted: function() {
		var username = Meteor.user().profile.name;
		if (Pairs.findOne({_id: this._id}).leftVotedBy.indexOf(username) !== -1){
			return 'animated';
		}
		return;
	},
	isRightVoted: function() {
		var username = Meteor.user().profile.name;
		if (Pairs.findOne({_id: this._id}).rightVotedBy.indexOf(username) !== -1){
			return 'animated';
		}
		return;
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
	}
});