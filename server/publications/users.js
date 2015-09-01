Meteor.publish('userData', function publishUserData() {
  if (!this.userId) {
    this.ready();
    return undefined;
  }
  return Users.find({_id: this.userId}, {fields: {votedOn: 1, avatarImg: 1, commentedOn: 1, followsUser: 1, followedByUser: 1}});
});