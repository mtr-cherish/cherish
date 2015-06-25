Template.registerHelper('getInitiativeCategoryClass', function() {
  return s.slugify(this.category);
});

Template.registerHelper('hasUpdates', function() {
    return Initiatives.find({createdAt: {$gt: Session.get('lastUpdated')}, active: {"$exists": true}, active: true}).count() > 0;
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
  Meteor.call('addOrRemoveVote', initiative, function(err, result) {
    if (err) {
      sAlert.error(err.message);
      return;
    }
    if (result) {
      sAlert.info('Thanks for voting on: ' + initiative.title);
      return;
    }
    sAlert.error('Ok, we removed your vote...');
  });
  return;
}

followUnfollow = function(initiative){
  Meteor.call('followUnfollow', initiative, function(err, result) {
    if (err) {
      sAlert.error(err.message);
      return;
    }
    if (result) {
      sAlert.info('You\'re now following ' + initiative.title);
      return;
    }
    sAlert.info('You\'re no longer following ' + initiative.title);
  });
  return;
}