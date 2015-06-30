Template.profileSelf.helpers({
  votedInitiatives: function(){
    return Initiatives.find({
      usersVoted: Meteor.userId()
    });
  },
  commentedInitiatives: function(){
    return Initiatives.find({
      'comments.createdBy': Meteor.userId()
    });
  },
  hasInitiative: function(){
    return Meteor.user().hasInitiative();
  }
})