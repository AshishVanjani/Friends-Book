define(function (require){
	var Router = Backbone.Router.extend({
		routes: {
			"": "login",
			"login":"login",
			"home": "home",
			"friends": "friends",
			"allUsers": "allUsers",
			"wall": "wall",
			"profile": "profile"
		},

		login: function(){
			$('#allContent').undelegate();
			var AppView = require("views/login-view");
			new AppView();
		},

		home: function(){
			$('#allContent').undelegate();
			var AppView = require("views/home-view");
			new AppView();
		},

		friends: function(){
			$('#allContent').undelegate();
			var AppView = require("views/friends-view");
			new AppView();
		},

		allUsers: function(){
			$('#allContent').undelegate();
			var AppView = require("views/all-users-view");
			new AppView();
		},

		wall: function(){
			$('#allContent').undelegate();
			var AppView = require("views/wall-view");
			new AppView();
		},

		profile: function(){
			$('#allContent').undelegate();
			var AppView = require("views/profile-view");
			new AppView();
		}

	})

	var router = new Router();
	return router;

})