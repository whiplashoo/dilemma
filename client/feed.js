Template.Feed.created = function() {
  var self = this;

  self.limit = new ReactiveVar;
  self.limit.set(parseInt(Meteor.settings.public.recordsPerPage));
  self.loaded = new ReactiveVar(0);

  self.publicFeed = new ReactiveVar(true);

  self.autorun(function() {
    var limit = self.limit.get();
    var publicFeed = self.publicFeed.get();
    var subscription = self.subscribe('feedPairsAndImages', limit, publicFeed);
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

Template.Feed.rendered = function() {
  $('#public-feed').addClass('tab-active');

  
}

Template.Feed.helpers({
  pairs: function () {
    return Template.instance().pairs();
  },
  // are there more pairs to show?
  hasMorePosts: function () {
    return Template.instance().pairs().count() >= Template.instance().limit.get();
  }
});

Template.Feed.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += parseInt(Meteor.settings.public.recordsPerPage);
    instance.limit.set(limit);
  },
  'click #public-feed': function(e, instance){
   instance.publicFeed.set(true);
   instance.$('#following-feed').removeClass('tab-active');
   instance.$('#public-feed').addClass('tab-active');
 },
 'click #following-feed': function(e, instance){
   instance.publicFeed.set(false);
   instance.$('#public-feed').removeClass('tab-active');
   instance.$('#following-feed').addClass('tab-active');
 }

})
