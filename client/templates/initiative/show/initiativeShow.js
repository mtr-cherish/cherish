Template.initiativeShow.events({
  'click .votes': function(e, tpl){
    // TODO: restrict votes to 1 pr initiative
    var initiative = this;
    addOrRemoveVote(initiative);
  }
});

Template.initiativeShow.onRendered(function(){
    $('body').addClass('show-initiative');
});

Template.initiativeShow.onDestroyed(function(){
    $('body.show-initiative').removeClass('show-initiative');
});