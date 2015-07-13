Accounts.onCreateUser(function onCreateUserCallback(options, user) {
  user.profile = options.profile ? options.profile : {};
  console.log(user);
  console.log('usfb:' + user.services.facebook);
  if (user.services.facebook !== undefined) {
    options.profile = {avatarImg : 'http://graph.facebook.com/' +
      user.services.facebook.id + '/picture/?type=large'};
  } else {
    options.profile = {avatarImg : '/images/placeholder-avatar.jpg'};
  }
  return user;
});
