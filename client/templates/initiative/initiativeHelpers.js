Template.registerHelper('getInitiativeCategoryClass', function() {
  return s.slugify(this.category);
});

Template.registerHelper('hasUpdates', function() {
    return Initiatives.find({createdAt: {$gt: Session.get('lastUpdated')}}).count() > 0;
});

Template.registerHelper('getPrettyDate', function(timestamp) {
  return moment(new Date(timestamp)).fromNow();
});

Template.registerHelper("voteIcon", function(){
  if (!Meteor.user() || Meteor.user().canVote(this._id)) {
    return '<i class="mdi-action-favorite-outline"></i>';
  }
  return '<i class="mdi-action-favorite"></i>';
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