Meteor.publish('my.initiatives', function () {
   if(this.userId){
    return Initiatives.find({createdBy: this.userId})
   }
});