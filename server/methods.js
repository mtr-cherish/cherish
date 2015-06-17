if(Meteor.isServer) {
  Meteor.startup(function() {
    Meteor.methods({
      addComment: function(userId, initiativeId, input) {
        Meteor.users.update(userId, { $addToSet: { commentedOn: initiativeId } });
        Initiatives.update(initiativeId, {$addToSet: {comments: {
          createdBy: userId,
          message: input,
          createdAt: new Date()
        }}});
      },

      createInitiative: function(title, description, category) {
        var slug = s.slugify(title);
        var categorySlug = s.slugify(category);
        var initiative = 
        {
          title: title, 
          description: description, 
          votes: 0, 
          createdBy: Meteor.userId(), 
          category: category,
          imageUrl: "https://placeimg.com/300/250/arch",
          comments: [],
          slug: slug,
          categorySlug: categorySlug
        }
        Initiatives.insert(initiative);
        return slug;
      }
    })
  });
}