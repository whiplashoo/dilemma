Template.UnwrapUsers.created = function() {
	var self = this;
	self.wrapped = new ReactiveVar(true);
};

var split = 3;

Template.UnwrapUsers.helpers({
	reverse: function() {
		return this.reverse();
	},
	hasMoreUsers: function(){
		return this.length > split;
	},
	restcount: function(){
		return this.length - split;
	},
	first: function(){
		return this.reverse().slice(0,split);
	},
	rest: function(){
		return this.reverse().slice(split);
	},
	pathForUser: function(voterUsername) {
		var params = {  username : voterUsername};
		var routeName = "userPage";
		var path = FlowRouter.path(routeName, params);
		return path;
	},
	wrapped: function(){
		return Template.instance().wrapped.get();
	}
});

Template.UnwrapUsers.events({
	'click .more-users': function(e,instance){
		instance.wrapped.set(false);
	}
});