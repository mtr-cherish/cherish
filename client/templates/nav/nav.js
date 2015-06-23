Template.nav.onRendered(function() {
  this.$('.button-collapse').sideNav({
    closeOnClick: true
  });
});

Template.nav.events({
  'click .logout': function(e, tpl){
    e.preventDefault();
    Meteor.logout(function(){
      sAlert.info('Logged out succesfully');
    });
  }
})

Template.userDropdown.onRendered(function() {
  this.$('.dropdown-button').dropdown({
    beloworigin: true
  });
});

Template.userDropdown.helpers({
  avatar: function(){
    return Meteor.user().profile.avatarImg;
  }
});

Template.notificationsDropdown.onRendered(function() {
  var instance = Template.instance(); 

  Tracker.autorun(function () {
    if(instance.view.template.__helpers[" hasNotifications"]()){
      this.$('.dropdown-button').dropdown({
        beloworigin: true,
        constrainwidth: true
      });
    }
  });
});

Template.notificationsDropdown.helpers({
  hasNotifications: function(){
    if(Meteor.user() && Meteor.user().notificationsCount() > 0){
      return true;
    }

    return false;
  },
  notifications: function() {
    if(Meteor.user()){
      return Meteor.user().notifications;
    }
  },
  getNotificationsCount: function() {
    if(Meteor.user())
      return Meteor.user().notificationsCount();
  },
  getNotificationsIcon: function() {
    switch(this.type){
      case 'comment':
      return  'mdi-editor-mode-comment';
      break;
      case 'vote':
      return 'mdi-action-favorite';
      break;
      case 'remove-vote':
      return 'mdi-action-favorite-outline';
      break;
    }
  },
  getNotificationsContent: function() {
    var initiative = Initiatives.findOne({_id: this.item});
    switch(this.type){
      case 'comment':
      return 'New comment on ' + initiative.title;
      break;
      case 'vote':
      return 'New Vote on ' + initiative.title;
      break;
      case 'remove-vote':
      return "Removed vote on " + initiative.title;
      break;
    }
    
  },
  getNotificationsAuthor: function(author){
    var user = Meteor.users.findOne({_id: author});
    if(user.profile.name)
      return user.profile.name;

    return user.username;
  }
});

Template.notificationsDropdown.events({
  'click .notification-link': function(e, tpl) {
    e.preventDefault();

    var initiative = Initiatives.findOne({_id: this.item});

    Router.go('initiative', {slug: initiative.slug});
    Meteor.call('deleteNotification', this, function(err, response){
      if(err){
        sAlert.error('Something went wrong...');
      }
    });
  }
})