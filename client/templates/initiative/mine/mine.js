Template.initiativeMine.onRendered(function initiativeMineOnRendered() {
  this.$('ul.tabs').tabs();
  $('body').addClass('my-initiative');
});


Template.initiativeHeader.onDestroyed(function(){
  $('body.my-initiative').removeClass('my-initiative');
});