function createNotif(fromUser, forUser, type, data){

  if (type === 'vote' || type === 'comment'){
    if (Notifs.findOne({recipient:forUser, type:type, pairId:data.pairId})){
      Notifs.update({recipient:forUser, type:type, pairId:data.pairId}, {
        $addToSet: { from: fromUser},
        $set: {read:false, updatedAt: new Date()}
      });
    }
    else {
      Notifs.insert({
        from : [fromUser],
        recipient: forUser,
        type: type,
        pairId: data.pairId
      });
    }
  }
  else if (type === 'follow'){
    Notifs.insert({
      from : [fromUser],
      recipient: forUser,
      type: type
    })
  }
}

Meteor.methods({
  insertPair: function(leftId,rightId, username, question) {
    check(leftId,String);
    check(rightId,String);
    check(username,String);

    var userProfile = Meteor.users.findOne({_id:this.userId}).profile;
    var profPicURL;
    if (userProfile.picture) {
      profPicURL = userProfile.picture;
    }
    else {
      profPicURL = "img/default.png";
    }
    Pairs.insert({ 
      left: leftId, 
      right: rightId,
      question: question, 
      userId: this.userId,
      username:  username,
      userProfilePic : profPicURL,
      createdAt: new Date(),
      leftVotes: 0,
      rightVotes: 0,
      leftVotedBy: [],
      rightVotedBy: []
    });

    Meteor.users.update({_id:this.userId}, {$inc: {"profile.Npairs":1}});
    /* TODO: Right now if a user updates his profile pic, the profile pic of each pair
    he owns is only updated when the user inserts a new pair.*/
    // if (userProfile.pictureById) { 
    //   Pairs.update({ userId: this.userId}, { $set: { userProfilePic : profPicURL }}, {multi:true});
    // }
  },

  deletePair: function(pairId){
    check(pairId, String);
    Notifs.remove({pairId : pairId});
    var pair = Pairs.findOne({_id: pairId});
    var left = pair.left;
    var right = pair.right;
    Images.remove({_id: left});
    Images.remove({_id: right});
    Pairs.remove({_id: pairId});
    Meteor.users.update({_id:this.userId}, {$inc: {"profile.Npairs":-1}});
  },

  voteImage: function(which, pairId){
    check(which, String);
    check(pairId, String);
    var username = Meteor.users.findOne({_id:this.userId}).profile.name;
    var pairQuery = {_id: pairId};

    var forUser = Pairs.findOne(pairQuery).username;
    var notifData = { pairId : pairId };
    createNotif(username, forUser, 'vote', notifData);

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
    console.log(this);

    var followerId = this.userId;
    var toFollowId = Pairs.findOne({_id: pairToFollow}).userId;
    Meteor.users.update({_id: followerId}, { $addToSet : { "profile.following" : toFollowId } });
    Meteor.users.update({_id: toFollowId}, { $addToSet : { "profile.followers" : followerId } });

    var fromUser = Meteor.users.findOne({_id:this.userId}).profile.name;
    var forUser = Meteor.users.findOne({_id:toFollowId}).profile.name;
    createNotif(fromUser, forUser, 'follow', {});
  },

  unfollow: function(pairToUnfollow){
    check(pairToUnfollow, String);

    var followerId = this.userId;
    var toUnfollowId = Pairs.findOne({_id: pairToUnfollow}).userId;
    Meteor.users.update({_id: followerId}, { $pull : { "profile.following" : toUnfollowId } });
    Meteor.users.update({_id: toUnfollowId}, { $pull : { "profile.followers" : followerId } });

  },

  followUser: function(userToFollow){
    check(userToFollow, String);

    var followerId = this.userId;
    var toFollowId = Meteor.users.findOne({"profile.name": userToFollow})._id;
    Meteor.users.update({_id: followerId}, { $addToSet : { "profile.following" : toFollowId } });
    Meteor.users.update({_id: toFollowId}, { $addToSet : { "profile.followers" : followerId } });

    var fromUser = Meteor.users.findOne({_id:this.userId}).profile.name;
    var forUser = userToFollow;
    createNotif(fromUser, forUser, 'follow', {});
  },

  unfollowUser: function(userToUnfollow){
    check(userToUnfollow, String);

    var followerId = this.userId;
    var toUnfollowId = Meteor.users.findOne({"profile.name": userToUnfollow})._id;
    Meteor.users.update({_id: followerId}, { $pull : { "profile.following" : toUnfollowId } });
    Meteor.users.update({_id: toUnfollowId}, { $pull : { "profile.followers" : followerId } });

  },

  readNotif: function(notifId){
    check(notifId, String);
    var a = Notifs.update({_id: notifId}, { $set: {read:true}});
  },

  updateSlogan: function(slogan){
    check(slogan,String);
    Meteor.users.update({_id:this.userId}, {$set: {"profile.slogan": slogan}});
  },

  sendEmail: function(doc) {
    // Important server-side check for security and data integrity
    check(doc, Schemas.contact);

    // Build the e-mail text
    var text = "Name: " + doc.name + "\n\n"
    + "Email: " + doc.email + "\n\n\n\n"
    + doc.message;

    this.unblock();

    // Send the e-mail
    Email.send({
      to: "dilemma.whi@gmail.com",
      from: doc.email,
      subject: "Website Contact Form - Message From " + doc.name,
      text: text
    });
  },

  'callCommentNotif': function (pairId) {
    check(pairId, String);
    var fromUser = Meteor.users.findOne({_id:this.userId}).profile.name;
    var pairQuery = {_id: pairId};

    var forUser = Pairs.findOne(pairQuery).username;
    var notifData = { pairId : pairId };
    createNotif(fromUser, forUser, 'comment', notifData);
  }

});

Meteor.users.deny({  
  update: function() {
    return true;
  }
});