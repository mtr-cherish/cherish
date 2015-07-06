Meteor.startup(function meteorStartup() {
  Meteor.methods({
    addComment: function addComment(initiativeId, input) {
      var userId = Meteor.userId();

      check(initiativeId, String);
      check(input, String);

      if (!userId) {
        throw new Meteor.Error(401, 'Can only comment as logged in user');
      }

      if (!Throttle.checkThenSet('addcomment', 5, 30000)) {
        throw new Meteor.Error(500, 'You can only comment every 3 seconds');
      }
      Meteor.users.update(userId, {$addToSet: {commentedOn: initiativeId}});
      return Initiatives.update(initiativeId, {$addToSet: {comments: {
        createdBy: userId,
        message: input,
        createdAt: new Date()
      }}});
    },

    addOrRemoveVote: function addOrRemoveVote(initiative) {
      var user = Meteor.user();

      if (!user) {
        throw new Meteor.Error(401, 'Can only vote as logged in user');
      }

      if (user._id === initiative.createdBy) {
        throw new Meteor.Error(401, 'You can\'t vote on your own Initiatives');
      }

      if (!Throttle.checkThenSet('vote', 10, 1000)) {
        throw new Meteor.Error(500, 'You can only vote every 3 seconds');
      }

      if (_.contains(user.votedOn, initiative._id)) {
        Initiatives.update(initiative._id, {
          $inc: {votes: -1},
          $pull: {usersVoted: user._id}
        });
        Meteor.users.update(Meteor.userId(), {$pull: {votedOn: initiative._id}});
        return false;
      }
      Initiatives.update(initiative._id, {
        $inc: {votes: 1},
        $addToSet: {usersVoted: user._id}
      });
      Meteor.users.update(Meteor.userId(), {$addToSet: {votedOn: initiative._id}});
      return true;
    },

    createInitiative: function createInitiative(title, summary, category) {
      var initiativeLimit = Meteor.settings.public.initiativeLimit;
      var existingInitiatives = Initiatives.find({createdBy: Meteor.userId(), active: true});
      var slug;
      var categorySlug;
      var initiative;

      if (!existingInitiatives && existingInitiatives.count() > initiativeLimit) {
        throw new Meteor.Error(403, 'You have reached the limit of ' + initiativeLimit + ' initiatives.');
      }

      slug = s.slugify(title);
      categorySlug = s.slugify(category);
      initiative = {
        title: title,
        summary: summary,
        votes: 0,
        createdBy: Meteor.userId(),
        createdAt: new Date(),
        category: category,
        imageUrl: '/images/placeholder-initiative.jpg',
        comments: [],
        slug: slug,
        categorySlug: categorySlug,
        active: true
      };

      Initiatives.insert(initiative);
      return slug;
    },

    setInactiveActive: function setInactiveActive(initiative) {
      var updated;

      if (initiative.createdBy === Meteor.userId()) {
        updated = Initiatives.update(initiative._id, {$set: {active: !initiative.active}});
      }

      if (!updated) {
        throw new Meteor.Error(500, 'Initiative could not be updated at current');
      }
      return true;
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
});