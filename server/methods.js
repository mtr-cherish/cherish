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
    }
  });
});