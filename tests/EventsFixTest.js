/*global window, _, jQuery, $, module, test, strictEqual, raises, Backbone */
jQuery( document ).ready( function() {
	
	module( "Backbone.Events" );
	
	
	// Classes used by the tests
	var User = function() {
		this.changeCount = 0;
	};
	_.extend( User.prototype, Backbone.Events );
	
	
	var UserView = function( user, userViewNum ) {
		this.userViewNum = userViewNum;
		this.user = user;
		this.changeCount = 0;
		
		this.user.bind( 'change', this.onChange, this );
	};
	_.extend( UserView.prototype, {
		onChange : function() {
			this.changeCount++;
		},
		
		getChangeCount : function() {
			return this.changeCount;
		},
		
		unbindUser : function( unbindWithContext ) {
			if( !unbindWithContext ) {
				this.user.unbind( 'change', this.onChange ); // NOTE: No context param
			} else {
				this.user.unbind( 'change', this.onChange, this );
			}
		}
	} );
	
	
	// ---------------------
	
	// Tests
	
	
	test( "The new unbind() method should continue to work with the old (broken) behavior if no context param is provided, to maintain backward compatibility", function() {
		var user = new User();
		var userView1 = new UserView( user, 1 );
		var userView2 = new UserView( user, 2 );
		
		user.trigger( 'change' );
		strictEqual( userView1.getChangeCount(), 1, "After change event, userView1's changeCount should be at 1" );
		strictEqual( userView2.getChangeCount(), 1, "After change event, userView2's changeCount should be at 1" );
		
		// Now unbind userView2, and trigger the event again. Due to the old broken behavior, userView1 should be unbound.
		userView2.unbindUser( /* unbindWithContext */ false );  // NOTE: Not unbinding with the context param, to test the old behavior
		user.trigger( 'change' );
		strictEqual( userView1.getChangeCount(), 1, "After change event, userView1 should still be at 1 changeCount, due to the old behavior of unbinding the wrong object w/ no context param" );
		strictEqual( userView2.getChangeCount(), 2, "After change event, userView2 should be at 2 changeCounts, due to the old behavior of unbinding the wrong object w/ no context param" );
	} );
	
	
	test( "The new unbind() method should work with the new context parameter", function() {		
		var user = new User();
		
		var userView1 = new UserView( user, 1 );
		var userView2 = new UserView( user, 2 );
		
		user.trigger( 'change' );
		strictEqual( userView1.getChangeCount(), 1, "After change event, userView1 should be at 1 changeCount" );
		strictEqual( userView2.getChangeCount(), 1, "After change event, userView2 should be at 1 changeCount" );
		
		// Now unbind userView2, and trigger the event again. Using the new context parameter provided, this should now work correctly
		userView2.unbindUser( /* unbindWithContext */ true );  // Now properly unbinding with the context param
		user.trigger( 'change' );
		strictEqual( userView1.getChangeCount(), 2, "After change event, userView1 should now be at 2 changeCounts" );
		strictEqual( userView2.getChangeCount(), 1, "After change event, userView2 should still be at 1 changeCount (unbinding correctly)" );
	} );
	
} );