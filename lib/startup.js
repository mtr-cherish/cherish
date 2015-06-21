if(Meteor.settings && Object.keys(Meteor.settings).length === 0) {
  Meteor.settings.public = {
    initiativeLimit: 10
  };
}

if (Meteor.isServer) {
  Throttle.setScope('user');
  Throttle.setMethodsAllowed(false);
}