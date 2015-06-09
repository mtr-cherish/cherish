Meteor.startup(function () {  
  if (Meteor.isClient) {
    sAlert.config({
      effect: 'flip',
      position: 'bottom-right',
      timeout: 5000,
      html: false,
      onRouteClose: true,
      stack: true
    });
  }
});