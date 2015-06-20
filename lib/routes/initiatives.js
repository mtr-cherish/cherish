Router.map(function(){
  
  this.route('initiatives', {
    path: '/',
    template: 'initiatives',
    layoutTemplate: '_initiativesLayout',
    data: function() {
        return {
          userData: Meteor.subscribe("userData")
      }
    },
    waitOn: function(){
      return Meteor.subscribe('initiatives');
    },
    onAfterAction: function() {
      Session.set('lastUpdated', new Date().getTime());

      if(Session.equals('accountCreated', true)) {
        sAlert.success('Account created. Welcome to Cherish!');
        delete Session.keys['accountCreated'];
      }
    }
  });

  this.route('initiatives.mine', {
    path: '/profile/initiatives',
    waitOn: function(){
      return Meteor.subscribe('my.initiatives');
    },
    data: function(){
      return {
        initiatives: Initiatives.find({createdBy: Meteor.userId()}, {sort: {createdAt: -1}})
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

  this.route('initiatives.create', {
    path: '/initiative/create',
    template: 'initiativeCreate',
    data: function() {
      return {
        userData: Meteor.subscribe("userData")
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

});

var loggedInAction = function(){
  if(!Meteor.userId()){
    this.redirect('login');
  } else {
    this.next();
  }
}

Router.onBeforeAction(loggedInAction, {except: ['initiatives', 'category', 'login', 'signup', 'about', 'profile']})