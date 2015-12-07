var getFbPicture = function(accessToken) { // make async call to grab the picture from facebook
	var result;
	result = Meteor.http.get("https://graph.facebook.com/me", {
		params: {
			access_token: accessToken,
			fields: 'picture'
		}
	});
	if(result.error) {
		throw result.error;
	}
    return result.data.picture.data.url; // return the picture's url
};

/****************************************************** 
**	The user profile holds:
**  a. A username.
**	b. If he logged in with FB, Twitter, etc. his profile picture's URL.
**	c. If he logged in natively and set a prof pic, his prof pic's ID in order
**	   to be able to fetch it from the AWS database.
******************************************************/
Accounts.onCreateUser(function(options, user) {
	
	if (user.services.facebook) {
		options.profile.picture = getFbPicture(user.services.facebook.accessToken);
    	user.profile = options.profile; // We still want the default 'profile' behavior.
    }
    else if (user.services.twitter){
    	options.profile.picture = user.services.twitter.profile_image_url;
    	user.profile = options.profile;
    }
    else if (user.services.google){
    	options.profile.picture = user.services.google.picture;
    	user.profile = options.profile;
    }
    else {
    	user.profile = {};
    	user.profile.name = user.username;
    }
    return user;
});

createServiceConfiguration = function(service,clientId,secret){
	ServiceConfiguration.configurations.remove(	{service: service});

	config = {
		generic: {
			service: service,
			clientId: clientId,
			secret: secret
		},
		facebook: {
			service: service,
			appId: clientId,
			secret: secret
		},
		twitter:{
			service: service,
			consumerKey: clientId,
			secret: secret
		}
	};
	if (service === 'facebook'){
		ServiceConfiguration.configurations.insert(config.facebook);
	}
	else if (service === 'twitter'){
		ServiceConfiguration.configurations.insert(config.twitter);
	}
	else {
		ServiceConfiguration.configurations.insert(config.generic);
	}
}

createServiceConfiguration('facebook', Meteor.settings.private.FBid, Meteor.settings.private.FBsecret);
createServiceConfiguration('google', Meteor.settings.private.GOid, Meteor.settings.private.GOsecret);
createServiceConfiguration('twitter', Meteor.settings.private.TWid, Meteor.settings.private.TWsecret);

Meteor.startup(function(){
	
	// Pairs.find().forEach(function(doc){
	// 	var id = doc.userId;
	// 	var userProfile = Meteor.users.findOne({_id:id}).profile;
	// 	var profPicURL;
	// 	if (userProfile.pictureById) { 
	// 		var imgId = userProfile.pictureById;
	// 		var img = ProfilePics.findOne({ _id: imgId });
	// 		if (img)
	// 			profPicURL = img.url();
	// 	}
	// 	else if (userProfile.picture) {
	// 		profPicURL = userProfile.picture;
	// 	}
	// 	else {
	// 		profPicURL = "/default.jpg";
	// 	}
	// 	Pairs.update({ _id: doc._id}, { $set: {userProfilePic:profPicURL}});
	// })
});