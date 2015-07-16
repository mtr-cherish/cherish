var loggedInAction = function loggedInAction() {
  if (!Meteor.userId()) {
    this.redirect('login');
  }
  this.next();
};

var authenticatedRouteAction = function authenticatedRouteAction() {
  if (Meteor.userId()) {
    goBack();
  }
  this.next();
};

goBack = function goBack() {
  var previousRoute = Session.get('previousRoute');
  var previousRouteParams = Session.get('previousRouteParams');

  Router.go(previousRoute || 'initiatives', previousRouteParams || {});
};

Router.configure({
  layoutTemplate: '_cherishLayout',
  loadingTemplate: '_loading',
  progressDelay: 100,
  progressSpinner: false
});

Router.onStop(function routerOnStop() {
  var currentRoute = Router.current().route.getName();
  var currentRouteParams = Router.current().params;

  if (currentRoute === 'login' || currentRoute === 'signup') {
    return;
  }

  Session.set({
    previousRoute: currentRoute,
    previousRouteParams: _.extend({}, currentRouteParams)
  });
});

Router.route('/profile', {
  name: 'profile',
  template: 'profileSelf',
  data: function data() {
    return {
      user: Meteor.user()
    };
  }
});

Router.route('/profile/notifications', {
  name: 'profile.notifications',
  template: 'profileNotifications',
  data: function data() {
    return {
      user: Meteor.user()
    };
  }
});

Router.route('/profile/:username', {
  name: 'profile.user',
  template: 'profileUser',
  data: function data() {
    return {
      user: Users.findOne({username: this.params.username}),
      userData: Meteor.subscribe('userData')
    };
  }
});

Router.route('/signup', {
  name: 'signup',
  template: 'publicSignup',
  onBeforeAction: authenticatedRouteAction
});

Router.route('/login', {
  name: 'login',
  template: 'publicLogin',
  onBeforeAction: authenticatedRouteAction
});

Router.route('/about', {
  name: 'about',
  template: 'about'
});

Router.onBeforeAction(loggedInAction, {except: ['initiatives', 'initiative', 'category', 'about', 'login', 'signup']});
