Meteor.startup(function meteorStartup() {
  if ( Meteor.settings.enableEmail && Meteor.settings && Meteor.settings.mandrill ) {
    console.log('======> Email enabled.')
    Meteor.Mandrill.config({
      username: Meteor.settings.mandrill.username,
      key: Meteor.settings.mandrill.key
    });
  }
});