Template.initiatives.helpers({
  initiatives: function(){
    if (Session.get('categories')) {
      return Initiatives.find({categorySlug: {$in: Session.get('categories')}}, {sort: {votes: -1}});
    }
    else if(Session.get('searchTerm')) {
      return InitiativeSearch.getData({}, {
        sort: {votes: -1}
      });
    } else {
      return Initiatives.find({}, {sort: {votes: -1, title: -1}});
    }
  },
  isLoading: function() {
    return InitiativeSearch.getStatus().loading;
  },
})

Template.initiatives.onRendered(function(){
  $('body').addClass('home');
  InitiativeSearch.search('');
});

Template.initiatives.onDestroyed(function(){
  $('body.home').removeClass('home');
});