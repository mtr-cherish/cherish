Template.publicSignup.events({  
  'submit .signup-form': function (event, template) {
    event.preventDefault();

    var $form = $(event.currentTarget);
    var $emailInput = $form.find('.email-address-input').eq(0);
    var $passwordInput = $form.find('.password-input').eq(0);

    var emailAddress = $emailInput.val() || '';
    var password = $passwordInput.val() || '';

    //trim
    emailAddress = emailAddress.replace(/^\s*|\s*$/g, '');
    password = password.replace(/^\s*|\s*$/g, '');

    //validate
    var isValidEmail = checkEmailIsValid(emailAddress);
    var isValidPassword = checkPasswordIsValid(password);

    if (!isValidEmail || !isValidPassword) {
      if (!isValidEmail) {
        sAlert.error('Invalid email address');
      }
      if (!isValidPassword) {
        sAlert.error('Your password must be at least 8 characters long');
      }
    } else {
      Accounts.createUser({
        username: emailAddress,
        email: emailAddress, 
        password: password,
        profile: {
          name: emailAddress
        },
        votedOn: [],
        commentedOn: []
      },
        function(err) {
          if(err) {
            sAlert.error(err.reason);
          } else {
            Session.set('accountCreated', true);
            Router.go('initiatives');
          }
        });
    }
  }
});