SyncedCron.add({
  name: 'Remove older notifications',
  schedule: function schedule(parser) {
    // parser is a later.parse object
    return parser.text('every 20 days');
  },
  job: function job() {
    // Remove notifications older than x days
    var d = new Date();
    var twentyDaysOld = d.setMinutes(d.getMinutes() - 20880);

    console.log('====> Removing older notifications');

    Notifications.remove({createdAt: {$lt: twentyDaysOld}, isRead: true}, function removeNotifications(error) {
      if (error) {
        console.log(error);
      }
    });
  }
});