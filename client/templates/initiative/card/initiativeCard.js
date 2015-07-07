Template.initiativeCard.helpers({
  showStatus: function showStatus() {
    return Router.current().route.path(this).match('/profile/');
  },
  status: function status() {
    return this.active ? 'Active' : 'Inactive';
  },
  getEditingClass: function getEditingClass() {
    return Session.get('editing') === this._id ? 'open' : '';
  }
});

Template.initiativeCard.events({
  'click .votes': function clickVotes() {
    addOrRemoveVote(this);
  },
  'dblclick .touch .card-image a': function doubleClickCard(ev) {
    ev.preventDefault();
    addOrRemoveVote(this);
  },
  'click .status': function clickStatus() {
    Meteor.call('setInactiveActive', this, function setInactiveActiveCallback(err) {
      if (err) {
        sAlert.error(err.message);
      }
    });
  },
  'click .follow-button': function clickFollowButton(ev) {
    ev.preventDefault();
    followUnfollow(this);
  },
  'click .edit-initiative': function() {
    Session.set('editing', this._id);
  }
});