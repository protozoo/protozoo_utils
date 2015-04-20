describe('Array::zeroFilledArray', function(){
	it( "should generate an array with 10 elements", function(  ){
		var array = Array.zeroFilledArray( 10 );
		expect( array.length ).toEqual( 10 );
	});

	it( "should generate an array whose elements are all zero-valued", function(  ){
		var array = Array.zeroFilledArray( 2 );
		expect( array.join(",") ).toEqual( "0,0" );
	})
})