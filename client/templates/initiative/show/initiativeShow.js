Template.initiativeShow.events({
  'click .votes': function(e, tpl){
    // TODO: restrict votes to 1 pr initiative
    var initiative = this;
    addOrRemoveVote(initiative);
  }
});