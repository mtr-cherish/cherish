var loggedInAction = function loggedInAction() {
  if (!Meteor.userId()) {
    this.redirect('login');
  } else {
    this.next();
  }
};

Router.configure({
  layoutTemplate: '_cherishLayout',
  loadingTemplate: '_loading',
  progressDelay: 100,
  progressSpinner: false
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

Router.onBeforeAction(loggedInAction, {except: ['initiatives', 'initiative', 'category', 'login', 'signup', 'about']});