if (Meteor.isServer) {
	var profilePicsStore = new FS.Store.S3("profilePics", {
		/* REQUIRED */
		region: "eu-central-1",
		accessKeyId: Meteor.settings.private.AWSAccessKeyId, 
		secretAccessKey: Meteor.settings.private.AWSSecretAccessKey, 
		bucket: Meteor.settings.private.AWSBucket
	});

	ProfilePics = new FS.Collection("ProfilePics", {
		stores: [profilePicsStore],
		filter: {
			maxSize: 5000000,
			allow: {
				contentTypes: ['image/*']
			}
		}
	});
}

// On the client just create a generic FS Store as don't have
// access (or want access) to S3 settings on client
if (Meteor.isClient) {
	var profilePicsStore = new FS.Store.S3("profilePics");
	ProfilePics = new FS.Collection("ProfilePics", {
		stores: [profilePicsStore],
		filter: {
			maxSize: 5000000,
			allow: {
				contentTypes: ['image/*']
			},
			onInvalid: function(message) {
				toastr.error(message);
			}
		}
	});
}

// Allow rules
ProfilePics.allow({
	insert: function(userId) { return userId != null; },
	update: function(userId, image) { return true;  },
	remove: function(userId, image) { return true; },
	download: function() { return true; }
});