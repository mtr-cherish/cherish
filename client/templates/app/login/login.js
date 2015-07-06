checkEmailIsValid = function checkEmailIsValid(aString) {
  aString = aString || '';
  return aString.length > 1 && aString.indexOf('@') > -1;
};

checkPasswordIsValid = function checkPasswordIsValid(aString) {
  aString = aString || '';
  return aString.length > 7;
};

Template.publicLogin.events({
  'submit .login-form': function submitLogin(event, template) {
    var email = template.find('.email-address-input').value.replace(/^\s*|\s*$/g, '');
    var password = template.find('.password-input').value.replace(/^\s*|\s*$/g, '');
    var isValidEmail = checkEmailIsValid(email);
    var isValidPassword = checkPasswordIsValid(password);

    event.preventDefault();

    if (!isValidEmail || !isValidPassword) {
      sAlert.error('Invalid email or password');
      return;
    }

    Meteor.loginWithPassword(email, password, function loginWithPassword(err) {
      if (err) {
        sAlert.error('Account login failed for unknown reason :(');
        return;
      }
      Router.go('initiatives');
    });
  },

  'click #facebook-login': function clickFacebookLogin(event) {
    event.preventDefault();
    Meteor.loginWithFacebook({}, function facebookLogin(err) {
      if (err) {
        if (!Meteor.settings.facebook) {
          sAlert.error('Facebook authentication is not setup for this app.');
        } else {
          sAlert.error('Facebook login failed for unknown reasons.');
        }
        return;
      }
      Router.go('initiatives');
    });
  },

  'click #logout': function logout(event) {
    event.preventDefault();
    Meteor.logout(function meteorLogout(err) {
      if (err) {
        throw new Meteor.Error('Logout failed');
      }
    });
  }
});

Template.publicLogin.onRendered(function() {
    var input = this.find('.email-address-input');
    if (input) {
        input.focus();
    }
});