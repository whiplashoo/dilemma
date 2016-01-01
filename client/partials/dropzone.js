FS.debug = true;

Template.Dropzone.events({
	'change #inp1': function(e,instance) {
		instance.$('.no1').css('background-color', '#BBFF99');
		var label = instance.$('#inp1').val().replace(/\\/g, '/').replace(/.*\//, '');
		instance.$('#inp1label').html(label);
	},

	'change #inp2': function(e,instance) {
		instance.$('.no2').css('background-color', '#BBFF99');
		var label = instance.$('#inp2').val().replace(/\\/g, '/').replace(/.*\//, '');
		instance.$('#inp2label').html(label);
	},

	'keypress #questionInput': function(e,instance){
		instance.$('.no3').css('background-color', '#BBFF99');
	},

	'click #js-upload-files' : function(e,instance) {
		var user = Meteor.user();
		var username = user.username || user.profile.name;
		var file1 = new FS.File($('#inp1').get(0).files[0]);
		var file2 = new FS.File($('#inp2').get(0).files[0]);
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

		if (left && right){
			var leftId = left._id;
			var rightId = right._id;
			var question = instance.$('#questionInputFiles').val();
			// Never pass the user._id for a method call. Instead we get it from this.userId inside the Method call. 
			// Reference: http://guide.meteor.com/security.html
			Meteor.call('insertPair', leftId, rightId, username, question);
		}
	},

	'click #js-upload-urls' : function(e,instance) {
		var user = Meteor.user();
		var username = user.username || user.profile.name;
		var url1 = instance.$('#url1').val();
		var url2 = instance.$('#url2').val();
		var question = $('#questionInputUrls').val();

		// Use a server-side only method because calling from client throws CORS error.
		Meteor.call('insertURLs', url1, url2, question, username);

	},
	'click .js-toggle-upload': function(){
		$('#accordion').toggle('slow');
	}
});

