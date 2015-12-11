Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

// On the Client
Comments.ui.config({
   template: 'bootstrap' // or ionic, semantic-ui
});

// We subscribe initially here for the profile pics, but when a user updates
// we need to check the subscription again. Check the update profile pic function.
// TODO: Make this reactive somehow.
Meteor.subscribe('profilePics');

Template.registerHelper("profPic", function() {
	if (Meteor.user()){
		var userProfile = Meteor.user().profile;
		// If user has logged in natively.
		if (userProfile.pictureById) { 
			var imgId = userProfile.pictureById;
			var img = ProfilePics.findOne({ _id: imgId });
			if (img)
				return img.url();
		}
		// if user logged in with external services.
		else {
			return userProfile.picture;
		}
	}
});

Template._loginButtonsLoggedInDropdown.events({
	'change #set-profile-picture': function(event, template) {
		FS.Utility.eachFile(event, function(file) {
			var newFile = new FS.File(file);
			var img = ProfilePics.insert(newFile, function (error, fileObj) {
				if (error) {
					toastr.error("Upload of profile picture failed... please try again.");
				} else {
					toastr.success('Profile picture updated!');
				}
			});

			//Store the imgId in user's profile and resubscribe to profilePics.
			Meteor.call('updateProfilePic', img._id);
			Meteor.subscribe('profilePics');

		});
	}
});

Template._loginButtonsAdditionalLoggedInDropdownActions.helpers({
	isLoggedInNatively : function() {
		var userProfile = Meteor.user().profile;
		return userProfile.picture === undefined;
	}
});