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
  votedOnCount: function(){
    var votedOnCount = Initiatives.find({usersVoted: Meteor.userId()}).count();
    return votedOnCount;
  },
  initiativesCount: function() {
    var initiativesCount = Initiatives.find({createdBy: Meteor.userId(), active: true}).count();
    return initiativesCount;
  },
  followerCount: function(){
    return 1;
  }
})