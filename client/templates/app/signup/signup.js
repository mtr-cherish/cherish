Template.publicSignup.events({
  'submit .signup-form': function submitSignupForm(event, template) {
    var email = template.find('.email-address-input').value.replace(/^\s*|\s*$/g, '');
    var password = template.find('.password-input').value.replace(/^\s*|\s*$/g, '');

    var isValidEmail = checkEmailIsValid(email);
    var isValidPassword = checkPasswordIsValid(password);

    event.preventDefault();

    if (!isValidEmail) {
      sAlert.error('Please enter a valid email address');
      return;
    }

    if (!isValidPassword) {
      sAlert.error('Please enter a password that is at least 8 characters long');
      return;
    }

    Accounts.createUser({
      username: email,
      email: email,
      password: password,
      profile: {
        name: email
      },
      votedOn: [],
      commentedOn: []
    }, function onCreateUserError(err) {
      if (err) {
        sAlert.error(err.reason);
        return;
      }
      Session.set('accountCreated', true);
      goBack();
    });
  }
});

Template.publicSignup.onRendered(function publicSignupOnRendered() {
  var input = this.find('.email-address-input');

  if (!input) {
    return;
  }
  input.focus();
});