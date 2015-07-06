Template.registerHelper('getInitiativeCategoryClass', function getInitiativeCategoryClassHelper() {
  return s.slugify(this.category);
});

Template.registerHelper('hasUpdates', function hasUpdatesHelper() {
  return Initiatives.find({createdAt: {$gt: Session.get('lastUpdated')}, active: true}).count() > 0;
});

Template.registerHelper('getPrettyDate', function getPrettyDateHelper(timestamp) {
  return moment(new Date(timestamp)).fromNow();
});

Template.registerHelper('voteIcon', function voteIconHelper(size) {
  if (!size) {
    size = 'tiny';
  } else {
    size = 'small';
  }

  if (!Meteor.user() || Meteor.user().canVote(this._id)) {
    return '<i class="material-icons ' + size + '">favorite_border</i>';
  }
  return '<i class="material-icons ' + size + '">favorite</i>';
});

Template.registerHelper('zeroIfEmptyOrNotExists', function zeroIfEmptyOrNotExistsHelper(context) {
  if (!context || Object.keys(context).length === 0) {
    return 0;
  }
  return Object.keys(context).length;
});

Template.registerHelper('canFollow', function canFollowHelper() {
  return !_.contains(this.usersFollowing, Meteor.userId());
});

Template.registerHelper('getFollowClass', function getFollowClassHelper() {
  return _.contains(this.usersFollowing, Meteor.userId()) ? 'unfollow' : 'follow';
});

Template.registerHelper('isMine', function isMineHelper() {
  return this.createdBy === Meteor.userId();
});

// Helper functions
addOrRemoveVote = function addOrRemoveVote(initiative) {
  Meteor.call('addOrRemoveVote', initiative, function addOrRemoveVoteCallback(err) {
    if (err) {
      sAlert.error(err.message);
    }
  });
};

followUnfollow = function followUnfollow(initiative) {
  Meteor.call('followUnfollow', initiative, function followUnfollowCallback(err) {
    if (err) {
      sAlert.error(err.message);
    }
  });
};