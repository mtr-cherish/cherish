var buildRegExp = function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);

  return new RegExp('(' + parts.join('|') + ')', 'ig');
};

/*
  https://github.com/meteorhacks/search-source
*/
SearchSource.defineSource('initiatives', function searchSourceDefineSource(searchText) {
  var options = {sort: {votes: -1}, limit: 20};
  var regExp;
  var selector;

  if (!searchText) {
    return Initiatives.find({active: true}, options).fetch();
  }

  regExp = buildRegExp(searchText);
  selector = {active: true, $or: [
    {title: regExp},
    {category: regExp}
  ]};
  return Initiatives.find(selector, options).fetch();
});