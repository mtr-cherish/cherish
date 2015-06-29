
// initiativeEdit Helpers
Template.initiativeEdit.helpers({
  getCategories: function(){
    return Initiatives.InitiativeCategories;
  },
  getSelected: function(category){
    return this.category == category ? 'selected' : '';
  }
});

// initiativeEdit Events
Template.initiativeEdit.events({
  'submit form': function(e, tpl){
    e.preventDefault();
    updateInitiative(this, tpl);
  },
  'click .edit-title, click .close, click .save': function(e, tpl){
    Session.set('editing', null);
  }
});

// initiativeEdit onRendered
Template.initiativeEdit.onRendered(function(){
  $(window).on('resize', function(){
    Session.set('editing', null);
  })
});

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
  description = tpl.find('#description').value,
  category = tpl.find('#category');
  if(!category)
    category = initiative.category;


  var title = tpl.find('#title').value,
  description = tpl.find('#description').value,
  category = tpl.find('#category_select').value;


  if(title && description && category){
    var props = {
      title: title,
      description: description,
      category: category
    };

    Meteor.call('updateInitiative', initiative, props, function (err, result) {
      if(err){
        sAlert.error(err.message);
      } else {
        Session.set('editing', null);
      }
    });
  }
}