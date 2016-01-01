/****************************************************** 
**	The user profile holds:
**  a. A username.
**	b. If he logged in with FB, Twitter, etc. his profile picture's URL.
**	c. If he logged in natively and set a prof pic, his prof pic's ID in order
**	   to be able to fetch it from the AWS database.
******************************************************/
Accounts.onCreateUser(function(options, user) {
	
	if (user.services.facebook) {
		options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/";
		options.profile.picture_large = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    	user.profile = options.profile; // We still want the default 'profile' behavior.
    	user.username = user.profile.name;
    }
    else if (user.services.twitter){
    	options.profile.picture = user.services.twitter.profile_image_url;
    	options.profile.picture_large = user.services.twitter.profile_image_url.replace(/_normal/i, '');
    	user.profile = options.profile;
    	user.username = user.profile.name;
    }
    else if (user.services.google){
    	options.profile.picture = user.services.google.picture;
    	user.profile = options.profile;
    	user.username = user.profile.name;
    }
    else {
    	user.profile = {};
    	user.profile.name = user.username;
    	user.profile.picture = "img/default.png";
    	user.profile.native = true;
    }
    user.profile.joinedAt = new Date();
    user.profile.followers = user.profile.following = [];
    user.profile.Npairs = 0;
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

Meteor.methods({
	setNormallyProfPic: function(imgId) {
		// This is not reactive right now, the user has to reload to see the new pic.
		var img = ProfilePics.findOne({ _id: imgId });
		var imgURL = img.url();
		Meteor.users.update({_id:this.userId} , {$set: {"profile.picture" : imgURL, "profile.pictureById" : imgId}});
		Pairs.update({userId:this.userId}, {$set: {userProfilePic : imgURL}});
	},

	insertURLs: function(url1, url2, question, username){
		var left = Images.insert(url1);
		var right = Images.insert(url2);
		if (left && right){
			var leftId = left._id;
			var rightId = right._id;
			Images.update({_id: leftId }, {$set: {userId: this.userId} } );
			Images.update({_id: rightId }, {$set: {userId: this.userId} } );
			Meteor.call('insertPair', leftId, rightId, username, question);
		}
	}
}) 
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

	// Meteor.users.find().forEach(function(doc){
	// 	var id = doc._id;
	// 	var n = Pairs.find({userId: id}).count();
	// 	console.log(n);

	// 	Meteor.users.update({_id:id} , {$set: {"profile.Npairs" : n}});
	// });

	// Meteor.users.find().forEach(function(doc){
	// 	var id = doc._id;

	// 	Meteor.users.update({_id:id} , {$set: {"profile.joinedAt" : doc.createdAt}});
	// })

	// Meteor.users.find().forEach(function(doc){
	// 	var id = doc._id;
	// 	if (doc.profile.pictureById){
	// 		var picId = doc.profile.pictureById;

	// 		var img = ProfilePics.findOne({ _id: picId });
	// 		var imgURL = img.url();
	// 		Meteor.users.update({_id:id} , {$set: {"profile.picture" : imgURL}});
	// 	}
	// })
});

