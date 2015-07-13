if (Meteor.settings.mode === 'dev') {
  console.log('Running in development mode.');
} else {
  console.log('Running in production mode.');
}

Throttle.setScope('user');
Throttle.setMethodsAllowed(false);
SyncedCron.start();