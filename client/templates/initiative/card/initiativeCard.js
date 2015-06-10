Template.initiativeCard.events({
  'click .votes': function(e, tpl){
    // TODO: restrict votes to 1 pr initiative
    if(Meteor.userId()){
      Initiatives.update(this._id, {$inc: {votes: 1}});
      sAlert.info('Thanks for voting on: '+ this.title);
    } else {
      sAlert.error('Can only vote as logged in user');
    }    
  }
});