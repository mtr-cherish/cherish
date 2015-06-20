Router.configure({
  layoutTemplate: '_layout'
});


//From what I can tell this has been depreciated
//https://github.com/iron-meteor/iron-router/blob/739bcc1445db3ad6bf90bda4e0cab3203a0ae526/lib/router.js#L88
Router.map(function() {
  // App routes
  this.route('profile', {
    path: '/profile',
    template: 'profileShow',
    data: function() {
      return {
        profile: Meteor.user()
      }
    },
    action: function(){
      if(!Meteor.userId()){
        Router.go('initiatives');
      } else {
        this.render();
      }
    }
  });

  // login routes
  this.route('login', {
    path: '/login',
    template: 'publicLogin'
  });

  this.route('signup', {
    path: '/signup',
    template: 'publicSignup'
  });

  this.route('about');
});