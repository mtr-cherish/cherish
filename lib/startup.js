if(Meteor.settings && Object.keys(Meteor.settings).length === 0) {
  Meteor.settings = {
    initiativeLimit: 10
  };
}