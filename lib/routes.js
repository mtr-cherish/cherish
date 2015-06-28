Router.configure({
  layoutTemplate: '_initiativesLayout',
  loadingTemplate: '_loading',
  yieldTemplates: {
    'footer': {to: 'footer'}
  },
  progressDelay: 100,
  progressSpinner: false
});

Router.route('/profile', {
  name: 'profile',
  template: 'profileSelf',
  data: function() {
    return {
      user: Meteor.user()
    };
  }
});

Router.route('/profile/notifications', {
  name: 'profile.notifications',
  template: 'profileNotifications',
  data: function() {
    return {
      user: Meteor.user()
    }
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

var loggedInAction = function(){
  if(!Meteor.userId()){
    this.redirect('login');
  } else {
    this.next();
  }
}

Router.onBeforeAction(loggedInAction, {except: ['initiatives', 'initiative', 'category', 'login', 'signup', 'about']})