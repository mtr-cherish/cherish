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
  function createNotification(type){
    Meteor.users.update(doc.createdBy, {$addToSet: {notifications: {
      item: doc._id,
      type: type,
      by: userId,
      when: new Date().getTime()
    }}});
  }
  
  if(modifier.$addToSet && modifier.$addToSet.comments){
    createNotification('comment');
  }
  
  if(modifier.$addToSet && modifier.$addToSet.usersVoted){
   createNotification('vote');
  }

  if(modifier.$pull && modifier.$pull.usersVoted){
    createNotification('remove-vote');
  }

});