var getAvatar = function getAvatar(userId) {
  return Meteor.users.findOne({_id: userId}).profile.avatarImg;
};

var getUserNameById = function getUserNameById(userId) {
  return Meteor.users.findOne({_id: userId}).profile.name;
};

var edAWord = function edAWord(word) {
  var suffix = 'ed';

  if (word[word.length - 1] === 'e') {
    suffix = 'd';
  }
  if (word + suffix !== 'followed') {
    return word + suffix + ' on';
  }
  return word + suffix;
};

var userArrayMap = function userArrayMap(userId) {
  return getUserNameById(userId);
};

var rollUpNotifications = function rollUpNotifications(notifications) {
  var rolledUpNotifications = [];
  var unreadNotifications = [];
  var notificationDates = {};
  var notificationIds = {};
  var notificationsObj = {};
  var userArray;
  var users;
  var userText;
  var othersText;
  var lastUser;
  var initiativeId;
  var type;

  notifications.forEach(function forEachNotification(notification) {
    initiativeId = notification.initiativeId;
    type = notification.type;

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
      users = userArray.slice(0, 3).map(userArrayMap);
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
};

var getNotifications = function getNotifications() {
  var notifications = Notifications.find({ownerId: Meteor.userId()}, {sort: {createdAt: -1}});

  return rollUpNotifications(notifications);
};

var getUnreadNotificationCount = function getUnreadNotificationCount() {
  return _.where(getNotifications(), {isRead: false}).length;
};

var getUnreadNotifications = function getUnreadNotifications() {
  return _.where(getNotifications(), {isRead: false});
};

var hasUnreadNotifications = function hasUnreadNotifications() {
  return getUnreadNotificationCount() > 0;
};

var Helpers = [{
  name: 'hasNotifications', helper: function hasNotificationsHelper() {
    return Meteor.user() && hasUnreadNotifications();
  }
}, {
  name: 'notifications', helper: function notificationsHelper() {
    if (!Meteor.user()) {
      return undefined;
    }
    return getNotifications();
  }
}, {
  name: 'getNotificationsCount', helper: function getNotificationsCountHelper() {
    if (!Meteor.user()) {
      return undefined;
    }
    return _.where(getNotifications(), {isRead: false}).length;
  }
}, {
  name: 'getNotificationsIcon', helper: function getNotificationsIconHelper() {
    switch (this.text) {
      case 'commented on':
        return 'comment';
      case 'voted on':
        return 'favorite';
      case 'removed vote':
        return 'favorite_border';
      case 'followed':
        return 'favorite_border';
      default:
        return '';
    }
  }
}, {
  name: 'getReadClass', helper: function getReadClassHelper() {
    return this.isRead ? 'read' : 'unread';
  }
}, {
  name: 'getInitiativeTitle', helper: function getInitiativeTitleHelper() {
    return Initiatives.findOne({_id: this.initiativeId}).title;
  }
}, {
  name: 'getInitiativeSlug', helper: function getInitiativeSlugHelper() {
    return Initiatives.findOne({_id: this.initiativeId}).slug;
  }
}, {
  name: 'getButtonState', helper: function getButtonStateHelper() {
    return getUnreadNotificationCount() > 0 ? '' : 'disabled';
  }
}];

_.each(Helpers, function eachHelpers(helper) {
  Template.registerHelper(helper.name, helper.helper);
});

Template.notificationsModal.events({
  'click .unread': function clickUnread(e) {
    // var initiative = Initiatives.findOne({_id: this.initiativeId});

    e.preventDefault();

    // Router.go('initiative', {slug: initiative.slug});
    Meteor.call('markNotificationsAsRead', this.ids, function markNotificationsAsReadCallback(err) {
      if (err) {
        sAlert.error('Something went wrong...');
      }
    });
  },
  'click .mark-all-read': function clickMarkAllReady() {
    var notificationsToReadIds = [];

    _.each(getUnreadNotifications(), function eachUnreadNotification(notification) {
      notificationsToReadIds = notificationsToReadIds.concat(notification.ids);
    });

    Meteor.call('markNotificationsAsRead', notificationsToReadIds, function markNotificationsAsReadCallback(err) {
      if (err) {
        sAlert.error('Something went wrong...');
      }
    });
  },
  'click .title a': function clickTitle() {
    $('#notifications_modal').closeModal();
  }
});