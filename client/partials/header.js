Template._loginButtonsAdditionalLoggedInDropdownActions.rendered = function(){
	if (Meteor.user()){
		$('#login-dropdown-list>a').html('');
		$('#login-dropdown-list>a').append($('#navbar-profPic')).append('<b class="caret"></b>');
    $('#login-dropdown-list>a').removeClass('cbtn cbtn-normal cbtn-blue');
    $('#login-dropdown-list>a').css('padding',0);
  }
};


Template._loginButtonsLoggedInDropdown.events({
	'change #set-profile-picture': function(event, template) {
		FS.Utility.eachFile(event, function(file) {
			var newFile = new FS.File(file);
			var img = ProfilePics.insert(newFile, function (error, fileObj) {
				if (error) {
					toastr.error("Upload of profile picture failed... please try again.");
				} else {
					toastr.success('Profile picture updated!');
					console.log(img.url());
				}
			});
			Meteor.call('setNormallyProfPic', img._id);
			//Store the imgId in user's profile and resubscribe to profilePics.
			// Meteor.call('updateProfilePic', img._id);
			// Meteor.subscribe('profilePics');

		});
	}
});

Template._loginButtonsAdditionalLoggedInDropdownActions.helpers({
	isLoggedInNatively : function() {
		var userProfile = Meteor.user().profile;
		return userProfile.native;
	}
});

Template.Header.created = function() {
  var self = this;

  self.limit = new ReactiveVar;
  self.limit.set(10);
  self.loaded = new ReactiveVar(0);

  self.autorun(function() {
    var limit = self.limit.get();
    var subscription = self.subscribe('notifs', limit);
    if (subscription.ready())
      self.loaded.set(limit);
  });

  self.notifications =  function() {
    return Notifs.find({ read:false }, { 
      sort: { updatedAt: -1 },
      limit: self.loaded.get()
    });
  }
};

Template.Header.rendered = function(){
  if (!Meteor.user())
    $('#login-dropdown-list>a').addClass('cbtn cbtn-normal cbtn-blue');

}
Template.Header.helpers({
  notifications: function () {
    return Template.instance().notifications();
  },
  // are there more notifs to show?
  hasMoreNotifs: function () {
    return Template.instance().notifications().count() >= Template.instance().limit.get();
  },
  notifsCount:function() {
  	return Template.instance().notifications().count();
  },
  contactFormSchema: function() {
    return Schemas.contact;
  }
});

Template.Header.events({
  'click .js-load-more': function (event, instance) {
    event.preventDefault();
    event.stopPropagation();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += parseInt(10);
    instance.limit.set(limit);
  },
  'click .more-users': function(event){
    event.preventDefault();
    event.stopPropagation();
  },
  'click .notif a': function(event){
    if ($.isPlainObject(this)){
      Meteor.call('readNotif', this._id);
    }
  }
})