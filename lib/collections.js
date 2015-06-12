Initiatives = new Mongo.Collection('initiatives');

InitiativeCategories = ['Event', 'Charity', 'Non Profit', 'Open Source'];
InititaiveCategorySlugs = InitiativeCategories.map(function(category) {
  return s.slugify(category);
});

Meteor.users.allow({
  update: function(){
    return true;
  }
});

// create slugs
var initiativeSlugs = function(userId, doc) {
	doc.slug = s.slugify(doc.title);
	doc.categorySlug = s.slugify(doc.category);
};

Initiatives.before.insert(initiativeSlugs);

