Template.initiativeShow.helpers({
  creator: function() {
    return Users.findOne({_id: this.createdBy}).profile.name;
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
    window.scrollTo(0,0);
});

Template.initiativeShow.onDestroyed(function(){
    $('body.show-initiative').removeClass('show-initiative');
});

Template.initiativeCommenter.events({
  'submit .commenter-form': function (event, template) {
    event.preventDefault();

    // Grab input, and current user.
    var input = template.find('input[name="comment"]');
    Meteor.call('addComment', this._id, input.value, function(err) {
      if (err) {
        sAlert.error(err.message);
        return;
      }
      input.value = '';
    });
  }
});

Template.initiativeComments.helpers({
  getCommentAuthorName: function() {
    var user = Users.findOne(this.createdBy);
    if(user) {
      return user.profile.name;
    } else {
      return 'Not Available';
    }
  },

  getCommentAuthorImage: function() {
    var user = Users.findOne(this.createdBy);
    if(user) {
      return user.profile.avatarImg;
    } else {
      return '/images/placeholder-avatar.jpg';
    }
  },

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
})