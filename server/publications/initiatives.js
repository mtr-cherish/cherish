Meteor.publish('initiatives', function () {
    return Initiatives.find({active: true, active: {"$exists": true}});
});

Meteor.publish('my.initiative', function () {
   if(this.userId){
    return Initiatives.find({createdBy: this.userId},  {limit: 1})
   }
});