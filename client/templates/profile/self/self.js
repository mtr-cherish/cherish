Template.profileSelf.helpers({
  votedInitiatives: function votedInitiatives() {
    return Initiatives.find({
      usersVoted: Meteor.userId()
    });
  },
  commentedInitiatives: function commentedInitiatives() {
    return Initiatives.find({
      'comments.createdBy': Meteor.userId()
    });
  },
  userInitiatives: function userInitiatives() {
    return Initiatives.find({createdBy: Meteor.userId()});
  },
  hasInitiative: function hasInitiative() {
    return Meteor.user().hasInitiative();
  }
});