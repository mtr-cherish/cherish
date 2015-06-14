Template.search.events({
  "click .close-button": function(e, tpl){
    Session.set('searchTerm', null);
    $("#search_initiatives").val('').blur().focus();
  },
  "keyup #search_initiatives": _.throttle(function(e) {
      var text = $(e.target).val().trim();
      Session.set('searchTerm', text);
      InitiativeSearch.search(text);
    }, 200)
});

Template.search.helpers({
  isSearching: function(){
    return Session.get('searchTerm') == null ? false : true;
  }
});