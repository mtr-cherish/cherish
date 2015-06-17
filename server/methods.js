Meteor.startup(function() {
  Meteor.methods({
    addComment: function(initiativeId, input) {
      var userId = Meteor.userId();
      Meteor.users.update(userId, { $addToSet: { commentedOn: initiativeId } });
      Initiatives.update(initiativeId, {$addToSet: {comments: {
        createdBy: userId,
        message: input,
        createdAt: new Date()
      }}});
    },

    createInitiative: function(title, description, category) {
      var initiativeLimit = Meteor.settings.initiativeLimit;
      var existingInitiatives = Initiatives.find({createdBy: Meteor.userId});
      if(existingInitiatives && existingInitiatives.count() < initiativeLimit) {
        var slug = s.slugify(title);
        var categorySlug = s.slugify(category);
        var initiative =
        {
          title: title,
          description: description,
          votes: 0,
          createdBy: Meteor.userId(),
          createdAt: new Date(),
          category: category,
          imageUrl: "https://placeimg.com/300/250/arch",
          comments: [],
          slug: slug,
          categorySlug: categorySlug
        }

        Initiatives.insert(initiative);
        return slug;
      } else {
        throw new Meteor.Error(403, "You have reached the limit of " + initiativeLimit + " initiatives.");
      }
    }
  });
});
