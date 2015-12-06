Meteor.publish('images', function(limit) {

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


