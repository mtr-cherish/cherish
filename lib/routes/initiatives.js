Router.route('/', {
  name: 'initiatives',
  template: 'initiatives',
  layoutTemplate: '_cherishLayout',
  yieldTemplates: {
    'initiativesHeader': {to: 'header'}
  },
  data: function() {
    return {
      userData: Meteor.subscribe('userData')
    };
  },
  waitOn: function() {
    return Meteor.subscribe('initiatives');
  },
  onAfterAction: function() {
    Session.set('lastUpdated', new Date().getTime());
    if (!Session.get('accountCreated')) {
      return;
    }
    sAlert.success('Account created. Welcome to Cherish');
    delete Session.keys.accountCreated;
  }
});

Router.route('/profile/initiative', {
  name: 'initiative.mine',
  yieldTemplates: {
    'initiativeHeader': {to: 'header'}
  },
  data: function() {
    return {
      initiative: Initiatives.findOne({createdBy: Meteor.userId()})
    };
  },
  waitOn: function() {
    return Meteor.subscribe('my.initiative');
  }
});

Router.route('/category/:category', {
  name: 'category',
  template: 'initiatives',
  data: function() {
    return {
      userData: Meteor.subscribe('userData'),
      initiatives: Initiatives.find({categorySlug: this.params.category}, {sort: {votes: -1}})
    };
  }
});

Router.route('/initiative/create', {
  name: 'initiative.create',
  template: 'initiativeCreate',
  data: function() {
    return {
      userData: Meteor.subscribe('userData')
    };
  }
});

Router.route('/initiative/:slug', {
  name: 'initiative',
  template: 'initiativeShow',
  layoutTemplate: '_cherishLayout',
  yieldTemplates: {
    'initiativeHeader': {to: 'header'}
  },
  data: function() {
    return {
      userData: Meteor.subscribe('userData'),
      initiative: Initiatives.findOne({slug: this.params.slug})
    };
  }
});

