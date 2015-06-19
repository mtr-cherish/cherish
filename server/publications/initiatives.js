Meteor.publish('my.initiatives', function (userId) {
   if(userId){
    return initiatives.find({createdBy: userId})
   }
});