Template.initiatives.helpers({
  initiatives: function(){
    var cursor = {};
    if (Session.get('categories') && !Session.get('searchTerm')) {
      cursor = _.extend(Initiatives.find({categorySlug: {$in: Session.get('categories')}}, {sort: {votes: -1}}), cursor);
    }
    else if(Session.get('searchTerm')) {
      cursor = _.extend(InitiativeSearch.getData({categorySlug: {$in: Session.get('categories')}}, {
        sort: {votes: -1}
      }), cursor);
    } else {
      cursor = _.extend(Initiatives.find({}, {sort: {votes: -1, title: -1}}), cursor);
    }
    return cursor;
  },
  isLoading: function() {
    return InitiativeSearch.getStatus().loading;
  },
});


Template.initiatives.onRendered(function(){
  $('body').addClass('home');
  InitiativeSearch.search('');
});

Template.initiatives.onDestroyed(function(){
  $('body.home').removeClass('home');
});