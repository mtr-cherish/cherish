Template.search.events({
  'click .close-button': function clickCloseButton() {
    Session.set('searchTerm', '');
    $('#search_initiatives').val('').blur();
  },

  'keyup #search_initiatives': _.throttle(function keyupSearchInitiative(e) {
      var text = $(e.target).val().trim();

      Session.set('searchTerm', text);
      InitiativeSearch.search(text);
    }, 200)
});

Template.search.helpers({
  isSearching: function isSearching() {
    return Session.get('searchTerm') !== '';
  }
});