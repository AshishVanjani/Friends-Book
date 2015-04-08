define(function (require) {

	var userCollection = require("collections/user-collection");
	var jsonData;
    var friendRequests = [];
	friendRequests = JSON.parse(localStorage.getItem("friendRequests")) || [];
	var xtraFriends =  JSON.parse(localStorage.getItem("xtraFriends")) || [] ;

	return Backbone.View.extend({
		el: "body",

		allUsersViewTemplate: Handlebars.compile(require("text!templates/all-users-view.html")),

		events: {
			"click #listOfUsers": "openWall"
		},

		openWall: function(clickedUser){
            console.log("inside alluserView openwall fn");

			if(clickedUser.target.tagName.toLowerCase()=== "div")
			{
                console.log("inside alluserView openwall if div clicked fn");

				// We store id of user whose wall/profile will be rendered in profile view.
				localStorage.setItem("temp", clickedUser.target.id);
				$(this.el).undelegate();
				require("router").navigate('profile', { trigger: true });
				//location.hash="profile";
				console.log("inside alluserview openwall");
			}

			//if user clicks on AddFriend button
			else if(clickedUser.target.tagName.toLowerCase()=== "button")
			{
                console.log("inside alluserView openwall if btn clicked fn");

				// Last charecter of id of all buttons is userid of corresponding user to whom we send friend request.
				var addedFriend = clickedUser.target.id[clickedUser.target.id.length - 1];

				friendRequests = JSON.parse(localStorage.getItem("friendRequests")) || [];

				friendRequests.push({
					"fromId": parseInt(localStorage.getItem("loggedUser")),
					"toId": parseInt(addedFriend),
                    "fromName": jsonData.users[parseInt(localStorage.getItem("loggedUser"))].name,
                    "toName": jsonData.users[addedFriend].name
				});

				localStorage.setItem("friendRequests", JSON.stringify(friendRequests));
				console.log(friendRequests);
                //friendRequests.splice(0, friendRequests.length);
				document.getElementById(clickedUser.target.id).disabled = true;
				document.getElementById(clickedUser.target.id).innerHTML = "Request Sent!";
			}
		},

		initialize: function (opts) {
			var self=this;
			var collection = new userCollection();

			collection.fetch({
				reset: true,

				success: function(data){
					console.log("inside alluserview initialise fetch success");
					jsonData=data.toJSON()[0];
					self.render();
				}
			});

		},

		render: function(){
			console.log("inside allusersview render");
			var userId = parseInt(localStorage.getItem("loggedUser"));

				this.$('#pageContent').html(this.allUsersViewTemplate({
				userName:jsonData.users[userId].name,
				friends: jsonData.users
			}));

            xtraFriends =  JSON.parse(localStorage.getItem("xtraFriends")) || xtraFriends ;
            var idOfAllFriends = jsonData.users[userId].friends;

			// Push all friends created by accepting friend requests, which were stored in localstorage key xtraFriends.
            for(var i = 0; i < xtraFriends.length; i++)
            {
	            // If not already friends
                if(idOfAllFriends.indexOf(xtraFriends[i].user) === -1)
                {
	                // If friend is not the current user himself
                    if(userId != xtraFriends[i].addedFriend)
                    {
	                    // If the user whose friend we are checking is current user
	                    if(userId == xtraFriends[i].user)
	                        idOfAllFriends.push(xtraFriends[i].addedFriend);
                    }
                }

	            // If not already friends
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

			// Display AddFriend button for users who are not currently friend.
			for(var i=0; i<jsonData.users.length; i++)
			{
				if (idOfAllFriends.indexOf(i) !== -1)
				{
					document.getElementById("friendRequestBtn"+i).classList.add("invisible");
				}
				else
				{
					if(i !== userId)
					document.getElementById("friendRequestBtn"+i).classList.remove("invisible");
				}
			}
		}
	})
});
