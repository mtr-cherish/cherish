var loggedInAction = function loggedInAction() {
  if (!Meteor.userId()) {
    this.redirect('/signup');
  }
  this.next();
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

  if (currentRoute === 'signup') {
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

Router.route('/about', {
  name: 'about',
  template: 'about'
});


Router.onBeforeAction(loggedInAction, {except: ['initiatives', 'initiative',
  'category', 'about']});
