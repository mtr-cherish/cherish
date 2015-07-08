Template.filter.helpers({
  categories: function categories() {
    return InitiativeCategorySlugs;
  }
});

Template.filter.events({
  'click input[type=checkbox]': function clickCheckbox(event, template) {
    var categories = template.$('input:checked').toArray().map(function checkedInputMap(item) {
      return $(item).val();
    });

    Session.set('categories', undefined);
    delete Session.keys.categories;

    if (categories.length > 0) {
      Session.set('categories', categories);
    }
  }
});