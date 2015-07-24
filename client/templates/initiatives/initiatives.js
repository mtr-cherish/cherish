var buildRegExp = function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);

  return new RegExp('(' + parts.join('|') + ')', 'ig');
};

Template.initiatives.helpers({
  initiatives: function initiatives() {
    var query = {active: true};
    var sort = {createdAt: -1, votes: -1, title: -1};
    var regExp = regExp = buildRegExp(Session.get('searchTerm') || '');

    if (Session.get('categories')) {
      query.categorySlug = {$in: Session.get('categories')};
    }

    if (Session.get('searchTerm')) {
      query.$or = [{
        title: regExp
      }, {
        category: regExp
      }];
    }

    return Initiatives.find(query, sort);
  },
  isLoading: function isLoading() {
    return InitiativeSearch.getStatus().loading;
  }
});

Template.initiatives.onRendered(function initiativesOnRendered() {
  $('body').addClass('home');
});

Template.initiatives.onDestroyed(function initiativesOnDestroyed() {
  $('body.home').removeClass('home');
});