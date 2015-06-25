SyncedCron.add({
  name: 'Remove older notifications',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 2 hours');
  },
  job: function() {
    // Remove notifications older than x days
    var d          = new Date(),
    twentyDaysOld  = d.setMinutes(d.getMinutes() - 1);
    console.log('====> Removing older notifications');

    Notifications.remove({createdAt: { $lt: twentyDaysOld }, isRead: false}, function(error){
      if(error)
        console.log(error)
    });
  }
});