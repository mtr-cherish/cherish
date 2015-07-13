var facebookConfig = Meteor.settings.facebook;

configureFacebook = function configureFacebook(config) {
  ServiceConfiguration.configurations.remove({
    service: 'facebook'
  });

  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: config.appId,
    secret: config.secret
  });
};

if (facebookConfig) {
  configureFacebook(facebookConfig);
}