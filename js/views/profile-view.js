define(function (require) {
	window.xtraWallPosts = JSON.parse(localStorage.getItem("xtraWallPosts")) || [];
	var userId;
	var userCollection = require("collections/user-collection");
	var jsonData;
	var xtraFriends = JSON.parse(localStorage.getItem("xtraFriends")) || [];

	return Backbone.View.extend({
		el: "body",

		profileViewTemplate: Handlebars.compile(require("text!templates/profile-view.html")),

		events: {
			"click #postButton": "postIt"
		},

		// Add a wall post.
		postIt: function(){
			console.log("inside profileView postIt fn");

			window.xtraWallPosts.push({
				"postedBy":jsonData.users[parseInt(localStorage.getItem("loggedUser"))].name,
				"post": document.getElementById("textToPost").value,
				"date": (new Date()).toDateString(),
				"postedOn": userId
			});

			var forLocalStorage = JSON.stringify(window.xtraWallPosts);
			localStorage.removeItem("xtraWallPosts");
			localStorage.setItem("xtraWallPosts",forLocalStorage);
			localStorage.setItem("temp", userId);
			this.initialize();
		},

		initialize: function (opts) {
			console.log("inside profileView initialize fn");
			var self=this;
			var collection = new userCollection();

			collection.fetch({
				reset: true,

				success: function(data){
					console.log("inside profileView initialise collection.fetch success fn");
					jsonData=data.toJSON()[0];
					self.render();
				}
			});
		},

		render: function(){
			console.log("inside profileView render fn");

			// localstorage("temp") is supposed to have userid of user whose profile we render here, which was set in friends view or allusers view.
			if(isNaN(parseInt(localStorage.getItem("temp"))))
			{
				userId=null;
				alert("Cannot access this page directly.");
				$(this.el).undelegate();
				require("router").navigate('allUsers', { trigger: true });
				//location.hash = "allUsers";
			}
			else
			{
				xtraFriends =  JSON.parse(localStorage.getItem("xtraFriends")) || xtraFriends ;
				userId = parseInt(localStorage.getItem("temp"));
				var loggedUserId=parseInt(localStorage.getItem("loggedUser"));
				localStorage.removeItem("temp");
				var idOfAllFriends=jsonData.users[userId].friends;
				var wallPosts=jsonData.users[userId].wall || [];

				for(var i=0; i<window.xtraWallPosts.length; i++)
				{
					if(userId === window.xtraWallPosts[i].postedOn &&  window.xtraWallPosts[i].post !== "")
					{
						wallPosts.push(window.xtraWallPosts[i]);
					}
				}

				for(var i = 0; i < xtraFriends.length; i++)
				{
					if(idOfAllFriends.indexOf(xtraFriends[i].user) === -1)
					{
						if(userId != xtraFriends[i].addedFriend)
						{
							if(userId == xtraFriends[i].user)
								idOfAllFriends.push(xtraFriends[i].addedFriend);
						}
					}

					if(idOfAllFriends.indexOf(xtraFriends[i].addedFriend) === -1)
					{
						if(userId != xtraFriends[i].user)
						{
							if(userId == xtraFriends[i].addedFriend)
								idOfAllFriends.push(xtraFriends[i].user);
						}
					}
				}

				this.$('#pageContent').html(this.profileViewTemplate({
					userName: jsonData.users[loggedUserId].name,
					user: jsonData.users[userId].name,
					wallPosts: wallPosts,
					age: jsonData.users[userId].age,
					city: jsonData.users[userId].city
				}));

				// If friends, show post on wall option
				if(idOfAllFriends.indexOf(loggedUserId)!== -1)
				{
					document.getElementById("postOnWall").classList.remove("invisible");
				}
				else
				{
					document.getElementById("postOnWall").classList.add("invisible");
				}
			}
		}
	})
})
