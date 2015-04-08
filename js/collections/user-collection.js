define(function(require){
	return Backbone.Collection.extend(
		{
			model: Backbone.Model,
			url: "users.json"
		}
	)
})