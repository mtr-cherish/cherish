Template.search.categories = function () {
    return _.uniq(Initiatives.find().map(function (initative) { return s.slugify(initative.category); }));
};

Template.search.events({
	"click input[type=checkbox]": function (event, tpl) {
		var categories = tpl.$('input:checked').map(function () {
        return $(this).val();
      });
    Session.set('categories', $.makeArray(categories));
	}
});
