// Add search
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title', 'category'];

Session.setDefault('searchTerm', '');

InitiativeSearch = new SearchSource('initiatives', fields, options);