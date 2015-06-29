Template.nav.onRendered(function() {
  this.$('.button-collapse').sideNav({
    closeOnClick: true
  });
});

Template.nav.events({
  'click .logout': function(e){
    e.preventDefault();
    Meteor.logout(function(){
      sAlert.info('Logged out succesfully');
    });
  }
})

Template.userDropdown.onRendered(function() {
  this.$('.dropdown-button').dropdown({
    beloworigin: true
  });
});

Template.userDropdown.helpers({
  avatar: function(){
    return Meteor.user().profile.avatarImg;
  }
});


Template.sidenav.onRendered(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    this.$('.open-notifications').leanModal();
});

Template.sidenav.events({
  'click .open-notifications': function(){

  }
});