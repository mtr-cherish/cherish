Router.configure({
  layoutTemplate: '_layout'
});

//From what I can tell this has been depreciated
//https://github.com/iron-meteor/iron-router/blob/739bcc1445db3ad6bf90bda4e0cab3203a0ae526/lib/router.js#L88
Router.map(function() {
  // initiative routes
  this.route('initiatives', {
    path: '/',
    template: 'initiatives',
    data: {
      initiatives: function() {
        return Initiatives.find({}, {$sort: {votes: -1}});
      }
    }
  });

  this.route('initiative', {
    path: '/initiative/:_id',
    template: 'initiativeShow',
    data: function () {
      return {
        initiative: Initiatives.findOne(this.params._id)
      }
    }
  });

  // login routes
  this.route('login', {
    path: '/login',
    template: 'publicLogin'
  });

  this.route('about');
});