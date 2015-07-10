Meteor.startup(function meteorStartup() {
  return Meteor.Mandrill.config({
    username: Meteor.settings.mandrill.username,
    key: Meteor.settings.mandrill.key
  });
});