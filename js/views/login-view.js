define(function (require) {

	var userCollection = require("collections/user-collection");
	var jsonData;

	return Backbone.View.extend({
		el: "body",

		loginViewTemplate: Handlebars.compile(require("text!templates/login-view.html")),

		events: {
			"click #loginButton": "login"

		},

		login: function(){
			self=this;
			console.log("inside loginview login fn");
			var userName = document.getElementById("userName").value;
			var password = document.getElementById("password").value;
			var correctInfo = 0;

			// Authenticate Login.
			for(var i=0; i<jsonData.users.length; i++)
			{
				if(jsonData.users[i].name.toLowerCase()===userName.toLowerCase())
				{
					if(jsonData.users[i].password === password)
					{
						correctInfo = 1;
						localStorage.setItem("loggedUser", i);
						$(this.el).undelegate();
						require("router").navigate('home', { trigger: true });
						return;
					}
					else
					{
						alert("Incorrect Password!!");
						return;
					}
				}
			}

			if(correctInfo === 0)
			{
				alert("incorrect UserName!!");
			}
		},

		initialize: function (opts) {

			//if any user is logged in, navigate to home view
			if(!_.isNaN(parseInt(localStorage.getItem("loggedUser"))))
			{
				$(this.el).undelegate();
				require("router").navigate('home', { trigger: true });
				return;
			}

			console.log("inside loginview initialise fn");
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
			console.log("inside loginview render fn");
			this.$('#pageContent').html(this.loginViewTemplate());
		}
	})

})
