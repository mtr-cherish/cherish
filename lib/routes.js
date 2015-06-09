Router.configure({
  layoutTemplate: '_layout'
});

Router.map(function() {
  this.route('initiatives', {
    path: '/',
    data: {
      initiatives: function() {
        return Initiatives.find();
      }
    }
  });
});