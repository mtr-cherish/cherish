// initiativeEditFull Helpers
Template.initiativeEditFull.helpers({
  getCategories: function(){
    return Initiatives.InitiativeCategories;
  },
  getSelected: function(category, compare){
    return category === compare ? 'selected' : '';
  }
});

// initiativeEditFull events
Template.initiativeEditFull.events({
  'submit form': function(e, tpl){
    e.preventDefault();
    updateInitiative(this, tpl);
  }
});

function updateInitiative(initiative, tpl){
  var title = tpl.find('#title').value,
      summary = tpl.find('#summary').value,
      category = tpl.find('#category');
  
  if(!category || category === "empty")
    category = initiative.category;


  var title = tpl.find('#title').value,
  summary = tpl.find('#summary').value,
  category = tpl.find('#category_select').value;


  if(title && summary && category){
    var props = {
      title: title,
      summary: summary,
      category: category
    };

    Meteor.call('updateInitiative', initiative, props, function (err, result) {
      if(err){
        sAlert.error(err.message);
      } else {
        Session.set('editing', null);
        sAlert.success("Initiaitve updated!");
        Router.go('initiative.mine');
      }
    });
  }
}