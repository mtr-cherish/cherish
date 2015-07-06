Template.initiativeCard.helpers({
  showStatus: function showStatus() {
    return Router.current().route.path(this).match('/profile/');
  },
  status: function status() {
    return this.active ? 'Active' : 'Inactive';
  }
});

Template.initiativeCard.events({
  'click .votes': function clickVotes() {
    // TODO: restrict votes to 1 pr initiative
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
  }
});