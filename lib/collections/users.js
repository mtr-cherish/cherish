Users = Meteor.users;

Users.helpers({
  canVote: function(initiativeId) {
    if (this._id && _.contains(this.votedOn, initiativeId)) {
      return false;
    }
    return true;
  }
});