// see notificationsHelpers for helpers

Template.profileNotifications.onRendered(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    this.$('.open-notifications').leanModal();
});

Template.profileNotifications.events({
  'click .unread': function(e) {
    e.preventDefault();

    var initiative = Initiatives.findOne({_id: this.initiativeId});
    // Router.go('initiative', {slug: initiative.slug});
    Meteor.call('markNotificationsAsRead', this.ids, function(err, response) {
      if(err){
        sAlert.error('Something went wrong...');
      }
    });
  },
  'click .title a': function(e){
      $('#notifications_modal').closeModal();
  }
});