Meteor.startup(function meteorStartup() {
  smtp = {
    // gmail address
    username: 'foo@gmail.com',
    // password
    password: 'password',
    // eg: mail.gandi.net
    server: 'smtp.gmail.com',
    port: 25
  };

  // process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

// Compile the welcome_user.html template into blaze
SSR.compileTemplate('welcomeUser', Assets.getText('email/welcome_user.html'));
sendWelcomeEmail = function sendWelcomeEmail(to, from, userEmail) {
  // render the compiled template
  var data = SSR.render('welcomeUser', {email: userEmail});

  // send the email
  Email.send({
    to: to,
    from: from,
    subject: 'Welcome to Cherish',
    html: data
  });
};