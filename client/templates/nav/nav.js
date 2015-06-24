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
      this.$('.dropdown-button').dropdown({
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
    var notifications;
    if (!Meteor.user()) {
      return undefined;
    }
    notifications = Notifications.find({ownerId: Meteor.userId()}, {sort: {createdAt: -1}});

    return rollUpNotifications(notifications);

  },
  getNotificationsCount: function() {
    if(Meteor.user())
      return Notifications.find({ownerId: Meteor.userId(), isRead: false}).count();
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
  getUsersWhoTriggeredNotification: function(userIds){
    var users = Meteor.users.find({_id: {$in: userIds}});
    return users.fetch().map(function(user) {
      if (user.profile.name) {
        return user.profile.name;
      }
      return user.username;
    });
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
});

function getUserNameById(userId){
  var user = Meteor.users.findOne({_id: userId});
  return user.profile.name ? user.profile.name : user.username;
}

function edAWord(word) {
  var suffix = 'ed';
  if (word[word.length - 1] === 'e') {
    suffix = 'd';
  }
  return word + suffix;
}

function rollUpNotifications(notifications) {
  var rolledUpNotifications = [];
  var unreadNotifications = [];
  var notificationDates = {};
  var notificationsObj = {};
  var userArray, users, othersText, lastUser, initiativeId, type;

  notifications.forEach(function(notification) {
    var initiativeId = notification.initiativeId;
    var type = notification.type;
    if (!notificationsObj[initiativeId]) {
      notificationsObj[initiativeId] = {};
    }
    if (!notificationsObj[initiativeId][type]) {
      notificationsObj[initiativeId][type] = [];
    }
    if (!notificationDates[type + initiativeId] || notification.createdAt > notificationDates[type + initiativeId]) {
      notificationDates[type + initiativeId] = notification.createdAt;
    }
    if (notificationsObj[initiativeId][type].indexOf(notification.userId)) {
      notificationsObj[initiativeId][type].push(notification.userId);
    }
    if (notification.isRead || unreadNotifications.indexOf(type + initiativeId) !== -1) {
      return;
    }
    unreadNotifications.push(type + initiativeId);
  });

  console.log(notificationsObj);

  for (initiativeId in notificationsObj) {
    for (type in notificationsObj[initiativeId]) {
      userArray = notificationsObj[initiativeId][type];
      users = userArray.slice(0, 3).map(function(userId) {
        return getUserNameById(userId);
      });
      userText = users.join(', ') + ' ';
      lastUser = othersText = '';
      if (userArray.length > 3) {
        othersText = 'and ' + userArray.slice(3).length + ' others ';
      } else if (userArray.length <= 3 && userArray.length > 1) {
        lastUser = users.pop();
        userText = users.join(', ') + ' and ' + lastUser + ' ';
      }
      rolledUpNotifications.push({
        users: userText,
        text: edAWord(type) + ' on',
        othersText: othersText,
        initiativeId: initiativeId,
        isRead: unreadNotifications.indexOf(type + initiativeId) === -1,
        createdAt: notificationDates[type + initiativeId]
      });
    }
  }
  return rolledUpNotifications;
}