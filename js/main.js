require(["router"], function () {
	Backbone.history.start();
});

function HomeButtonClick()
	{
		$('#allContent').undelegate();
		require("router").navigate('home', { trigger: true });
		//location.hash="home";
	}

function LogoutButtonClick()
	{
		$('#allContent').undelegate();
		localStorage.removeItem("loggedUser");
		require("router").navigate('login', { trigger: true });
		//location.hash="friends";
	}