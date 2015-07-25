var getAvatar = function getAvatar(userId) {
  return Meteor.users.findOne({_id: userId}).profile.avatarImg;
};

var getUserNameById = function getUserNameById(userId) {
  return Meteor.users.findOne({_id: userId}).profile.name;
};

var getPastTenseAction = function getPastTenseAction(action) {
  switch (action) {
    case 'follow':
      return 'followed';
    case 'unfollow':
      return 'unfollowed';
    case 'follow-user':
      return 'followed you';
    case 'vote':
      return 'voted on';
    case 'comment':
      return 'commented on';
    default:
      return '';
  }
};

var userArrayMap = function userArrayMap(userId) {
  return getUserNameById(userId);
};

var rollUpNotifications = function rollUpNotifications(notifications) {
  var notificationInfo = {};

  notifications.forEach(function forEachNotificaiton(notification) {
    var idType = notification.initiativeId + notification.type;
    var notificationObj;

    if (!notificationInfo[idType]) {
      notificationInfo[idType] = {
        initiativeId: notification.initiativeId,
        type: notification.type,
        ids: [],
        createdAt: undefined,
        users: [],
        isRead: false
      };
    }
    notificationObj = notificationInfo[idType];

    if (!notificationObj.createdAt || notification.createdAt > notificationObj.createdAt) {
      notificationObj.createdAt = notification.createdAt;
    }
    if (notificationObj.ids.indexOf(notification._id) === -1) {
      notificationObj.ids.push(notification._id);
    }
    if (notificationObj.users.indexOf(notification.userId) === -1) {
      notificationObj.users.push(notification.userId);
    }
    if (!notificationObj.isRead && notification.isRead) {
      notificationObj.isRead = true;
    }
  });

  return _.map(notificationInfo, function mapNotificationInfo(obj) {
    var users = obj.users.slice(0, 3).map(userArrayMap);
    var userText = (obj.users.length > 1 && obj.users.length <= 3 ?
      users.slice(0, users.length - 1).join(', ') + ' and ' + users.pop() :
      users.join(', ') + ' ');

    return {
      ids: obj.ids,
      avatar: getAvatar(obj.users[0]),
      users: userText,
      text: getPastTenseAction(obj.type),
      othersText: (obj.users.length > 3 ?
        'and ' + obj.users.slice(3).length + ' others ' : ''),
      initiativeId: obj.initiativeId,
      isRead: obj.isRead,
      createdAt: obj.createdAt
    };
  });
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
    var initiative = Initiatives.findOne({_id: this.initiativeId});

    if (initiative) {
      return initiative.title;
    }
    return false;
  }
}, {
  name: 'getInitiativeSlug', helper: function getInitiativeSlugHelper() {
    var initiative = Initiatives.findOne({_id: this.initiativeId});

    if (initiative) {
      return initiative.slug;
    }
    return false;
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
  'click .unread': function clickUnread(event) {
    // var initiative = Initiatives.findOne({_id: this.initiativeId});

    event.preventDefault();

    // Router.go('initiative', {slug: initiative.slug});
    Meteor.call('markNotificationsAsRead', this.ids, function markNotificationsAsReadCallback(error) {
      if (error) {
        sAlert.error('Something went wrong...');
      }
    });
  },
  'click .mark-all-read': function clickMarkAllReady() {
    var notificationsToReadIds = [];

    _.each(getUnreadNotifications(), function eachUnreadNotification(notification) {
      notificationsToReadIds = notificationsToReadIds.concat(notification.ids);
    });

    Meteor.call('markNotificationsAsRead', notificationsToReadIds, function markNotificationsAsReadCallback(error) {
      if (error) {
        sAlert.error('Something went wrong...');
      }
    });
  },
  'click .title a': function clickTitle() {
    $('#notifications_modal').closeModal();
  }
});