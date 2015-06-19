Template.initiativesMine.helpers({
  count: function(active){
    return Initiatives.find({createdBy: Meteor.userId(), 
      active: {"$exists": true}, 
      active: active
    }).count()
  },
  initiatives: function(active){
    return Initiatives.find({
      createdBy: Meteor.userId(), 
      active: {"$exists": true}, 
      active: active});
  }
});