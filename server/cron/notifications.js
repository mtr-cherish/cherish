SyncedCron.add({
  name: 'Remove older notifications',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 20 days');
  },
  job: function() {
    // Remove notifications older than x days
    var d          = new Date(),
        twentyDaysOld  = d.setMinutes(d.getMinutes() - 20880);
        console.log('====> Removing older notifications');

        Notifications.remove({createdAt: { $lt: twentyDaysOld }, isRead: true}, function(error){
          if(error)
            console.log(error)
        });
    

  }
});