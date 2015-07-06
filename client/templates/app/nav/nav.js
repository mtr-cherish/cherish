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
    beloworigin: true
  });
});

Template.userDropdown.helpers({
  avatar: function avatar() {
    return Meteor.user().profile.avatarImg;
  }
});


Template.sidenav.onRendered(function sidenavOnRendered() {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  this.$('.open-notifications').leanModal();
});

Template.sidenav.events({
  'click .open-notifications': function clickOpenNotifications() {
    $('#notifications_modal').openModal();
  }
});