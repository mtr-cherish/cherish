if(Meteor.settings.mode === 'dev') {
  console.log("Staging mock data...");

  Meteor.startup(function() {
    if(Meteor.users.find().count() === 0) {
      console.log('Add first test user');
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
    }

    if(Initiatives.find().count() === 0) {
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
        {title: 'Digging in dirt', description: 'Some arbitrary description goes here.', votes: 5, createdBy: userId, category: 'Event', imageUrl: "https://placeimg.com/300/250/arch"},
        {
          title: 'Free the pigs', 
          description: 'Some arbitrary description goes here.', 
          votes: 100, 
          createdBy: userId,
          category: 'Event',
          imageUrl: "https://placeimg.com/300/250/arch",
          active: true,
          comments: [
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            }
          ]
        },
        {title: 'Vegan community', description: 'Some arbitrary description goes here.', votes: 10, createdBy: userId, category: 'Non Profit', imageUrl: "https://placeimg.com/300/250/arch"},
        {title: 'Spiritual commerce', description: 'Some arbitrary description goes here.', votes: 150, createdBy: userId, category: 'Open Source',imageUrl: "https://placeimg.com/300/250/arch"},
        {title: 'Earth Documentary', description: 'Some arbitrary description goes here.', votes: 20, createdBy: userId, category: 'Charity', imageUrl: "https://placeimg.com/300/250/arch"},
        {
          title: 'Feature film', 
          description: 'Some arbitrary description goes here.', 
          votes: 5, 
          createdBy: userId,
          category: 'Event',
          imageUrl: "https://placeimg.com/300/250/arch",
          active: true,
          comments: [
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            }
          ]
        },
        {title: 'We\'re going to Japan', description: 'Some arbitrary description goes here.', votes: 100, createdBy: userId, category: 'Charity', imageUrl: "https://placeimg.com/300/250/arch"},
        {title: 'Initiative 9', description: 'Some arbitrary description goes here.', votes: 10, createdBy: userId, category: 'Event', imageUrl: "https://placeimg.com/300/250/arch"},
        {
          title: 'Feeding Nicaragua', 
          description: 'Some arbitrary description goes here.', 
          votes: 1, 
          createdBy: userId,
          category: 'Charity',
          imageUrl: "https://placeimg.com/300/250/arch",
          active: true,
          comments: [
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            },
            {
              message: "This is a comment.",
              createdBy: userId,
              createdAt: new Date()
            }
          ]
        }
      ];

      mockData.forEach(function(item) {
        console.log("Inserting " + item.title);
        Initiatives.insert(item);
     });
    }
  });

  Initiatives.before.insert(function(userId, doc){
      doc.createdAt = new Date().getTime();
  })

  Meteor.publish("userData", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId}, {fields: {'votedOn': 1, 'avatarImg': 1, 'commentedOn': 1}});
    } else {
      this.ready();
    }
  });

  console.log("Mock data staged.");
}