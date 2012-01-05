/*global _, Backbone */
/*jslint forin:true */
(function() {
	
	// New definition for Backbone.Events.unbind, which includes a `context` parameter
	
	var unbind = Backbone.Events.unbind = function( ev, callback, context ) {
		var calls;
		
		if( !ev ) {
			this._callbacks = {};
			
		} else if( ( calls = this._callbacks ) ) {
			if( !callback ) {
				calls[ ev ] = [];
				
			} else {
				var list = calls[ ev ];
				if( !list ) { return this; }
				
				for( var i = 0, len = list.length; i < len; i++ ) {
					if( list[ i ] && callback === list[ i ][ 0 ] && ( !context || context === list[ i ][ 1 ] ) ) {  // the last part of the if statement is the addition, the part that checks the new context parameter
						list[ i ] = null;
						break;
					}
				}
			}
		}
		return this;
	};
	
	
	// Overwrite the current (i.e. old) Backbone.Events.unbind property on each of the
	// 4 main Backbone classes
	Backbone.Model.prototype.unbind = unbind;
	Backbone.Collection.prototype.unbind = unbind;
	Backbone.Router.prototype.unbind = unbind;
	Backbone.View.prototype.unbind = unbind;
	
})();