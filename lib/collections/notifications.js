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

sendFollowersNotification = function sendFollowersNotification(doc, type, ownerId) {
  if (!doc.usersFollowing || doc.usersFollowing.length === 0) {
    return;
  }
  _.each(doc.usersFollowing, function eachUser(userId) {
    if (userId === doc.createdBy) {
      return;
    }
    Meteor.call('createNotification', doc, type);
  });
};

Meteor.methods({
  createNotification: function createNotification(doc, type) {
    var userId = Meteor.userId();

    Notifications.insert ({
      initiativeId: doc._id,
      userId: userId,
      ownerId: doc.createdBy,
      type: type,
      createdAt: new Date ().getTime (),
      isRead: false
    });
  }
});