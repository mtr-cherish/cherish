Template.registerHelper('getInitiativeCategoryClass', function() {
  return s.slugify(this.category);
});

Template.registerHelper('hasUpdates', function() {
  return Initiatives.find({createdAt: {$gt: Session.get('lastUpdated')}, active: {"$exists": true}, active: true}).count() > 0;
});

Template.registerHelper('getPrettyDate', function(timestamp) {
  return moment(new Date(timestamp)).fromNow();
});

Template.registerHelper("voteIcon", function(size){

  if(!size){
    size = 'tiny';
  } else {
    size = 'small';
  }

  if (!Meteor.user() || Meteor.user().canVote(this._id)) {
    return '<i class="material-icons '+size+'">favorite_border</i>';
  }
  return '<i class="material-icons '+size+'">favorite</i>';
});

Template.registerHelper('zeroIfEmptyOrNotExists', function(context) {
  if(!context || Object.keys(context).length == 0) {
    return 0;
  } else {
    return Object.keys(context).length;
  }
});

Template.registerHelper('canFollow', function(){
  return !_.contains(this.usersFollowing, Meteor.userId());
});

Template.registerHelper('getFollowClass', function(){
  return _.contains(this.usersFollowing, Meteor.userId()) ? 'unfollow' : 'follow';
});

Template.registerHelper('isMine', function(){
    return this.createdBy === Meteor.userId();
});

// Helper functions
addOrRemoveVote = function(initiative) {
  Meteor.call('addOrRemoveVote', initiative, function(err) {
    if (err) {
      sAlert.error(err.message);
    }
  });
}

followUnfollow = function(initiative){
  Meteor.call('followUnfollow', initiative, function(err) {
    if (err) {
      sAlert.error(err.message);
    }
  });
}