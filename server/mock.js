if(Meteor.settings.mode === 'dev') {
  console.log("======> Staging mock data...");
  var placeholderInitiativeHeaderImage = '/images/placeholder-initiative.jpg';
  var placeholderAvatarImage = "/images/placeholder-avatar.jpg";
  var users = [];
  var initiatives = [];


  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  });




  Meteor.startup(function() {

    var getWord = function(){
      var word = faker.lorem.words(1);
      return _(word[0]).capitalize();
    };

    if(Meteor.users.find().count() === 0) {
      _.each(_.range(25), function(number){

        var randomEmail = faker.internet.email(),
        randomName = faker.name.findName(),
        userName = 'cherishuser'+ number,
        password = 'password';


        var userId = Accounts.createUser({
          username: userName,
          profile: {
            name: randomName,
          },
          email: 'cherishuser'+number +'@cherish.com',
          password: password
        });

        users.push(userId);

        var initiative = {
          title: getWord() + ' ' + faker.lorem.sentence(5),
          summary:  getWord() + ' ' + faker.lorem.paragraph(),
          votes: faker.random.number(200),
          category: faker.random.array_element(InitiativeCategories),
          imageUrl: placeholderInitiativeHeaderImage,
          createdBy: userId,
          active: true
        }

        var initiativeId = Initiatives.insert(initiative);

        // Add to initiative list
        initiatives.push(initiativeId);

      });


  _.each(initiatives, function(initiative){
    commentsNumber = faker.random.number(10);
    _(commentsNumber).times(function(){
      var user = faker.random.array_element(users);
      Initiatives.direct.update(initiative, {
        $addToSet: {
          usersVoted: user,
          comments: {
            message: getWord() + ' ' + faker.lorem.sentences(1),
            createdBy: user,
            createdAt: new Date().getTime()
          }
        }
      });

      Users.update(user, { $addToSet: { commentedOn: initiative, votedOn: initiative } });
    });
  });
}
});
}