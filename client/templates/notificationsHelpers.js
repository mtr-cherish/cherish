Helpers = [
{
  name: 'hasNotifications', helper: function(){
    return Meteor.user() && hasUnreadNotifications();
  }
},
{
  name: 'notifications', helper: function() {
    if (!Meteor.user()) {
      return undefined;
    }
    return getNotifications();
  }
},
{
  name: 'getNotificationsCount', helper: function() {
    if (!Meteor.user()) {
      return undefined;
    }
    return _.where(getNotifications(), {isRead: false}).length;
  }
},
{
  name: 'getNotificationsIcon', helper: function() {
    switch(this.text){
      case 'commented on':
      return  'comment';
      break;
      case 'voted on':
      return 'favorite';
      break;
      case 'removed vote':
      return 'favorite_border';
      break;
      case 'followed':
      return 'favorite_border';
      break;
    }
  }
},
{
  name: 'getReadClass', helper: function() {
    return this.isRead ? 'read' : 'unread';
  }
},
{
  name: 'getInitiativeTitle', helper: function(){
    return Initiatives.findOne({_id: this.initiativeId}).title;
  }
},
{
  name: 'getInitiativeSlug', helper: function(){
    return Initiatives.findOne({_id: this.initiativeId}).slug;
  }
}
];

_.each(Helpers, function(helper){
  Template.registerHelper(helper.name, helper.helper);
})

function getNotifications() {
  var notifications = Notifications.find({ownerId: Meteor.userId()}, {sort: {createdAt: -1}});
  return rollUpNotifications(notifications);
}

function getUnreadNotificationCount() {
  return _.where(getNotifications(), {isRead: false}).length;
}

function getNotificationCount() {
  return getNotifications().length;
}

function hasUnreadNotifications() {
  return getUnreadNotificationCount() > 0;
}

function getAvatar(userId) {
  return Meteor.users.findOne({_id: userId}).profile.avatarImg;
}

function getUserNameById(userId){
  var user = Meteor.users.findOne({_id: userId});
  return user.profile.name;
}

function edAWord(word) {
  var suffix = 'ed';
  if (word[word.length - 1] === 'e') {
    suffix = 'd';
  }
  if (word + suffix !== 'followed') {
    return word + suffix + ' on';
  }
  return word + suffix;
}

function rollUpNotifications(notifications) {
  var rolledUpNotifications = [];
  var unreadNotifications = [];
  var notificationDates = {};
  var notificationIds = {};
  var notificationsObj = {};
  var userArray, users, userText, othersText, lastUser, initiativeId, type;

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
    if (!notificationIds[type + initiativeId]) {
      notificationIds[type + initiativeId] = [];
    }
    if (notificationIds[type + initiativeId].indexOf(notification._id) === -1) {
      notificationIds[type + initiativeId].push(notification._id);
    }
    if (notificationsObj[initiativeId][type].indexOf(notification.userId)) {
      notificationsObj[initiativeId][type].push(notification.userId);
    }
    if (notification.isRead || unreadNotifications.indexOf(type + initiativeId) !== -1) {
      return;
    }
    unreadNotifications.push(type + initiativeId);
  });

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
        ids: notificationIds[type + initiativeId],
        avatar: getAvatar(userArray[0]),
        users: userText,
        text: edAWord(type),
        othersText: othersText,
        initiativeId: initiativeId,
        isRead: unreadNotifications.indexOf(type + initiativeId) === -1,
        createdAt: notificationDates[type + initiativeId]
      });
    }
  }
  return rolledUpNotifications;
}

Template.notificationsDropdown.onRendered(function() {
  Tracker.autorun(function () {
    if(getNotificationCount()) {
      this.$('.dropdown-button').dropdown({
        beloworigin: true,
        constrainwidth: false
      });
    }
  });
});