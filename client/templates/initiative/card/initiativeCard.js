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
  'dblclick .touch .card-image a': function doubleClickCard(event) {
    event.preventDefault();
    addOrRemoveVote(this);
  },
  'click .status': function clickStatus() {
    Meteor.call('setInactiveActive', this, function setInactiveActiveCallback(error) {
      if (error) {
        sAlert.error(error.message);
      }
    });
  },
  'click .follow-button': function clickFollowButton(event) {
    event.preventDefault();
    followUnfollow(this);
  },
  'click .edit-initiative': function clickEditInitiative() {
    Session.set('editing', this._id);
  }
});