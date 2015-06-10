Template.initiativeCard.helpers({
  // canVote: function(){
  //   // return true if initiative Id is not in votedOn array
  //   var user = Meteor.users.findOne({_id: Meteor.userId()});
  //   if(_.contains(user.profile.votedOn, this._id)){
  //     return false;
  //   }
  //   return true;
  // }
});

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