Template.initiativeCard.helpers({
  isMine: function(){
    return this.createdBy === Meteor.userId();
  },
  showStatus: function(){
    return Router.current().route.path(this).match('/profile/');
  },
  status: function(){
    return this.active ? 'Active': 'Inactive';
  },
  canFollow: function(){
    return !_.contains(this.usersFollowing, Meteor.userId());
  },
  getFollowClass: function(){
    return _.contains(this.usersFollowing, Meteor.userId()) ? 'unfollow' : 'follow';
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
    Meteor.call('setInactiveActive', this, function(err, res){
      if(err){
        sAlert.error(err.message);
      } else {
        sAlert.info('initiative updated');
      }
    });
  },
  'click .follow-button': function(e, tpl){
    e.preventDefault();
    followUnfollow(this);
  }
});