Users = Meteor.users;

Users.allow({
  update: function update() {
    if (Meteor.user()) {
      return true;
    }
    return false;
  }
});

Users.helpers({
  canVote: function canVote(initiativeId) {
    if (this._id && _.contains(this.votedOn, initiativeId)) {
      return false;
    }
    return true;
  },
  hasInitiative: function hasInitiative() {
    return Initiatives.findOne({createdBy: this._id});
  },
  following: function following(user) {
    if (this._id === user) {
      return false;
    }
    return _(this.followsUser).contains(user);
  },
  votedOnCount: function votedOnCount() {
    return Initiatives.find({usersVoted: this._id}).count();
  },
  followerCount: function followerCount() {
    return 0;
  },
  notificationsCount: function notificationsCount() {
    var notifications = Notifications.find({ownerId: this._id, isRead: false});

    return notifications ? notifications.count() : 0;
  }
});

Users.after.remove(function usersAfterRemove(userId, doc) {
  Initiatives.update({createdBy: doc._id}, {$set: {deleted: true}}, {multi: true});
});

Users.after.update(function usersAfterUpdate(userId, doc, fieldNames, modifier) {
  if (modifier.$addToSet && modifier.$addToSet.followsUser) {
    Meteor.call('createNotification', doc, 'follow-user', userId, modifier.$addToSet.followsUser);
  }
});

Meteor.methods({
  followUnfollowUser: function followUnfollowUser(userToFollow) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, 'You have to be logged in to do that');
    }

    if (user._id === userToFollow._id) {
      throw new Meteor.Error(401, 'You can\'t follow yourself');
    }

    if (_.contains(user.followsUser, userToFollow._id)) {
      Users.update(user._id, {
        $pull: {followsUser: userToFollow._id}
      });
      // Meteor.users.update(Meteor.userId(), {$pull: {'votedOn': initiative._id}});
      return false;
    }

    Users.update(user._id, {
      $addToSet: {followsUser: userToFollow._id}
    });
    return true;
  }
});