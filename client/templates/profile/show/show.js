Template.profileShow.helpers({
  initiatives: function(){
    return Initiatives.find({
      createdBy: Meteor.userId(),
      usersVoted: Meteor.userId()
    });
  }
})