Template.initiatives.helpers({
  hasUpdates: function(){
    return Initiatives.find({createdAt: {$gt: Session.get('lastUpdated')}}).count() > 0;
  },
  newInitiatives: function(){
    return Initiatives.find({createdAt: {$gt: Session.get('lastUpdated')}}).count();
  },
  initiatives: function(){
    var cursor = {};
    if(Session.get('searchTerm')) {
      cursor = _.extend(InitiativeSearch.getData({}, {
        sort: {votes: -1}
      }), cursor);
    }
    if (Session.get('categories')) {
      cursor = _.extend(Initiatives.find({categorySlug: {$in: Session.get('categories')}}, {sort: {votes: -1}}), cursor);
    } else if(!Session.get('categories') || !Session.get('searchTerm')) {
      cursor = _.extend(Initiatives.find({createdAt: {$lt: Session.get('lastUpdated')}}, {sort: {createdAt: -1, votes: -1, title: -1}}), cursor);
    }
    return cursor;
  },
  isLoading: function() {
    return InitiativeSearch.getStatus().loading;
  },
});

Template.initiatives.events({
  'click .update': function(){
    Session.set('lastUpdated', new Date().getTime());
  }
})


Template.initiatives.onRendered(function(){
  $('body').addClass('home');
  InitiativeSearch.search('');
});

Template.initiatives.onDestroyed(function(){
  $('body.home').removeClass('home');
});