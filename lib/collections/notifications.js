/*
  An example Notification object.
  When an action is performed on an Initiative (TODO: List out types of actions worthy of Notifications), then a Notification is created.
  Note: 'X' number of these will be created by iterating the 'followers' array of the Initiative being acted upon.
  We will iterate over every follower in the array, and create a new Notification document, setting the ownerId to the id of said follower.
  {
    _id,
    initiativeId,
    userId, // the user who performed the action
    ownerId, // the person who holds this notification close and dear (it belongs to them!)
    type, // the type of action performed ['comment', 'vote', 'follow', 'edit']
    isRead, // starts out as false. moves to true when the user reads it (or we can simply delete the Notification at this point)
    createdAt // timestamp when this Notification was created
  }
*/

Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  createNotification: function createNotification(doc, type, followerId, ownerId) {
    var userId = Meteor.userId();

    Notifications.insert({
      initiativeId: doc._id,
      userId: followerId !== undefined ? followerId : userId,
      ownerId: ownerId !== undefined ? ownerId : doc.createdBy,
      type: type,
      createdAt: new Date().getTime(),
      isRead: false
    });
  },

  sendFollowersNotification: function sendFollowersNotification(doc, type, currentUserId) {
    if (!doc.usersFollowing || doc.usersFollowing.length === 0) {
      return;
    }
    _.each(doc.usersFollowing, function eachUser(followerId) {
      if (followerId === currentUserId) {
        return;
      }
      Meteor.call('createNotification', doc, type, currentUserId, followerId);
    });
  },

  markNotificationsAsRead: function markNotificationsAsRead(notificationIds) {
    _.each(notificationIds, function eachNotificationIds(notificationId) {
      check(notificationId, String);
    });

    if (Meteor.user()) {
      Notifications.update({_id: {$in: notificationIds}}, {$set: {isRead: true}}, {multi: true});
    }
  }
});