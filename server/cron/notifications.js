SyncedCron.add({
  name: 'Remove older notifications',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 2 hours');
  },
  job: function() {
    // Remove notifications older than x days
    var d          = new Date(),
        oneWeekOld = d.setMinutes(d.getMinutes() - 10080),
        notifications = Meteor.users.find({"notifications.createdAt": { $lt: new Date().getTime() }}).fetch();

    _.each(notifications, function(value, key, list){
      console.log('value: ', value);
      console.log('key: ', key);
      // Meteor.users.update({"notifications.createdAt": { $lt: oneWeekOld } }, {"$pullAll": {
      //   "notifications.$.createdAt":  
      // }})
    })    
    

  }
});