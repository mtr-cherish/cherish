Template.initiativeCard.helpers({});

Template.initiativeCard.events({
  'click .votes': function(e, tpl){
    // TODO: restrict votes to 1 pr initiative
    var initiative = this;
    addOrRemoveVote(initiative); 

  },
  'dblclick .touch .card-image a': function(e, tpl){
    console.log('double click initiative');
    e.preventDefault();
    var initiative = this;
    addOrRemoveVote(initiative); 
  }
});