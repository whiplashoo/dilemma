Template.Notif.helpers({
	updatedAt: function() {
		return moment(this.updatedAt).fromNow();
	},
	typeIs: function(type) {
		return this.type === type;
	},
	pathForPair: function() {
		var params = {  pairId : this.pairId};
		var routeName = "singleDilemma";
		var path = FlowRouter.path(routeName, params);
		return path;
	},
	pathForUser: function() {
		var params = {  username : this.from };
		var routeName = "userPage";
		var path = FlowRouter.path(routeName, params);
		return path;
	}
});

