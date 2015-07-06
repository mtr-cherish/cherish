Meteor.users.allow({
  update: function update() {
    return true;
  }
});