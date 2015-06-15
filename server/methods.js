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
      }
    })
  });
}