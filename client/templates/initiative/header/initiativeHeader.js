Template.initiativeHeader.events({
  'click .follow-button': function clickFollowButton(ev) {
    ev.preventDefault();
    followUnfollow(this);
  }
});