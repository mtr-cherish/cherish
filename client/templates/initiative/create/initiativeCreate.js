Template.initiativeCreate.onRendered(function initiativeCreateOnRendered() {
  $('select').material_select();
});

Template.initiativeCreate.events({
  'submit .form-create': function submitCreateForm(event, template) {
    var title = template.find('input[name=name]').value || undefined;
    var summary = template.find('input[name=summary]').value || undefined;
    var category = template.find('select').value || undefined;

    event.preventDefault();

    if (!title) {
      sAlert.error('You must enter a name for your Initiative.');
    }
    if (!summary) {
      sAlert.error('You must enter a summary for your Initiative.');
    }
    if (!category) {
      sAlert.error('You must select a category for your Initiative.');
    }

    if (!title || !summary || !category) {
      return;
    }

    Meteor.call('createInitiative', title, summary, category, function createInitiativeCallback(error, response) {
      if (error) {
        sAlert.error(error.reason);
        return;
      }
      Router.go('initiative', {slug: response});
    });
  },

  'click input[type=checkbox]': function clickCheckbox(event) {
    $('.checkboxes').find('input[type=checkbox]:checked').each(function eachCheckbox() {
      if ($(this).val() === event.target.value) {
        $(this).attr('checked', true);
      } else {
        $(this).attr('checked', false);
      }
    });
  }
});

Template.initiativeCreate.onRendered(function initiativeCreateOnRendered() {
  var input = this.find('#name');

  if (!input) {
    return;
  }
  input.focus();
});

