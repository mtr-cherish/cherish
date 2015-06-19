Template.nav.onRendered(function() {
  this.$('.button-collapse').sideNav({
    closeOnClick: true
  });
  Meteor.setTimeout(function () {
      this.$('.dropdown-button').dropdown();
  }, 100);
});


Template.nav.helpers({
  avatar: function(){
    return Meteor.user().profile.avatarImg;
  }
});

Template.nav.events({
  'click .logout': function(e, tpl){
    e.preventDefault();
    Meteor.logout(function(){
      sAlert.info('Logged out succesfully');
    });
  }
})