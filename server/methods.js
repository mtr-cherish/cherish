Meteor.startup(function meteorStartup() {
  Meteor.methods({
    markNotificationsAsRead: function markNotificationsAsRead(notificationIds) {
      _.each(notificationIds, function eachNotificationIds(notificationId) {
        check(notificationId, String);
      });

      if (Meteor.user()) {
        Notifications.update({_id: {$in: notificationIds}}, {$set: {isRead: true}}, {multi: true});
      }
    }
  });
});