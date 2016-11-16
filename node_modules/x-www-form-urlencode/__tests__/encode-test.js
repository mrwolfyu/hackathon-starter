jest.dontMock('../')

describe('x-www-form-urlencoded: encode'
, function () {
	it([	'should encode a given string `s` into '
		, '`application/x-www-form-urlencoded` format.'
	].join("")
	, function () {
		var xform = require('../')
		, encoded
		
		encoded = xform.encode(" %&+£€")
	
		expect(encoded).toBe("+%25%26%2B%C2%A3%E2%82%AC")
	})
	it([
		'should encode CR, LF, CR+LF all to %0D%0A'
	].join(""), function () {
		var xform = require('../')
		
		var encoded = xform.encode("\n\r");
		expect(encoded).toBe("%0D%0A%0D%0A");
		encoded = xform.encode("\r");
		expect(encoded).toBe("%0D%0A");
		encoded = xform.encode("\n");
		expect(encoded).toBe("%0D%0A");
	});
})
