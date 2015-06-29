Meteor.methods({
  followUnfollow: function(initiative){
    var user = Meteor.user();

    if (!user)
      throw new Meteor.Error(401, 'You have to be logged in to do that')

    if(user._id === initiative.createdBy)
      throw new Meteor.Error(401, 'You can\'t follow your own Initiatives')

    if (!Throttle.checkThenSet('follow', 10, 1000))
      throw new Meteor.Error(500, 'You can only do this every 3 seconds');

    if (_.contains(initiative.usersFollowing, user._id)) {
      Initiatives.update(initiative._id, {
        $pull: { usersFollowing: user._id }
      });
      // Meteor.users.update(Meteor.userId(), {$pull: {'votedOn': initiative._id}});
      return false;
    }

    Initiatives.update(initiative._id, {

      $addToSet: { usersFollowing: user._id }
    });
    return true;
  }
});