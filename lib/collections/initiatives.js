Initiatives = new Mongo.Collection('initiatives');

Initiatives.helpers({
  getInitiativeCategory: function() {
    return this.category.toLowerCase();
  },
  getInitiativeImage: function() {
    return this.imageUrl;
  },
  getInitiativeAuthorImage: function() {
    return "https://placeimg.com/60/60/people";
  }
});

if(Meteor.isServer) {
  Initiatives._ensureIndex({title: 1, category: 1});
}

InitiativeCategories = ['Event', 'Charity', 'Non Profit', 'Open Source'];
InititaiveCategorySlugs = InitiativeCategories.map(function(category) {
  return {
    slug: s.slugify(category),
    category: category
  };
});

// create slugs
var initiativeSlugs = function(userId, doc) {
  doc.slug = s.slugify(doc.title);
  doc.categorySlug = s.slugify(doc.category);
};

Initiatives.before.insert(initiativeSlugs);

Initiatives.before.insert(function(userId, doc){
  doc.createdAt = new Date().getTime();
});

Initiatives.after.update(function(userId, doc, fieldNames, modifier, options){

  function createNotification(type, userId){
    Notifications.insert({
      initiativeId: doc._id,
      userId: userId,
      ownerId: doc.createdBy,
      type: type,
      createdAt: new Date().getTime(),
      isRead: false
    })
  }

  function sendFollowersNotifications(type){
    if(doc.usersFollowing.length > 0){
      _.each(doc.usersFollowing, function(user){
        createNotification(type, user)
      });
    }
  }

  // Only send notifications on others initiatives
  if(doc.createdBy !== Meteor.userId()){
    if(modifier.$addToSet && modifier.$addToSet.comments){
      createNotification('comment', userId);
      sendFollowersNotifications('comment');
    }

    if(modifier.$addToSet && modifier.$addToSet.usersVoted){
      createNotification('vote', userId);
      sendFollowersNotifications('vote');
    }

    if(modifier.$pull && modifier.$pull.usersVoted){
      createNotification('remove-vote', userId);
    }
    if(modifier.$addToSet && modifier.$addToSet.usersFollowing){
      createNotification('follow', userId);
      createNotification('follow', doc.createdBy);
    }
    if(modifier.$pull && modifier.$pull.usersFollowing){
      createNotification('unfollow', userId);
      createNotification('unfollow', doc.createdBy);
    }
  }


});