Meteor.methods({
  sendEmail: function sendEmail(template, to, content) {
    Meteor.Mandrill.sendTemplate({
      "template_name": template,
      "template_content": [
        {

        }
      ],
      "message": {
        "to": [
          {"email": to}
        ]
      }
    });
  }
});