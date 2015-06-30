Users = Meteor.users;

Users.helpers({
  canVote: function(initiativeId) {
    if (this._id && _.contains(this.votedOn, initiativeId)) {
      return false;
    }
    return true;
  },
  hasInitiative: function(){
    var initiative = Initiatives.findOne({createdBy: this._id});
    return initiative ? true : false;
  },
  votedOnCount: function(){
    return Initiatives.find({usersVoted: this._id}).count();
  },
  followerCount: function(){
    return 0;
  },
  notificationsCount: function(){
    var notifications = Notifications.find({ownerId: this._id, isRead: false});
    return notifications ? notifications.count() : 0;
  }
});