var createNotification = function createNotification(doc, type, userId, owner) {
  Notifications.insert({
    initiativeId: doc._id,
    userId: userId,
    ownerId: owner,
    type: type,
    createdAt: new Date().getTime(),
    isRead: false
  });
};

var sendFollowersNotification = function sendFollowersNotification(doc, type, ownerId) {
  if (!doc.usersFollowing || doc.usersFollowing.length === 0) {
    return;
  }
  _.each(doc.usersFollowing, function eachUser(userId) {
    if (userId === ownerId) {
      return;
    }
    createNotification(doc, type, userId, ownerId);
  });
};

// create slugs
var initiativeSlugs = function initiativeSlugs(userId, doc) {
  doc.slug = s.slugify(doc.title);
  doc.categorySlug = s.slugify(doc.category);
};

Initiatives = new Mongo.Collection('initiatives');

Initiatives.helpers({
  getInitiativeCategory: function getInitiativeCategory() {
    return this.category.toLowerCase();
  },
  getInitiativeImage: function getInitiativeImage() {
    return this.imageUrl;
  },
  getInitiativeAuthorImage: function getInitiativeAuthorImage() {
    var user = Users.findOne(this.createdBy);

    if (user) {
      return user.profile.avatarImg;
    }
    return '/images/placeholder-avatar.jpg';
  }
});

if (Meteor.isServer) {
  Initiatives._ensureIndex({title: 1, category: 1});
}

InitiativeCategories = ['Event', 'Charity', 'Non Profit', 'Open Source'];
InitiativeCategorySlugs = InitiativeCategories.map(function InitiativeCategoriesMap(category) {
  return {
    slug: s.slugify(category),
    category: category
  };
});

Initiatives.before.insert(initiativeSlugs);

Initiatives.before.insert(function initiativesBeforeInsert(userId, doc) {
  doc.createdAt = new Date().getTime();
});

Initiatives.after.update(function initiativesAfterUpdate(userId, doc, fieldNames, modifier) {
  // Only send notifications on others initiatives

  if (modifier.$addToSet && modifier.$addToSet.comments) {
    if (doc.createdBy !== userId) {
      createNotification('comment', userId, doc.createdBy);
    }
    sendFollowersNotification('comment', userId);
  }

  if (modifier.$addToSet && modifier.$addToSet.usersVoted) {
    createNotification('vote', userId, doc.createdBy);
    sendFollowersNotification('vote', userId);
  }

  if (modifier.$pull && modifier.$pull.usersVoted) {
    createNotification('remove-vote', userId, doc.createdBy);
  }

  if (modifier.$addToSet && modifier.$addToSet.usersFollowing) {
    createNotification('follow', userId, doc.createdBy);
    sendFollowersNotification('follow', userId);
  }
  if (modifier.$pull && modifier.$pull.usersFollowing) {
    createNotification('unfollow', userId, doc.createdBy);
    sendFollowersNotification('unfollow', userId);
  }
});