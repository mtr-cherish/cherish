// Add search
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['title', 'category'];

InitiativeSearch = new SearchSource('initiatives', fields, options);