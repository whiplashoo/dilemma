FlowRouter.triggers.enter([function(context,redirect){
	if (!Meteor.userId()){
		FlowRouter.go('home');
	}
}])

FlowRouter.route('/',{
	name: 'home',
	action() {
		if (Meteor.userId()){
			FlowRouter.go('dilemmas');
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

FlowRouter.route('/dilemmas',{
	name: 'dilemmas',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Dilemmas'});
	}
});

FlowRouter.route('/:username', {
	name: 'userPage', 
	action() {
		BlazeLayout.render('MainLayout', {main: 'Dilemmas'});
	}
});
