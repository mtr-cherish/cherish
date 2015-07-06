// See notificationsHelpers.js for helpers

Template.notificationsButton.onRendered(function notificationsButtonOnRendered() {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  this.$('.open-notifications').leanModal();
});
