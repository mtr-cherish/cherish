Initiatives = new Mongo.Collection('initiatives');

Meteor.users.allow({
  update: function(){
    return true;
  }
});

// create slugs
var initiativeSlug = function(userId, doc) {
	doc.slug = s.slugify(doc.title);
};

Initiatives.before.insert(initiativeSlug);

