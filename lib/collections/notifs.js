Notifs = new Mongo.Collection('notifs');
Schemas = {};
Schemas.Notif = new SimpleSchema({
	from: {
		type: [String],
		label: "fromUser"
	},
	recipient: {
		type: String,
		label: "recipient",
		index: 1
	},
	type: {
		type: String,
		allowedValues: ['vote', 'follow','comment']
	},
	pairId: {
		type: String,
		optional: true,
		label: "pairId"
	},
	read:{
		type: Boolean,
		label: "read",
		autoValue: function() {
			if ( this.isInsert ) {
				return false;
			} 
		}
	},
	createdAt: {
		type: Date,
		label: "Date notif Added to System",
		autoValue: function() {
			if ( this.isInsert ) {
				return new Date;
			} 
		}
	},
	updatedAt: {
		type: Date,
		label: "Date notif Updated in System",
		autoValue: function() {
			if (this.isInsert){
				return new Date;
			}
		}
	}
})

Schemas.contact = new SimpleSchema({
    name: {
        type: String,
        label: "Your name",
        max: 50
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address"
    },
    message: {
        type: String,
        label: "Message",
        max: 1000
    }
});

Notifs.attachSchema(Schemas.Notif);