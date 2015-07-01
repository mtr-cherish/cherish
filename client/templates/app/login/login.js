function checkEmailIsValid(aString) {
  aString = aString || '';
  return aString.length > 1 && aString.indexOf('@') > -1;
}

function checkPasswordIsValid(aString) {
  aString = aString || '';
  return aString.length > 7;
}

Template.publicLogin.events({
  'submit .login-form': function (event, template) {
    event.preventDefault();

    var email = template.find('.email-address-input').value.replace(/^\s*|\s*$/g, '');
    var password = template.find('.password-input').value.replace(/^\s*|\s*$/g, '');

    var isValidEmail = checkEmailIsValid(email);
    var isValidPassword = checkPasswordIsValid(password);

    if (!isValidEmail || !isValidPassword) {
      sAlert.error('Invalid email or password');
      return;
    }

    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        sAlert.error('Account login failed for unknown reason :(');
        return;
      }
      Router.go('initiatives');
    });
  },

  'click #facebook-login': function(event) {
    event.preventDefault();
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        if(!Meteor.settings.facebook) {
          sAlert.error('Facebook authentication is not setup for this app.');;
        } else {
          sAlert.error('Facebook login failed for unknown reasons.');
        }
        return;
      }
      Router.go('initiatives');
    });
  },

  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout(function(err){
      if (err) {
        throw new Meteor.Error('Logout failed');
      }
    });
  }
});