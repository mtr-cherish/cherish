Template.initiativeEdit.helpers({
  getCategories: function(){
    return InitiativeCategories;
  },
  getSelected: function(category){
    return this.category == category ? 'selected' : '';
  }
});

Template.initiativeEdit.events({
  'submit form': function(e, tpl){
    e.preventDefault();

    var title = tpl.find('#title').value,
        description = tpl.find('#description').value,
        category = tpl.find('#category_select').value;

    if(title && description && category){
      var props = {
        title: title,
        description: description,
        category: category
      };

      Meteor.call('updateInitiative', this._id, props, function (err, result) {
        if(err){
          sAlert.error(err.message);
        } else {
          console.log(result);
          Session.set('editing', null);
        }
      });
    }
  },
  'click .edit-title, click .close': function(e, tpl){
    Session.set('editing', null);
  }
});