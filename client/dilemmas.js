Template.Dilemmas.created = function() {
  var self = this;

  self.limit = new ReactiveVar;
  self.limit.set(parseInt(Meteor.settings.public.recordsPerPage));
  self.loaded = new ReactiveVar(0);

  self.autorun(function() {
    var limit = self.limit.get();
    var subscription = self.subscribe('pairs', limit);
    self.subscribe('images', limit * 2);
    if (subscription.ready()){
      self.loaded.set(limit);
    }
  });

  self.pairs =  function() {
    return Pairs.find({}, { 
      sort: { createdAt: -1 },
      limit: self.loaded.get()
    });
  }
}

Template.Dilemmas.helpers({
  pairs: function () {
    return Template.instance().pairs();
  },
  // are there more pairs to show?
  hasMorePosts: function () {
    return Template.instance().pairs().count() >= Template.instance().limit.get();
  }
});

Template.Dilemmas.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += parseInt(Meteor.settings.public.recordsPerPage);
    instance.limit.set(limit);
  }

})
