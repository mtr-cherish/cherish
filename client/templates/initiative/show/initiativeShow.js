Template.initiativeShow.helpers({
  comments: function(){
    if(this && this.comments) {
      return this.comments.sort(function(a, b) {
        if(a && b && a.createdAt && b.createdAt) {
          return b.createdAt - a.createdAt;
        } else {
          return 1;
        }
      });
    }
  }
});

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

Template.initiativeCommenter.events({
  'submit .commenter-form': function (event, template) {
    event.preventDefault();

    // Grab input, and current user.
    var input = template.find('input[name="comment"]');
    Meteor.call("addComment", this._id, input.value, function(err, result) {
      if (err) {
        sAlert.error('You are only able to comment every 3 seconds');
        return;
      }
      input.value = "";
      sAlert.info('Thank you for your comment');
    });
  }
});