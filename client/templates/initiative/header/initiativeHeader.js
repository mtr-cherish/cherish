Template.initiativeHeader.events({
  'click .follow-button': function(e, tpl){
    e.preventDefault();
    followUnfollow(this);
  }
});

Template.registerHelper('getCurrentUrl', function() {
  return window.location.href;
});