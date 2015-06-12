Template.initiatives.helpers({
  initiatives: function () {
    if (Session.get("categories")) {
      return Initiatives.find({catSlug: {$in: Session.get('categories')}}, {sort: {votes: -1}})
    }
    else {
      return Initiatives.find({}, {sort: {votes: -1}})
    }
	}
});