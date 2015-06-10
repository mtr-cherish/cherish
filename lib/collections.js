Initiatives = new Mongo.Collection('initiatives');

Meteor.users.allow({
  update: function(){
    return true;
  }
});