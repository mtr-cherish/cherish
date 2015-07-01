Template.initiativeCreate.onRendered(function() {
  $('select').material_select();
});

Template.initiativeCreate.helpers({
  overLimit: function(){
    var initiativeCount = Initiatives.find({
      createdBy: Meteor.userId(),
      active: {
        "$exists": true
      },
      active: true
    }).count();
    return initiativeCount >= Meteor.settings.public.initiativeLimit;
  }
})

Template.initiativeCreate.events({
  'submit .form-create': function (event, template) {
    event.preventDefault();

    var title = template.find('input[name=name]').value || undefined,
        summary = template.find('input[name=summary]').value || undefined,
        category = template.find('select').value || undefined;


    if(!title) {
      sAlert.error('You must enter a name for your Initiative.');
    }
    if(!summary) {
      sAlert.error('You must enter a summary for your Initiative.');
    }
    if(!category) {
      sAlert.error('You must select a category for your Initiative.');
    }

    if(!title || !summary || !category) {
      return;
    }

    Meteor.call('createInitiative', title, summary, category, function(err, response) {
      if (err) {
        sAlert.error(err.reason);
        return;
      }
      Router.go('initiative', {slug: response});
    });
  },

  'click input[type=checkbox]': function(event, template) {
    $('.checkboxes').find('input[type=checkbox]:checked').each(function() {
      if($(this).val() == event.target.value) {
        $(this).attr('checked', true);
      } else {
        $(this).attr('checked', false);
      }
    });
  }
});