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
    data: function() {
        return {
          userData: Meteor.subscribe("userData"),
          initiatives: Initiatives.find({}, {sort: {votes: -1}})
      }
    },
    onAfterAction: function() {
      if(Session.equals('accountCreated', true)) {
        sAlert.success('Account created. Welcome to Cherish!');
        delete Session.keys['accountCreated'];
      }
    }
  });

  this.route('category', {
    path: '/category/:category',
    template: 'initiatives',
    data: function() {
        return {
          userData: Meteor.subscribe("userData"),
          initiatives: Initiatives.find({categorySlug: this.params.category}, {sort: {votes: -1}})
      }
    }
  });

  this.route('initiative', {
    path: '/initiative/:slug',
    template: 'initiativeShow',
    data: function () {
      return {
        userData: Meteor.subscribe("userData"),
        initiative: Initiatives.findOne({slug: this.params.slug})
      }
    }
  });

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