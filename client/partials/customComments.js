(function () {
	var defaultCommentHelpers = {
		take: function (params) {
			var content = Comments.session.get('content');

			if (content[params.hash.key]) {
				return content[params.hash.key];
			}

			return params.hash.default;
		},
		templateIs: function (name) {
			return name === Comments.ui.config().template;
		},
		hasMoreComments: function () {
			return Comments.get(this.id).count() < Comments.session.get(this.id + '_count');
		},
		commentId: function () {
			return this._id || this.replyId;
		}
	},
	handles = {};

  /*
	* Single Comment View
	*/
	Template.myCommentsSingleComment.helpers(_.extend(defaultCommentHelpers, {
		hasLiked: function () {
			return this.likes.indexOf(Meteor.userId()) > -1;
		},
		isOwnComment: function () {
			return this.userId === Meteor.userId();
		},
		loginAction: function () {
			return Comments.session.get('loginAction');
		},
		pathForUser: function() {
			var user = Meteor.users.findOne(this.userId);
			if (user){
				var params = {  username : user.username };
				var routeName = "userPage";
				var path = FlowRouter.path(routeName, params);
				return path;
			}
		}
	}));

	Template.commentsBox.events({
		'submit .comment-form, keydown .create-comment' : function (e) {
			var eventScope = this;

			if ((e.originalEvent instanceof KeyboardEvent && e.keyCode === 13 && e.ctrlKey) || "submit" === e.type) {
				e.preventDefault();

				Comments.ui.callIfLoggedIn('add comments', function () {
					var textarea = $(e.target).parent().find('.create-comment'),
					value = textarea.val().trim();
					console.log('aek');
					Meteor.call('callCommentNotif', eventScope.id);	
					if (value) {
						Comments.add(eventScope.id, value);

						textarea.val('');
					}
				});
			}
		}
	});
})();
