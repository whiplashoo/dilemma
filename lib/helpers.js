Meteor.methods({
  insertPair: function(leftId,rightId, username) {
    check(leftId,String);
    check(rightId,String);
    check(username,String);

    var userProfile = Meteor.users.findOne({_id:this.userId}).profile;
    var profPicURL;
    if (userProfile.pictureById) { 
      var imgId = userProfile.pictureById;
      var img = ProfilePics.findOne({ _id: imgId });
      if (img)
        profPicURL = img.url();
    }
    else if (userProfile.picture) {
      profPicURL = userProfile.picture;
    }
    else {
      profPicURL = "img/default.png";
    }
    Pairs.insert({ 
      left: leftId, 
      right: rightId, 
      userId: this.userId,
      username:  username,
      userProfilePic : profPicURL,
      createdAt: new Date(),
      leftVotes: 0,
      rightVotes: 0,
      leftVotedBy: [],
      rightVotedBy: []
    });

    /* TODO: Right now if a user updates his profile pic, the profile pic of each pair
    he owns is only updated when the user inserts a new pair.*/
    if (userProfile.pictureById) { 
      Pairs.update({ userId: this.userId}, { $set: { userProfilePic : profPicURL }}, {multi:true});
    }
  },

  voteImage: function(which, pairId){
    check(which, String);
    check(pairId, String);
    var username = Meteor.users.findOne({_id:this.userId}).profile.name;
    var pairQuery = {_id: pairId};

    if (which === 'left') {
      // Proceed only if the user has not already voted for this image
      if (Pairs.findOne(pairQuery).leftVotedBy.indexOf(username) == -1){
        Pairs.update(pairQuery, { 
          $inc: {leftVotes: 1},
          $push: {leftVotedBy: username}
        });
        // If the user had originally chosen the right image
        if (Pairs.findOne(pairQuery).rightVotedBy.indexOf(username) !== -1){
          Pairs.update(pairQuery , { 
            $inc: {rightVotes: -1},
            $pull: {rightVotedBy: username}
          });
        }
      }
    }
    else {
      // Proceed only if the user has not already voted for this image
      if (Pairs.findOne(pairQuery).rightVotedBy.indexOf(username) == -1){
        Pairs.update(pairQuery, { 
          $inc: {rightVotes: 1},
          $push: {rightVotedBy: username}
        });
        // If the user had originally chosen the left image
        if (Pairs.findOne(pairQuery).leftVotedBy.indexOf(username) !== -1){
          Pairs.update(pairQuery, { 
            $inc: {leftVotes: -1},
            $pull: {leftVotedBy: username}
          });
        }
      }
    }
  },

  follow: function(pairToFollow){
    check(pairToFollow, String);

    var followerId = this.userId;
    var toFollowId = Pairs.findOne({_id: pairToFollow}).userId;
    Meteor.users.update({_id: followerId}, { $addToSet : { "profile.following" : toFollowId } });
    Meteor.users.update({_id: toFollowId}, { $addToSet : { "profile.followers" : followerId } });

  },

  unfollow: function(pairToUnfollow){
    check(pairToUnfollow, String);

    var followerId = this.userId;
    var toUnfollowId = Pairs.findOne({_id: pairToUnfollow}).userId;
    Meteor.users.update({_id: followerId}, { $pull : { "profile.following" : toUnfollowId } });
    Meteor.users.update({_id: toUnfollowId}, { $pull : { "profile.followers" : followerId } });

  },

  updateProfilePic: function(imgId){
    var img = ProfilePics.findOne({ _id: imgId});
    Meteor.users.update({_id: Meteor.userId()}, { $set : {'profile.pictureById' : imgId } });
  }

});

Meteor.users.deny({  
  update: function() {
    return true;
  }
});