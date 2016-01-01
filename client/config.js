Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

// On the Client
Comments.ui.config({
	limit: 5,
	loadMoreCount: 5, 
	template: 'bootstrap'
});

// We subscribe initially here for the profile pics, but when a user updates
// we need to check the subscription again. Check the update profile pic function.
// TODO: Make this reactive somehow.
// Meteor.subscribe('profilePics');

Template.registerHelper("profPic", function() {
	if (Meteor.user()){
		var userProfile = Meteor.user().profile;
		// If user has logged in natively.
		if (userProfile.pictureById && !userProfile.picture) { 
			var imgId = userProfile.pictureById;
			Meteor.call('setNormallyProfPic', imgId);
		}
		return userProfile.picture;

	}
});

Meteor.Spinner.options = {
    lines: 9, // The number of lines to draw
    length: 8, // The length of each line
    width: 8, // The line thickness
    radius: 10, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 41, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

