Router.route('/', {
  name: 'initiatives',
  template: 'initiatives',
  layoutTemplate: '_cherishLayout',
  yieldTemplates: {
    initiativesHeader: {to: 'header'}
  },
  data: function data() {
    return {
      userData: Meteor.subscribe('userData')
    };
  },
  waitOn: function waitOn() {
    return Meteor.subscribe('initiatives');
  },
  onAfterAction: function onAfterAction() {
    Session.set('lastUpdated', new Date().getTime());
    if (!Session.get('accountCreated')) {
      return;
    }
    delete Session.keys.accountCreated;
  }
});

Router.route('/profile/initiative', {
  name: 'initiative.mine',
  yieldTemplates: {
    initiativeHeader: {to: 'header'}
  },
  data: function data() {
    return {
      initiative: Initiatives.findOne({createdBy: Meteor.userId()})
    };
  },
  waitOn: function waitOn() {
    return Meteor.subscribe('my.initiative');
  }
});

Router.route('/category/:category', {
  name: 'category',
  template: 'initiatives',
  data: function data() {
    return {
      userData: Meteor.subscribe('userData'),
      initiatives: Initiatives.find({categorySlug: this.params.category}, {sort: {votes: -1}})
    };
  }
});

Router.route('/initiative/create', {
  name: 'initiative.create',
  template: 'initiativeCreate',
  data: function data() {
    return {
      userData: Meteor.subscribe('userData')
    };
  }
});

Router.route('/initiatives/:slug/edit', {
  name: 'initiative.edit',
  template: 'initiativeEditFull',
  data: function() {
    return {
      initiative: Initiatives.findOne({slug: this.params.slug}),
      userData: Meteor.subscribe('userData')
    };
  }
});

Router.route('/initiative/:slug', {
  name: 'initiative',
  template: 'initiativeShow',
  layoutTemplate: '_cherishLayout',
  yieldTemplates: {
    initiativeHeader: {to: 'header'}
  },
  data: function data() {
    return {
      userData: Meteor.subscribe('userData'),
      initiative: Initiatives.findOne({slug: this.params.slug})
    };
  }
});
