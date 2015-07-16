Template.profileUser.helpers({
  following: function following(user) {
    return Meteor.user().following(user);
  }
});

Template.profileUser.events({
  'click .follow-user': function followUser(event, template) {
    Meteor.call('followUnfollowUser', template.data.user, function callbackFunction(error) {
      if (error) {
        sAlert.error(error.message);
      }
    });
  }
});