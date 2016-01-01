Template.Profile.created = function() {
  var self = this;

  self.limit = new ReactiveVar;
  self.limit.set(parseInt(Meteor.settings.public.recordsPerPage));
  self.loaded = new ReactiveVar(0);

  self.autorun(function() {
    var limit = self.limit.get();
    var who = FlowRouter.getParam('username');
    var subscription = self.subscribe('pairsAndImages', limit, who);
    if (who) {
      self.subscribe('otherUser', who);
    }
    if (Meteor.user()){
      self.subscribe('connections', who );
    }
    if (subscription.ready())
      self.loaded.set(limit);
    
  });

  self.pairs =  function() {
    return Pairs.find({}, { 
      sort: { createdAt: -1 },
      limit: self.loaded.get()
    });
  }
}
ownPage = function() {
  var who = FlowRouter.getParam('username');
  if (Meteor.user())
    return who === Meteor.user().profile.name || who === undefined;
}
Template.Profile.helpers({
  pairs: function () {
    return Template.instance().pairs();
  },
  // are there more pairs to show?
  hasMorePosts: function () {
    return Template.instance().pairs().count() >= Template.instance().limit.get();
  },
  ownPage: function() {
    var who = FlowRouter.getParam('username');
    if (Meteor.user())
      return who === Meteor.user().profile.name || who === undefined;
  },
  profileOwner: function() {
    var who = FlowRouter.getParam('username');
    if (Meteor.user()){
       if (who === Meteor.user().profile.name || who === undefined){
        return Meteor.user();
       }
       else {
        return Meteor.users.findOne({"profile.name": who});
       }
    }
  },
  Nfollowing: function() {
    if (this.following)
      return this.following.length;
  },
  Nfollowers: function() {
    if (this.followers)
      return this.followers.length;
  },
  joinedAt: function() {
    return moment(this.joinedAt).fromNow();
  },
  followingList: function() {
    if (this.following)
      return Meteor.users.find({_id: { $in: this.following} });
  },
  followersList: function() {
    if (this.followers)
      return Meteor.users.find({_id: { $in: this.followers} });
  },
  pathForUser: function() {
    var user = this;
    var params = {  username : user.profile.name };
    var routeName = "userPage";
    var path = FlowRouter.path(routeName, params);

    return path;
  },
  following: function() {
    if (this.followers) {
      return this.followers.indexOf(Meteor.userId()) !== -1;   
    }
  },
  largeProfPic: function() {
    if (this.picture_large)
      return this.picture_large;
    return this.picture;
  },
  getSlogan: function() {
    if (this.slogan)
      return this.slogan;
    else if (ownPage())
      return "Write a description about yourself";
  }
});

Template.Profile.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += parseInt(Meteor.settings.public.recordsPerPage);
    instance.limit.set(limit);
  },
  'click .follow': function(e) {
    var userToFollow = this.name;
    Meteor.call('followUser', userToFollow, function(error,result){
      if (error) {
        toastr.error("Something went wrong..." + error);
      }
      else {
        $(e.target).removeClass('follow').addClass('unfollow').html('Unfollow');
        toastr.success('Followed!');
      }
    });
  },
  'click .unfollow': function(e) {
    var userToUnfollow = this.name;
    Meteor.call('unfollowUser', userToUnfollow, function(error,result){
      if (error) {
        toastr.error("Something went wrong..." + error);
      }
      else {
        $(e.target).removeClass('unfollow').addClass('follow').html('Follow');
        toastr.success('Unfollowed!');
      }
    });
  },
  'click .editSlogan': function(e,instance) {
    instance.$('#profSlogan').hide();
    instance.$('#editSloganDiv').css('display','table');
  },
  'click #submitSlogan': function(e,instance){
    instance.$('#profSlogan').show();
    instance.$('#editSloganDiv').hide();
    var slogan = $('#sloganInput').val();
    Meteor.call('updateSlogan', slogan);
  },
  'click #cancelSlogan': function(e,instance){
    instance.$('#profSlogan').show();
    instance.$('#editSloganDiv').hide();
  }

})
