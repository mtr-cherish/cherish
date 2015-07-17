var loggedInAction = function loggedInAction() {
  var routeToBe = Router.current().route.getName();

  if (!Meteor.userId()) {
    if (routeToBe === 'login') {
      this.redirect('login');
      return;
    }
    this.redirect('signup');
  }
  if (Meteor.userId() && (routeToBe === 'login' || routeToBe === 'signup')) {
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

Router.route('/signup', {
  name: 'signup',
  template: 'publicSignup'
});

Router.route('/login', {
  name: 'login',
  template: 'publicLogin'
});

Router.route('/about', {
  name: 'about',
  template: 'about'
});

Router.onBeforeAction(loggedInAction, {except: ['initiatives', 'initiative', 'category', 'about']});