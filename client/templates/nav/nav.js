Template.nav.onRendered(function() {
  this.$('.button-collapse').sideNav();
});

Template.nav.events({
	'click .logout': function(e, tpl){
		e.preventDefault();
		Meteor.logout(function(){
			sAlert.info('Logged out succesfully');
		});
	}
})