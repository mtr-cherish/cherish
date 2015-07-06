Template.nav.onRendered(function navOnRendered() {
  this.$('.button-collapse').sideNav({
    closeOnClick: true
  });
});

Template.nav.events({
  'click .logout': function clickLogout(e) {
    e.preventDefault();
    Meteor.logout(function meteorLogout(err) {
      if (err) {
        sAlert.error('Sorry, we were unable to log you out');
      }
    });
  }
});

Template.userDropdown.onRendered(function userDropdownOnRendered() {
  this.$('.dropdown-button').dropdown({
    belowOrigin: true
  });
});

Template.userDropdown.helpers({
  avatar: function avatar() {
    return Meteor.user().profile.avatarImg;
  }
});