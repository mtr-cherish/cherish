Template.initiativesUpdate.helpers({
  newInitiatives: function(){
    return Initiatives.find({createdAt: {$gt: Session.get('lastUpdated')}}).count();
  }
})

Template.initiativesUpdate.events({
  'click .update': function(){
    Session.set('lastUpdated', new Date().getTime());
  }
})