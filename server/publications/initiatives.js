Meteor.publish('initiatives', function publishInitiatives() {
  return Initiatives.find({active: true});
});

Meteor.publish('my.initiative', function publishMyInitiatives() {
  if (!this.userId) {
    return undefined;
  }
  return Initiatives.find({createdBy: this.userId}, {limit: 1});
});