Accounts.onCreateUser(function onCreateUserCallback(options, user) {
  var content = {
    user: user.username
  };

  if (Meteor.settings.enableEmail) {
    Meteor.call('sendEmail', 'helloworld', user.username, content);
  }
  if (user.services.facebook) {
    options.profile.avatarImg = 'http://graph.facebook.com/' + user.services.facebook.id + '/picture/?type=large';
  } else {
    options.profile.avatarImg = '/images/placeholder-avatar.jpg';
  }
  user.profile = options.profile ? options.profile : {};
  return user;
});