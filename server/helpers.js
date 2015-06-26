Accounts.onCreateUser(function(options, user) {
  //send user email
  sendWelcomeEmail(options.email, "no-reply@cherish.com", options.email);

  if(user.services.facebook) {
    options.profile.avatarImg = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
  } else {
    options.profile.avatarImg = "/images/placeholder-avatar.jpg";
  }
  user.profile = options.profile ? options.profile : {};
  return user;
});