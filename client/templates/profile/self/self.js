Template.profileSelf.helpers({
  votedInitiatives: function(){
    return Initiatives.find({
      usersVoted: Meteor.userId()
    });
  },
  commentedInitiatives: function(){
    return Initiatives.find({
      'comments.createdBy': Meteor.userId()
    });
  },
  editingPicture: function(){
    return Session.get('editingPicture');
  }
});

Template.profileSelf.events({
  'change .fileInput': function (event, template) {
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function(err, fileObj) {
        if(err) {
          // Handle Error
          console.log(err);
        } else{
          userId = Meteor.userId();
          imagesURL = {
          "profile.avatarImg": "cfs/files/images/" + fileObj._id
          };
        }
      });
    });
  },
  'click #upload': function () {
    Meteor.users.update(userId, {$set: imagesURL});
    Session.set('editingPicture', null);
  },
  'click #editPicture': function () {
    Session.set('editingPicture', true);
  }
});