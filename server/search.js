/*
  https://github.com/meteorhacks/search-source
*/
SearchSource.defineSource('initiatives', function(searchText, options) {
  var options = {sort: {votes: -1}, limit: 20};
  
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {active: true, $or: [
      {title: regExp},
      {category: regExp}
    ]};
    
    return Initiatives.find(selector, options).fetch();
  } else {
    return Initiatives.find({active: true}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}