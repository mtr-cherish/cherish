var addCommentKey;
Meteor.startup(function() {
  Meteor.methods({
    addComment: function(initiativeId, input) {
      var userId = Meteor.userId();
      if (!addCommentKey) {
        addCommentKey = 'addComment-' + Meteor.userId();
      }
      if (!Throttle.checkThenSet(addCommentKey, 1, 3000)) {
        throw new Meteor.Error(500, 'You can only comment every 3 seconds');
      }
      Meteor.users.update(userId, { $addToSet: { commentedOn: initiativeId } });
      Initiatives.update(initiativeId, {$addToSet: {comments: {
        createdBy: userId,
        message: input,
        createdAt: new Date()
      }}});
      return true;
    },

    createInitiative: function(title, description, category) {
      var initiativeLimit = Meteor.settings.public.initiativeLimit;
      var existingInitiatives = Initiatives.find({createdBy: Meteor.userId(), active: {"$exists": true}, active: true});
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
          categorySlug: categorySlug,
          active: true
        }

        Initiatives.insert(initiative);
        return slug;
      } else {
        throw new Meteor.Error(403, "You have reached the limit of " + initiativeLimit + " initiatives.");
      }
    },

    setInactiveActive: function(initiative){
      if(initiative.createdBy === Meteor.userId()){
        var updated = Initiatives.update(initiative._id, {$set: { active: !initiative.active}});
      }

      if(updated){
        return true;
      } else {
        throw new Meteor.Error(500, 'Initiative could not be updated at current');
      }
    }
  });
});
