Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Template.registerHelper("fbPic", function() {
	var userProfile = Meteor.user().profile;
    if (userProfile) { // logic to handle logged out state
    	return userProfile.picture;
    }
});