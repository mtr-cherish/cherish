Router.map(function(){
  this.route('initiatives', {
    path: '/',
    template: 'initiatives',
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

  this.route('initiativeCreate', {
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
})