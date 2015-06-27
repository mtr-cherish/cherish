Template.initiativeHeader.events({
  'click .follow-button': function(e, tpl){
    e.preventDefault();
    followUnfollow(this);
  }
})