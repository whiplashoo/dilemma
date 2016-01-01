Meteor.publish('pairsAndImages', function(limit, who) {
	check(limit, Number);
	if (who)
		check(who, String);
	var userId;
	// Check if user wants to see their own profile or another user's profile
	if (who) {
		userId = Meteor.users.findOne({"profile.name": who})._id;
	}
	else {
		userId = this.userId;
	}
	if (userId) {
		return [
		Images.find({ userId : userId }, {
			limit: limit*2,
			sort: { uploadedAt: -1 }
		}),
		Pairs.find({ userId : userId }, {
			limit: limit,
			sort: { createdAt: -1 }
		})
		];
	}
	return this.ready();
});

Meteor.publish('feedPairsAndImages', function(limit, publicFeed){
	check(limit, Number);
	check(publicFeed, Boolean);
	if (publicFeed){
		if (this.userId) {
			return [
				Pairs.find({}, {
					limit: limit,
					sort: { createdAt: -1 }
				}),
				Images.find({}, {
					limit: limit*2,
					sort: { uploadedAt: -1 }
				})
			];
		}
	}
	else {
		var following = Meteor.users.findOne({_id: this.userId}).profile.following;
		if (!following)
			return this.ready();
		if (this.userId) {
			return [
				Images.find({ userId : {$in: following} }, {
					limit: limit*2,
					sort: { uploadedAt: -1 }
				}),
				Pairs.find({ userId : {$in: following} }, {
					limit: limit,
					sort: { createdAt: -1 }
				})
			];
		}
	}
	
	return this.ready();
});

Meteor.publish('profilePics', function(){
	if (this.userId) {
		var userProfile = Meteor.users.findOne({_id: this.userId}).profile;
		if (userProfile.pictureById) { 
			var imgId = userProfile.pictureById;
			return ProfilePics.find({_id: imgId});
		}
	}
});

Meteor.publish('notifs', function(limit){
	if (this.userId) {
		var username = Meteor.users.findOne({ _id:this.userId }).profile.name;
		return Notifs.find({recipient: username, read:false}, {
				limit: limit,
				sort: {updatedAt: -1}
		});
	}
});

Meteor.publish('pastNotifs', function(limit){
	if (this.userId) {
		var username = Meteor.users.findOne({ _id:this.userId }).profile.name;
		return Notifs.find({recipient: username, read:true}, {
				limit: limit,
				sort: {updatedAt: -1}
		});
	}
});

Meteor.publish('connections', function(who){
	if (who)
		check(who, String);
	var userProfile;
	// Check if user wants to see their own profile or another user's profile
	if (who) {
		userProfile = Meteor.users.findOne({"profile.name": who}).profile;
	}
	else {
		userProfile = Meteor.users.findOne({_id: this.userId}).profile;
	}
	var connections = userProfile.followers.concat(userProfile.following);
	if (userProfile) {
		var selector = {_id: { $in : connections} };
		var projection = { fields : { 'profile.name':1, 'profile.picture':1  } };
		return Meteor.users.find(selector, projection );
	}
});

Meteor.publish('otherUser', function(who){
	check(who, String);
	var userId = Meteor.users.findOne({"profile.name": who})._id;
	if (userId) {
		var selector = {_id: userId };
		var projection = { fields : { 'profile':1 } };
		return Meteor.users.find(selector, projection );
	}
});

Meteor.publish('singlePair', function(pairId){
	check(pairId,String);
	return Pairs.find({_id:pairId});
});

Meteor.publish('onlyTwoImages', function(pairId){
	check(pairId,String);
	var pair = Pairs.findOne({_id: pairId});
	var both = [pair.left, pair.right];
	return Images.find({_id: { $in : both }});
});