Template.initiativeCreate.onRendered(function() {
  $('select').material_select();
});

Template.initiativeCreate.events({
  'submit .form-create': function (event, template) {
    event.preventDefault();

    var title = template.find('input[name=name]').value || undefined;
    var description = template.find('input[name=description]').value || undefined;
    var category;
    $('input[type=checkbox]:checked').each(function() {
      category = $(this).val() || undefined;
    });

    if(!title) {
      sAlert.error('You must enter a name for your Initiative.');
    }
    if(!description) {
      sAlert.error('You must enter a description for your Initiative.');
    }
    if(!category) {
      sAlert.error('You must select a category for your Initiative.');
    }

    if(!title || !description || !category) {
      return;
    }

    Session.set('initiativeCreated', true);
    Router.go('initiatives');
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