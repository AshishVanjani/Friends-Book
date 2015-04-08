define(function (require) {

	var userCollection = require("collections/user-collection");
	var jsonData;
    var xtraFriends = JSON.parse(localStorage.getItem("xtraFriends")) || [];

	return Backbone.View.extend({
		el: "body",

		friendsViewTemplate: Handlebars.compile(require("text!templates/friends-view.html")),

		events: {
			"click #listOfFriends": "openWall"
		},

		openWall: function(clickedUser){
			console.log("inside friendsview openwall");

			if(clickedUser.target.tagName.toLowerCase()=== "div")
			{
				// temp has id of user whose wall/profile will now be opened in profile view.
				localStorage.setItem("temp", clickedUser.target.id);
				$(this.el).undelegate();
				require("router").navigate('profile', { trigger: true });
				//location.hash="profile";
			}
		},


		initialize: function (opts) {
			console.log("inside friendsview initialize");

			//if no user is logged in, navigate to login view.
			if(_.isNaN(parseInt(localStorage.getItem("loggedUser"))))
			{
				alert("Login first!");
				$(this.el).undelegate();
				require("router").navigate('login', { trigger: true });
				return;
			}

			var self=this;
			var collection = new userCollection();

			collection.fetch({

				reset: true,

				success: function(data){
					console.log("inside friendsview initialise collection.fetch success");
					jsonData=data.toJSON()[0];
					self.render();
				}
			});
		},

		render: function(){
			console.log("inside friendsview render");

            xtraFriends =  JSON.parse(localStorage.getItem("xtraFriends")) || xtraFriends ;
			userId = parseInt(localStorage.getItem("loggedUser"));
			var idOfAllFriends=jsonData.users[userId].friends;
            var friends=[];

			// Push all friends created by accepting friend requests, which were stored in localstorage key xtraFriends.
            for(var i = 0; i < xtraFriends.length; i++)
            {
	            // If not already friends
                if(idOfAllFriends.indexOf(xtraFriends[i].user) === -1)
                {
	                // If friend is not the current user himself
                    if(userId !== xtraFriends[i].addedFriend)
                    {
	                    // If the user whose friend we are checking is current user
	                    if(userId == xtraFriends[i].user)
	                        idOfAllFriends.push(xtraFriends[i].addedFriend);
                    }
                }

	            // if not already friends
                if(idOfAllFriends.indexOf(xtraFriends[i].addedFriend) === -1)
                {
	                // If friend is not the current user himself
                    if(userId != xtraFriends[i].user)
                    {
	                    // If the user whose friend we are checking is current user
	                    if(userId == xtraFriends[i].addedFriend)
	                        idOfAllFriends.push(xtraFriends[i].user);
                    }
                }
            }

			for(var i=0; i<idOfAllFriends.length; i++)
			{
				friends.push({name: jsonData.users[idOfAllFriends[i]].name,
						id: jsonData.users[idOfAllFriends[i]].id
				});
			}

			this.$('#pageContent').html(this.friendsViewTemplate({
				userName:jsonData.users[userId].name,
				friends: friends
			}));
		}
	})
})
