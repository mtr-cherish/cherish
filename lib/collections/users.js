Users = Meteor.users;

Users.helpers({
  canVote: function(initiativeId) {
    if (this._id && _.contains(this.votedOn, initiativeId)) {
      return false;
    }
    return true;
  },

  initiativesCount: function(){
    return Initiatives.find({createdBy: this._id, active: true}).count();
  },
  votedOnCount: function(){
    return Initiatives.find({usersVoted: this._id}).count();
  },
  followerCount: function(){
    return 0;
  }
});