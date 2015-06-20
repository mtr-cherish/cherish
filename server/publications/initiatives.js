Meteor.publish('initiatives', function () {
    return Initiatives.find({active: true, active: {"$exists": true}});
});

Meteor.publish('my.initiatives', function () {
   if(this.userId){
    return Initiatives.find({createdBy: this.userId})
   }
});