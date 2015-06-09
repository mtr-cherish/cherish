Router.configure({
  layoutTemplate: '_layout'
});

//From what I can tell this has been depreciated
//https://github.com/iron-meteor/iron-router/blob/739bcc1445db3ad6bf90bda4e0cab3203a0ae526/lib/router.js#L88
Router.map(function() {
  this.route('initiatives', {
    path: '/',
    data: {
      initiatives: function() {
        return Initiatives.find();
      }
    }
  });
});

Router.route('/about', function () {
  this.render('about');
});