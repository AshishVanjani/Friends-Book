define(function (require) {

	var userCollection = require("collections/user-collection");
	var jsonData;
    var allFriendRequests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    var xtraFriends = xtraFriends || [];


	return Backbone.View.extend({
		el: "body",

		homeViewTemplate: Handlebars.compile(require("text!templates/home-view.html")),

		events: {
			"click #friendsButton": "friends",

			"click #allUsersButton": "allUsers",

			"click #wallButton": "wall",

            "click #friendRequestsList": "friendRequest"
		},

        friendRequest: function(clickedButton){
            if(clickedButton.target.tagName.toLowerCase()=== "button")
            {
                addedFriend = parseInt(clickedButton.target.id[clickedButton.target.id.length - 1]);
                xtraFriends.push({
                    "user": parseInt(localStorage.getItem("loggedUser")),
                    "addedFriend": addedFriend
                });

                localStorage.setItem("xtraFriends", JSON.stringify(xtraFriends));
                document.getElementById(clickedButton.target.id).disabled = true;
                document.getElementById(clickedButton.target.id).innerHTML = "Friend Added!";
                document.getElementById("ignore").innerHTML = "close";
            }
        },

		wall:  function(){
			console.log("inside homeview wall fn");
			$(this.el).undelegate();
			require("router").navigate('wall', { trigger: true });
			//location.hash="wall";
		},

		allUsers: function(){
		console.log("inside homeview allUsers fn");
		$(this.el).undelegate();
		require("router").navigate('allUsers', { trigger: true });
		//location.hash="allUsers"
		},

		friends: function(){
			console.log("inside homeview friends fn");
			$(this.el).undelegate();
			require("router").navigate('friends', { trigger: true });
			//location.hash="friends";
		},

		initialize: function (opts) {
			console.log("inside homeview initialise fn");

			//if no user is logged in, navigate to login view
			if(_.isNaN(parseInt(localStorage.getItem("loggedUser"))))
			{
				$(this.el).undelegate();
				require("router").navigate('login', { trigger: true });
				return;
			}

			var self=this;
			var collection = new userCollection();

			collection.fetch({
				reset: true,
				success: function(data){
							jsonData=data.toJSON()[0];
							console.log("inside home view initialise collection.fetch success");
							self.render();
						}
			});
		},

		render: function(){
			console.log("inside homeview render fn");

			var userId = parseInt(localStorage.getItem("loggedUser"));
            allFriendRequests = JSON.parse(localStorage.getItem("friendRequests")) || [];
            var friendRequests = [];
            var friendReqFlag = 0;

            for(var i=0; i<allFriendRequests.length; i++)
            {
                if(parseInt(allFriendRequests[i].toId) === userId)
                {
                    friendReqFlag = friendReqFlag + 1;
                    friendRequests.push(allFriendRequests[i]);
	                console.log(friendRequests.indexOf(allFriendRequests[i]));
                }
            }

			// After accepting/ignoring friend requests, them from local storage.
			for(var i=0; i<friendRequests.length; i++)
			{
				var x = allFriendRequests.indexOf(friendRequests[i]);
				allFriendRequests.splice(x, 1);
			}

            localStorage.setItem("friendRequests", JSON.stringify(allFriendRequests));

			this.$('#pageContent').html(this.homeViewTemplate({
				userName:jsonData.users[userId].name,
				age:jsonData.users[userId].age,
				city:jsonData.users[userId].city,
                numberOfFriendRequests: friendReqFlag,
                friendRequests: friendRequests
			}));

			// If there are friend requests, display bootstrap modal.
            if(friendReqFlag > 0)
            {
                $('#friendRequestPopup').modal();
            }
		}
	})
})
