Initiatives = new Mongo.Collection('initiatives');

if(Meteor.isServer) {
  Initiatives._ensureIndex({title: 1, category: 1});
}

InitiativeCategories = ['Event', 'Charity', 'Non Profit', 'Open Source'];
InititaiveCategorySlugs = InitiativeCategories.map(function(category) {
  return s.slugify(category);
});

// create slugs
var initiativeSlugs = function(userId, doc) {
  doc.slug = s.slugify(doc.title);
  doc.categorySlug = s.slugify(doc.category);
};

Initiatives.before.insert(initiativeSlugs);