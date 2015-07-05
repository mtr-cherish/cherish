Users = Meteor.users;

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