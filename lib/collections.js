Initiatives = new Mongo.Collection('initiatives');

InitiativeCategories = ['Event', 'Charity', 'Non Profit', 'Open Source'];

Meteor.users.allow({
  update: function(){
    return true;
  }
});

// create slugs
var initiativeSlugs = function(userId, doc) {
	doc.slug = s.slugify(doc.title);
	doc.catSlug = s.slugify(doc.category);
};

Initiatives.before.insert(initiativeSlugs);

