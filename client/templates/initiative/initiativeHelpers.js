Template.registerHelper('getInitiativeImage', function(context) {
  return "https://placeimg.com/300/250/arch";
});

Template.registerHelper('getInitiativeAuthorImage', function(context) {
  return "https://placeimg.com/60/60/people";
});

Template.registerHelper('canVote', function(context){
    // return true if initiative Id is not in votedOn array
    
    var user = Meteor.users.findOne({_id: Meteor.userId()});
    if(user){
      if(_.contains(user.profile.votedOn, this._id)){
        return false;
      }
    }
    return true;
});

// Helper functions
addOrRemoveVote = function(initiative){
  var user = Meteor.users.findOne({_id: Meteor.userId()});
  /* user already voted */
  if(Meteor.userId()){
    if(_.contains(user.profile.votedOn, initiative._id)){
      if(initiative.votes > 0){
        Initiatives.update(initiative._id, {$inc: {votes: -1}});
        Meteor.users.update(Meteor.userId(), {$pull: {"profile.votedOn": initiative._id}});
        sAlert.error('Ok, We removed your vote...');
      }
    } else {
      Initiatives.update(initiative._id, {$inc: {votes: 1}});
      Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.votedOn": initiative._id}});  
      sAlert.info('Thanks for voting on: '+ initiative.title);
    }
  } else {
    sAlert.error('Can only vote as logged in user');
  }    
}