if(Meteor.settings && Object.keys(Meteor.settings).length === 0) {
  throw new Meteor.Error(500, "No configuration was found. Please ensure a settings.json configuration is provided at startup.");
} else {
  if(Meteor.settings.mode === 'dev') {
    console.log("Running in development mode.")
  } else {
    console.log("Running in production mode.")
  }
}

if (Meteor.isServer) {
  Throttle.setScope('user');
  Throttle.setMethodsAllowed(false);
}