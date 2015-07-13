Template.userDropdown.helpers({
  username: function() {
    return Meteor.user().profile.name;
    debugger;
  }
});