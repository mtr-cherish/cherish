if(Meteor.settings.mode === 'dev') {
  console.log("======> Staging mock data...");

  Meteor.startup(function() {
    var users;

    if(Meteor.users.find().count() === 0) {
      console.log('Add test users');
      var userId = Accounts.createUser({
        username: 'cherishuser',
        password: 'password',
        email: 'admin@cherish.com',
        profile: {
          name: 'Test User',
          avatarImg: "https://placeimg.com/100/100/people"
        },
        votedOn: [],
        commentedOn: []
      });

      var userId2 = Accounts.createUser({
        username: 'cherishuser2',
        password: 'password',
        email: 'admin2@cherish.com',
        profile: {
          name: 'Test User 2',
          avatarImg: "https://placeimg.com/100/100/people"
        },
        votedOn: [],
        commentedOn: []
      });
      console.log(userId);
      users = [userId, userId2];
    }

    

    

    if(Initiatives.find().count() === 0) {
      console.log("Inserting Initiatives");
      
      var mockData = [
        {
          title: 'Project water', 
          description: 'Some arbitrary description goes here.', 
          votes: 20, 
          createdBy: userId, 
          category: 'Charity',
          imageUrl: "https://placeimg.com/300/250/arch",
          active: true,
        },
        {title: 'Digging in dirt', description: 'Some arbitrary description goes here.', votes: 5, createdBy: userId, category: 'Event', imageUrl: "https://placeimg.com/300/250/arch", active: true},
        {
          title: 'Free the pigs', 
          description: 'Some arbitrary description goes here.', 
          votes: 100, 
          createdBy: userId2,
          category: 'Event',
          imageUrl: "https://placeimg.com/300/250/arch",
          active: true,
          comments: []
        },
        {title: 'Vegan community', description: 'Some arbitrary description goes here.', votes: 10, createdBy: userId2, category: 'Non Profit', imageUrl: "https://placeimg.com/300/250/arch", active: true},
        {title: 'Spiritual commerce', description: 'Some arbitrary description goes here.', votes: 150, createdBy: userId, category: 'Open Source',imageUrl: "https://placeimg.com/300/250/arch", active: true},
        {title: 'Earth Documentary', description: 'Some arbitrary description goes here.', votes: 20, createdBy: userId, category: 'Charity', imageUrl: "https://placeimg.com/300/250/arch", active: true},
        {
          title: 'Feature film', 
          description: 'Some arbitrary description goes here.', 
          votes: 5, 
          createdBy: userId,
          category: 'Event',
          imageUrl: "https://placeimg.com/300/250/arch",
          active: true,
          comments: []
        },
        {title: 'We\'re going to Japan', description: 'Some arbitrary description goes here.', votes: 100, createdBy: userId, category: 'Charity', imageUrl: "https://placeimg.com/300/250/arch", active: true},
        {title: 'Initiative 9', description: 'Some arbitrary description goes here.', votes: 10, createdBy: userId2, category: 'Event', imageUrl: "https://placeimg.com/300/250/arch", active: true},
        {
          title: 'Feeding Nicaragua', 
          description: 'Some arbitrary description goes here.', 
          votes: 1, 
          createdBy: userId2,
          category: 'Charity',
          imageUrl: "https://placeimg.com/300/250/arch",
          active: true,
          comments: []
        }
      ];

      mockData.forEach(function(item) {
        console.log("Inserting " + item.title);
        var initiative = Initiatives.insert(item);
        var count = _.random(0, 10);
        
        

        for(var i = 0; i <= count; i++){
          console.log('Adding comment');
          var user = _.random(0, users.length-1);
          Initiatives.update(initiative, {$addToSet: {comments: {
              message: "This is a comment.",
              createdBy: users[user],
              createdAt: new Date().getTime()
            }}});
          var UpdateInitiative = Initiatives.findOne({_id: initiative});
          if(UpdateInitiative.createdBy !== users[user]){
            Initiatives.update(UpdateInitiative._id, {$inc: {votes: 1}, $addToSet: {usersVoted: users[user]}});
            // Remove once votes only stored on Initiative
            Meteor.users.update(users[user], {$addToSet: {votedOn: UpdateInitiative._id}});
          }
        }

     });
      console.log("======> Mock data staged.");
    }
  });
}