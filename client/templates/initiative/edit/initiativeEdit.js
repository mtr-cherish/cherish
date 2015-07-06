Template.initiativeEditFull.onCreated(function onCreatedFunction(){
  Session.set('initiativeActive', Template.currentData().initiative.active);
});

Template.initiativeEditFull.onRendered(function onRenderedFunction(){
  this.$('textarea#summary').characterCounter();
});


// initiativeEditFull Helpers
Template.initiativeEditFull.helpers({
  getCategories: function(){
    return InitiativeCategories;
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
  },
  'click .switch label, click .switch input': function(){
    Session.set('initiativeActive', !Session.get('initiativeActive'));
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
  category = tpl.find('#category_select').value,
  active = Session.get('initiativeActive');


  if(title && summary && category){
    var props = {
      title: title,
      summary: summary,
      category: category,
      active: active
    };

    Meteor.call('updateInitiative', initiative, props, function (err, result) {
      if(err){
        sAlert.error(err.message);
      } else {
        sAlert.success("Initiaitve updated!");
        Router.go('initiative.mine');
      }
    });
  }
}