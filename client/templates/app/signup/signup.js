Template.publicSignup.events({
  'submit .signup-form': function (event, template) {
    event.preventDefault();

    var email = template.find('.email-address-input').value.replace(/^\s*|\s*$/g, '');
    var password = template.find('.password-input').value.replace(/^\s*|\s*$/g, '');

    var isValidEmail = checkEmailIsValid(email);
    var isValidPassword = checkPasswordIsValid(password);

    if (!isValidEmail) {
      sAlert.error('Please enter a valid email address');
      return;
    }

    if (!isValidPassword) {
      sAlert.error('Please enter a password that is at least 8 characters long');
      return;
    }

    Accounts.createUser({
      username: emailAddress,
      email: emailAddress,
      password: password,
      profile: {
        name: emailAddress
      },
      votedOn: [],
      commentedOn: []
    }, function(err) {
        if(err) {
          sAlert.error(err.reason);
          return;
        }
        Session.set('accountCreated', true);
        Router.go('initiatives');
    });
  }
});