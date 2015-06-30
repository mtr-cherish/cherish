Template.initiativeCard.helpers({
  showStatus: function(){
    return Router.current().route.path(this).match('/profile/');
  },
  status: function(){
    return this.active ? 'Active': 'Inactive';
  }
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
  },
  'click .status': function(e, tpl){
    Meteor.call('setInactiveActive', this, function(err, res) {
      if (!err) {
        return;
      }
      sAlert.error(err.message);
    });
  },
  'click .follow-button': function(e, tpl){
    e.preventDefault();
    followUnfollow(this);
  }
});