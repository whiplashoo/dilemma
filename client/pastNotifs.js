Template.PastNotifs.created = function() {
  var self = this;

  self.limit = new ReactiveVar;
  self.limit.set(30);
  self.loaded = new ReactiveVar(0);

  self.autorun(function() {
    var limit = self.limit.get();
    var subscription = self.subscribe('pastNotifs', limit);
    if (subscription.ready())
      self.loaded.set(limit);
  });

  self.notifications =  function() {
    return Notifs.find({read:true}, { 
      sort: { updatedAt: -1 },
      limit: self.loaded.get()
    });
  }
};

Template.PastNotifs.helpers({
  notifications: function () {
    return Template.instance().notifications();
  },
  // are there more notifs to show?
  hasMoreNotifs: function () {
    return Template.instance().notifications().count() >= Template.instance().limit.get();
  }
});

Template.PastNotifs.events({
  'click .js-load-more': function (event, instance) {
    event.preventDefault();
    event.stopPropagation();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 30 and update it
    limit += parseInt(30);
    instance.limit.set(limit);
  }
})