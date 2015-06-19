Template.initiativesMine.helpers({
  activeInitiatives: function(){
    return initiatives.find({
      createdBy: meteor.userId()}, 
      active: {"$exists": true}, 
      active: true});
  },

  inactiveInitiatives: function(){
    return initiatives.find({
      createdBy: meteor.userId(), 
      active: {"$exists": true}, 
      active: false});
  }
})