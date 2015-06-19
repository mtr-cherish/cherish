Accounts.onCreateUser(function(options, user) {
  //send user email
  sendWelcomeEmail(options.email, "no-reply@cherish.com", options.email);
  // create profile object
  user.profile = options.profile ? options.profile : {};
  return user;
});