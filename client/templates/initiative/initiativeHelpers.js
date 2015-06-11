Template.registerHelper('getInitiativeImage', function(context) {
  return "https://placeimg.com/300/250/arch";
});

Template.registerHelper('getInitiativeAuthorImage', function(context) {
  return "https://placeimg.com/60/60/people";
});

Template.registerHelper('getInitiativeCategory', function(context) {
  return this.category.toLowerCase();
});

Template.registerHelper('getInitiativeCategoryClass', function(context) {
  return s.slugify(this.category);
});

Template.registerHelper('canVote', function(context){
  // return true if initiative Id is not in votedOn array
  var user = Meteor.user();
  if(user){
    if(_.contains(user.votedOn, this._id)){
      return false;
    }
  }
  return true;
});

Template.registerHelper('zeroIfEmptyOrNotExists', function(context) {
  if(!context || Object.keys(context).length == 0) {
    return 0;
  } else {
    return Object.keys(context).length;
  }
});

// Helper functions
addOrRemoveVote = function(initiative){
  var user = Meteor.user();
  /* user already voted */
  if(user){
    if(_.contains(user.votedOn, initiative._id)){
      Initiatives.update(initiative._id, {
        $inc: { votes: -1 }, 
        $pull: { usersVoted: user._id }
      });
      Meteor.users.update(Meteor.userId(), {$pull: {"votedOn": initiative._id}});
      sAlert.error('Ok, We removed your vote...');
    } else {
      Initiatives.update(initiative._id, {
        $inc: { votes: 1 }, 
        $addToSet: { usersVoted: user._id }
      });
      Meteor.users.update(Meteor.userId(), {$addToSet: {"votedOn": initiative._id}});  
      sAlert.info('Thanks for voting on: '+ initiative.title);
    }
  } else {
    sAlert.error('Can only vote as logged in user');
  }
}