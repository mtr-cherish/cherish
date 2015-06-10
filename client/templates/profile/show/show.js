Template.profileShow.helpers({
  initiatives: function(){
    return Initiatives.find({
      usersVoted: Meteor.userId()
    });
  }
})