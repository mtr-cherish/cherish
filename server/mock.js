var cleaner = Package['xolvio:cleaner'];
var placeholderInitiativeHeaderImage;
var users;
var initiatives;

// delete all collections
cleaner.resetDatabase();

if (Meteor.settings.mode === 'dev') {
  placeholderInitiativeHeaderImage = '/images/placeholder-initiative.jpg';
  users = [];
  initiatives = [];

  _.mixin({
    capitalize: function capitalize(string) {
      if (string === undefined) {
        return false;
      }

      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  });

  Meteor.startup(function meteorStartup() {
    var getWord = function getWord() {
      var word = faker.lorem.words(1);

      return _(word[0]).capitalize();
    };

    if (Meteor.users.find().count() === 0) {
      console.log('======> Staging mock data...');
      _.each(_.range(25), function eachNumber(number) {
        var randomName = faker.name.findName();
        var userName = 'cherishuser' + number;
        var password = 'password';

        var userId = Accounts.createUser({
          username: userName,
          profile: {
            name: randomName
          },
          email: 'cherishuser' + number + '@cherish.com',
          password: password
        });

        var initiative = {
          title: getWord() + ' ' + faker.lorem.sentence(3),
          summary: getWord() + ' ' + faker.lorem.paragraph(),
          votes: faker.random.number(200),
          category: faker.random.array_element(InitiativeCategories),
          imageUrl: placeholderInitiativeHeaderImage,
          createdBy: userId,
          active: true
        };

        var initiativeId = Initiatives.insert(initiative);

        users.push(userId);

        // Add to initiative list
        initiatives.push(initiativeId);
      });

      _.each(initiatives, function eachInitiatives(initiative) {
        var commentsNumber = faker.random.number(10);

        _(commentsNumber).times(function times() {
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

          Users.update(user, {$addToSet: {commentedOn: initiative, votedOn: initiative}});
        });
      });
    }
  });
}