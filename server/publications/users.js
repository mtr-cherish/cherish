Meteor.publish("userData", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId}, {fields: {'votedOn': 1, 'avatarImg': 1, 'commentedOn': 1, 'notifications': 1}});
    } else {
      this.ready();
    }
  });