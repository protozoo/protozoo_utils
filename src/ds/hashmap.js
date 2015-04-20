// A simple dictionary structure with accessible contents list
pz.HashMap = Class.extend({
	init: function(){
		console.log( "New HashMap created" );
		this.list = [];
		this.dictionary = {};
	}, 

	addItem: function( item, idAttribute )
	{
		//console.log( "addItem() called" );
		if( !idAttribute ){
			idAttribute = "id";
		}
		if( !item[ idAttribute ] ){
			console.info( "Item doesn't include requested idAttribute '"+idAttribute+"' (by default will use 'id')"); return;
		}
		if( this.dictionary[ item[ idAttribute ] ] ){
			console.info( "Item with id '"+item[ idAttribute ]+"' already exists"); return false;
		}
		this.list.push( item );
		this.dictionary[ item[ idAttribute ] ] = item;
		return true;
	},

	getById: function( id )
	{
		return this.dictionary[id];
	}
});


// Creates a HashMap from an array of objects
pz.HashMap.fromArray = function( array, idAttribute )
{
	console.log( "HashMap.fromArray() called" );
	if( !idAttribute ){
		idAttribute = "id";
	}
	var result = new pz.HashMap();
	for (var i = 0; i < array.length; i++) {
		var item = array[i];
		result.addItem( item, idAttribute );
	};
	return result;
}