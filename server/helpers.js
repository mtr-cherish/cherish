Accounts.onCreateUser(function(options, user) {
  user.profile = options.profile ? options.profile : {};
  return user;
});