Template.search.helpers({
  categories: function(){
    return _.uniq(Initiatives.find().map(function (initative) { return s.slugify(initative.category); }));
  }
});
// Session.setDefault("categories", [])

Template.search.events({
	"click input[type=checkbox]": function (event, tpl) {

		Session.set('categories', undefined)
		delete Session.keys.categories

		var categories = tpl.$('input:checked').map(function () {
        return $(this).val();
      });
		categories = $.makeArray(categories);
		console.log(categories);
	
		if (categories.length > 0) {
	    Session.set('categories', categories);
	 	}

	}
});