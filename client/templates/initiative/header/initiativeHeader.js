Template.initiativeHeader.events({
  'click .follow-button': function clickFollowButton(event) {
    event.preventDefault();
    followUnfollow(this);
  }
});