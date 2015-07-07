var updateInitiative = function updateInitiative(initiative, tpl) {
  var title = tpl.find('#title').value;
  var summary = tpl.find('#summary').value;
  var category = tpl.find('#category_select').value || initiative.category;
  var active = Session.get('initiativeActive');
  var props = {
    title: title,
    summary: summary,
    category: category,
    active: active
  };
  
  if (!title && !summary && !category) {
    return;
  }

  Meteor.call('updateInitiative', initiative, props, function updateInitiativeCallback(err) {
    if (err) {
      sAlert.error(err.message);
      return;
    }
    sAlert.success('Initiaitve updated!');
    Router.go('initiative.mine');
  });
}

Template.initiativeEditFull.onCreated(function initiativeEditFullonCreated() {
  Session.set('initiativeActive', Template.currentData().initiative.active);
});

Template.initiativeEditFull.onRendered(function initiativeEditFullonRendered() {
  this.$('textarea#summary').characterCounter();
  this.$('select#category_select').material_select();
});

// initiativeEditFull Helpers
Template.initiativeEditFull.helpers({
  getCategories: function getCategories() {
    return InitiativeCategories;
  },
  getSelected: function getSelected(category, compare) {
    return category === compare ? 'selected' : '';
  }
});

// initiativeEditFull events
Template.initiativeEditFull.events({
  'submit form': function submitEditForm(ev, tpl) {
    ev.preventDefault();
    updateInitiative(this, tpl);
  },
  'click .switch label, click .switch input': function clickActiveInactive() {
    Session.set('initiativeActive', !Session.get('initiativeActive'));
  }
});