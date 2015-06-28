Template.filter.helpers({
  categories: function(){
    return InititaiveCategorySlugs;
  }
});




Template.filter.events({
  "click input[type=checkbox]": function (event, tpl) {
    Session.set('categories', undefined)
    delete Session.keys.categories

    var categories = tpl.$('input:checked').map(function () {
      return $(this).val();
    });
    categories = $.makeArray(categories);

    if (categories.length > 0) {
      Session.set('categories', categories);
    }
  }
});