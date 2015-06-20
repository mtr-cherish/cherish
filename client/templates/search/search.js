Template.search.events({
  "click .close-button": function(e, tpl){
    Session.set('searchTerm', '');
    $("#search_initiatives").val('').blur();
  },

  "keyup #search_initiatives": _.throttle(function(e) {
      var text = $(e.target).val().trim();
      Session.set('searchTerm', text);
      InitiativeSearch.search(text);
    }, 200)
});

Template.search.helpers({
  isSearching: function(){
    return Session.get('searchTerm') == '' ? false : true;
  }
});