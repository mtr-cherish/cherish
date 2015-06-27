Template.nav.onRendered(function() {
  this.$('.button-collapse').sideNav({
    closeOnClick: true
  });
});

Template.nav.events({
  'click .logout': function(e){
    e.preventDefault();
    Meteor.logout(function(){
      sAlert.info('Logged out succesfully');
      Router.go('initiatives');
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
      instance.$('.dropdown-button').dropdown({
        beloworigin: true,
        constrainwidth: false
      });
    }
  });
});

Template.notificationsDropdown.helpers({
  hasNotifications: function(){
    return Notifications.find({ownerId: Meteor.userId(), isRead: false});
  },
  notifications: function() {
    if(Meteor.user())
      return Notifications.find({ownerId: Meteor.userId()}, {sort: {createdAt: -1}});
  },
  getNotificationsCount: function() {
    if(Meteor.user())
      return Notifications.find({ownerId: Meteor.userId(), isRead: false}).count();
  },
  getNotificationsIcon: function() {
    switch(this.type){
      case 'comment':
      return  'comment';
      break;
      case 'vote':
      return 'favorite';
      break;
      case 'remove-vote':
      return 'favorite_border';
      break;
      case 'follow':
      return 'directions_run';
      break;
    }
  },
  getNotificationsContent: function() {
    switch(this.type){
      case 'comment':
      return ' commented on ';
      break;
      case 'vote':
      return ' voted on ';
      break;
      case 'remove-vote':
      return " removed their vote on ";
      break;
      case 'follow':
      return " is now following ";
      break;
      case 'unfollow':
      return " stopped following ";
      break;
    }
    
  },
  getReadClass: function() {
    return this.isRead ? 'read' : 'unread';
  },
  getInitiativeTitle: function(){
    return Initiatives.findOne({_id: this.initiativeId}).title;
  },
  getInitiativeSlug: function(){
    return Initiatives.findOne({_id: this.initiativeId}).slug;
  },
  getUserWhoTriggeredNotification: function(userId){
    var user = Meteor.users.findOne({_id: userId});
    if(user.profile.name)
      return user.profile.name;

    return user.username;
  }
});

Template.notificationsDropdown.events({
  'click .notification.unread': function(e, tpl) {
    e.preventDefault();

    var initiative = Initiatives.findOne({_id: this.initiativeId});

    Router.go('initiative', {slug: initiative.slug});
    Meteor.call('deleteNotification', this, function(err, response){
      if(err){
        sAlert.error('Something went wrong...');
      }
    });
  }
})

Template.registerHelper('getAvatar', function(userId){
  return Meteor.users.findOne({_id: userId}).profile.avatarImg;
})
