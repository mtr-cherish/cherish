Template.initiativesUpdate.helpers({
  newInitiatives: function newInitiatives() {
    return Initiatives.find({
      createdAt: {$gt: Session.get('lastUpdated')},
      active: true
    }).count();
  }
});

Template.initiativesUpdate.events({
  'click .update': function clickUpdate() {
    Session.set('lastUpdated', new Date().getTime());
  }
});