Template.initiativeShow.helpers({
  creator: function creator() {
    return Users.findOne({_id: this.createdBy}).profile.name;
  }
});

Template.initiativeShow.events({
  'click .votes': function clickVotes() {
    // TODO: restrict votes to 1 pr initiative
    addOrRemoveVote(this);
  }
});

Template.initiativeShow.onRendered(function initiativeShowOnRendered() {
  $('body').addClass('show-initiative');
});

Template.initiativeShow.onDestroyed(function initiativeShowOnDestroyed() {
  $('body.show-initiative').removeClass('show-initiative');
});

Template.initiativeCommenter.events({
  'submit .commenter-form': function submitCommentorForm(event, template) {
    var input = template.find('input[name="comment"]');

    event.preventDefault();
    Meteor.call('addComment', this._id, input.value, function addCommentCallback(err) {
      if (err) {
        sAlert.error(err.message);
        return;
      }
      input.value = '';
    });
  }
});

Template.initiativeComments.helpers({
  getCommentAuthorName: function getCommentAuthorName() {
    var user = Users.findOne(this.createdBy);

    if (!user) {
      return 'Not Available';
    }
    return user.profile.name;
  },
  getCommentAuthorImage: function getCommentAuthorImage() {
    var user = Users.findOne(this.createdBy);

    if (!user) {
      return '/images/placeholder-avatar.jpg';
    }
    return user.profile.avatarImg;
  },
  comments: function comments() {
    if (!this && !this.comments) {
      return [];
    }
    return this.comments.sort(function commentSort(a, b) {
      if (a && b && a.createdAt && b.createdAt) {
        return b.createdAt - a.createdAt;
      }
      return 1;
    });
  }
});