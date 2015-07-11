Meteor.methods({
  sendEmail: function sendEmail(template, to) {
    Meteor.Mandrill.sendTemplate({
      /*eslint-disable */
      template_name: template,
      template_content: [
        {

        }
      /*eslint-enable */
      ],
      message: {
        to: [
          {email: to}
        ]
      }
    });
  }
});