Meteor.startup(function () {
  smtp = {
    username: 'foo@gmail.com',   // gmail address
    password: 'password',   // password 
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 25
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});


// Compile the welcome_user.html template into blaze
SSR.compileTemplate('welcomeUser', Assets.getText('email/welcome_user.html'));
sendWelcomeEmail = function (to, from, userEmail) {
  // render the compiled template
  data = SSR.render('welcomeUser', {email: userEmail});
  // send the email
  Email.send({
    to: to,
    from: from,
    subject: 'Welcome to Cherish',
    html: data
  });
};

