Meteor.publish('images', function(limit) {
	check(limit, Number);
	if (this.userId) {
		return Images.find({ userId : this.userId }, {
			limit: limit,
			sort: { uploadedAt: -1 }
		});
	}
	return this.ready();
});

Meteor.publish('pairs', function(limit) {
	check(limit, Number);
	if (this.userId) {
		return Pairs.find({ userId : this.userId }, {
			limit: limit,
			sort: { createdAt: -1 }
		});
	}
	return this.ready();
});

Meteor.publish('feedpairs', function(limit) {
	check(limit, Number);
	if (this.userId) {
		return Pairs.find({}, {
			limit: limit,
			sort: { createdAt: -1 }
		});
	}
	return this.ready();
});

Meteor.publish('feedimages', function(limit) {
	check(limit, Number);
	if (this.userId) {
		return Images.find({}, {
			limit: limit,
			sort: { uploadedAt: -1 }
		});
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
}
)

