configureFacebook = function(config) {
  ServiceConfiguration.configurations.remove({
    service: 'facebook'
  });

  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: config.appId,
    secret: config.secret
  });
};

var facebookConfig = Meteor.settings.facebook;
if(facebookConfig) {
  console.log('Facebook settings received', facebookConfig);
  configureFacebook(facebookConfig);
}