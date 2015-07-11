/*
 * Global function to help reduce boilerplate code for Meteor
 * checks on the initiative object
 * @param initiative
 */
checkInitiative = function checkInitiative(initiative) {
  check(initiative, {
    _id: String,
    active: Boolean,
    category: String,
    categorySlug: String,
    createdAt: Number,
    createdBy: String,
    imageUrl: String,
    slug: String,
    summary: String,
    title: String,
    comments: Match.Optional([String]),
    usersVoted: Match.Optional([String]),
    votes: Number,
    modifiedAt: Number,
    usersFollowing: Match.Optional([String])
  });
};

// create slugs
var initiativeSlugs = function initiativeSlugs(doc) {
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

Meteor.methods({
  followUnfollow: function followUnfollow(initiative) {
    var user = Meteor.user();

    checkInitiative(initiative);

    if (!user) {
      throw new Meteor.Error(401, 'You have to be logged in to do that');
    }

    if (user._id === initiative.createdBy) {
      throw new Meteor.Error(401, 'You can\'t follow your own Initiatives');
    }

    if (!Throttle.checkThenSet('follow', 10, 1000)) {
      throw new Meteor.Error(500, 'You can only do this every 3 seconds');
    }

    if (_.contains(initiative.usersFollowing, user._id)) {
      Initiatives.update(initiative._id, {
        $pull: {usersFollowing: user._id}
      });
      // Meteor.users.update(Meteor.userId(), {$pull: {'votedOn': initiative._id}});
      return false;
    }

    Initiatives.update(initiative._id, {

      $addToSet: {usersFollowing: user._id}
    });
    return true;
  },

  addOrRemoveVote: function addOrRemoveVote(initiative) {
    var user = Meteor.user();

    checkInitiative(initiative);

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

  setInactiveActive: function setInactiveActive(initiative) {
    var updated;

    checkInitiative(initiative);

    if (initiative.createdBy === Meteor.userId()) {
      updated = Initiatives.update(initiative._id, {$set: {active: !initiative.active}});
    }

    if (!updated) {
      throw new Meteor.Error(500, 'Initiative could not be updated at current');
    }
    return true;
  },

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

  createInitiative: function createInitiative(title, summary, category) {
    var initiativeLimit = Meteor.settings.public.initiativeLimit;
    var existingInitiatives = Initiatives.find({createdBy: Meteor.userId(), active: true});
    var slug;
    var categorySlug;
    var initiative;

    check(title, String);
    check(summary, String);
    check(category, String);

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

  updateInitiative: function updateInitiative(initiative, props) {
    checkInitiative(initiative);
    if (!initiative._id) {
      throw new Meteor.Error(302, 'Can only edit initiatives with ID');
    }

    check(props, {
      title: String,
      summary: String,
      category: String,
      active: Boolean
    });

    return Initiatives.update(initiative._id, {$set: props});
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

Initiatives.before.update(function initiativesBeforeUpdate(userId, doc, fieldNames, modifier) {
  if (_.isEmpty(modifier.$set)) {
    return;
  }
  modifier.$set.modifiedAt = Date.now();
  modifier.$set.categorySlug = s.slugify(modifier.$set.category);
});

Initiatives.after.update(function initiativesAfterUpdate(userId, doc, fieldNames, modifier) {
  // Only send notifications on others initiatives
  if (modifier.$addToSet && modifier.$addToSet.comments) {
    if (doc.createdBy !== userId) {
      Meteor.call('createNotification', doc, 'comment');
    }
    Meteor.call('sendFollowersNotification', doc, 'comment', userId);
  }

  if (modifier.$addToSet && modifier.$addToSet.usersVoted) {
    Meteor.call('createNotification', doc, 'vote');
    Meteor.call('sendFollowersNotification', doc, 'vote', userId);
  }

  if (modifier.$pull && modifier.$pull.usersVoted) {
    Meteor.call('createNotification', doc, 'remove-vote');
  }

  if (modifier.$addToSet && modifier.$addToSet.usersFollowing) {
    Meteor.call('createNotification', doc, 'follow');
    Meteor.call('sendFollowersNotification', doc, 'follow', userId);
  }

  if (modifier.$pull && modifier.$pull.usersFollowing) {
    Meteor.call('createNotification', doc, 'unfollow');
    Meteor.call('sendFollowersNotification', doc, 'unfollow', userId);
  }
});