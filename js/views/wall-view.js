define(function (require) {

	window.xtraWallPosts = JSON.parse(localStorage.getItem("xtraWallPosts")) || [];
	//window.tempx=0;

	var userCollection = require("collections/user-collection");
	var jsonData;

	return Backbone.View.extend({
		el: "body",

		wallViewTemplate: Handlebars.compile(require("text!templates/wall-view.html")),

		initialize: function (opts) {
			console.log("inside just after wallView initialise");

			// If no user is logged in navigate to login View.
			if(_.isNaN(parseInt(localStorage.getItem("loggedUser"))))
			{
				alert("login First!");
				$(this.el).undelegate();
				require("router").navigate('login', { trigger: true });
				return;
			}

			var self=this;
			console.log("inside wallView initialise just before new userCollection()");
			var collection = new userCollection();
			console.log("inside wallView initialise just after new userCollection()");

			collection.fetch({
				reset: true,

				success: function(data){
					console.log("inside wallview initialise collection.fetch success");
					jsonData = data.toJSON()[0];
					self.render();
				}
			});


		},

		render: function(){
			console.log("inside wallview render fn");
			userId = parseInt(localStorage.getItem("loggedUser"));
			var wallPosts=jsonData.users[userId].wall;

			// Push all wallPosts made by user from localstorage.
			for(var i=0; i<window.xtraWallPosts.length; i++)
			{
				if(wallPosts[0].postedOn === window.xtraWallPosts[i].postedOn)
				{
					wallPosts.push(window.xtraWallPosts[i]);
				}
			}

			this.$('#pageContent').html(this.wallViewTemplate({
				userName:jsonData.users[userId].name,
				wallPosts: wallPosts
			}));
		}
	})
})
