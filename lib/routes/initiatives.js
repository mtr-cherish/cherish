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
    delete Session.keys.accountCreated;
  }
});

Router.route('/profile/initiatives', {
  name: 'initiatives.mine',
  data: function() {
    return {
      initiatives: Initiatives.find({createdBy: Meteor.userId()}, {sort: {createdAt: -1}})
    };
  },
  waitOn: function() {
    return Meteor.subscribe('my.initiatives');
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

Router.route('/initiatives/create', {
  name: 'initiatives.create',
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

