FlowRouter.triggers.enter([function(context,redirect){
	if (!Meteor.userId()){
		FlowRouter.go('home');
	}
}])

FlowRouter.route('/',{
	name: 'home',
	action() {
		if (Meteor.userId()){
			FlowRouter.go('profile');
		}
		BlazeLayout.render('HomeLayout');
	}
});

FlowRouter.route('/feed',{
	name: 'feed',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Feed'});
	}
});

FlowRouter.route('/profile',{
	name: 'profile',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Profile'});
	}
});

FlowRouter.route('/notifications',{
	name: 'pastNotifs',
	action() {
		BlazeLayout.render('MainLayout', {main: 'PastNotifs'});
	}
});

FlowRouter.route('/:username', {
	name: 'userPage', 
	action() {
		BlazeLayout.render('MainLayout', {main: 'Profile'});
	}
});

FlowRouter.route('/dilemmas/:pairId', {
	name: 'singleDilemma', 
	action() {
		BlazeLayout.render('MainLayout', {main: 'Single'});
	}
});
