function voteImage(which, pairId) {
	Meteor.call('voteImage',which, pairId);
}
function animate(thumb) {
	if(!$(thumb).hasClass("animated")){
		$(thumb).addClass("animated"); 
	}
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
		return Images.findOne({ _id: this.left}).url();
	},
	urlRight: function() {
		return Images.findOne({ _id: this.right}).url();
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
	'dblclick #left-img': function(e) {
		var thumb = $(e.target).parent().siblings('.imgVotes').children('i');
		animate(thumb);
		voteImage('left', this._id);
	},
	'dblclick #right-img': function(e) {
		var thumb = $(e.target).parent().siblings('.imgVotes').children('i');
		animate(thumb);
		voteImage('right', this._id);
	},
	'click #left-thumb': function(e) {
		animate(e.target);
		voteImage('left', this._id);
	},
	'click #right-thumb': function(e) {
		animate(e.target);
		voteImage('right', this._id);
	}
});