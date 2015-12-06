Meteor.methods({
  insertPair: function(leftId,rightId, username) {
    Pairs.insert({ 
      left: leftId, 
      right: rightId, 
      userId: this.userId,
      username:  username,
      createdAt: new Date(),
      leftVotes: 0,
      rightVotes: 0,
      leftVotedBy: [],
      rightVotedBy: []
    });
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
  }
  // idToUsername: function()

});