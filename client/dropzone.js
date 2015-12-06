FS.debug = true;


Template.Dropzone.events({
	'change #inp1': function(e) {
		console.log('Dropped LEFT!')
	},

	'change #inp2': function(e) {
		console.log('Dropped RIGHT!')
	},

	'click #upload' : function(e) {
		var user = Meteor.user();
		var username = user.username || user.profile.name;
		var file1 = new FS.File($('#inp1').get(0).files[0]);
		var file2 = new FS.File($('#inp2').get(0).files[0]);
		file1.username = file2.username = username;
		file1.userId = file2.userId = user._id;

		var left = Images.insert(file1, function (error, fileObj) {
			if (error) {
				toastr.error("Upload of left image failed... please try again.");
			} else {
				toastr.success('Upload succeeded!');
			}
		});
		var right = Images.insert(file2, function (error, fileObj) {
			if (error) {
				toastr.error("Upload of right image failed... please try again.");
			} else {
				toastr.success('Upload succeeded!');
			}
		});

		var leftId = left._id;
		var rightId = right._id;

		// Never pass the user._id for a method call. Instead we get it from this.userId inside the Method call. 
		// Reference: http://guide.meteor.com/security.html
		Meteor.call('insertPair', leftId, rightId, username);

	}
});
