jest.dontMock('../')

describe("x-www-form-urlencoded: decode"
, function () {
	it([	'should decode a given string `s` from '
		, '`application/x-www-form-urlencoded` format.'
	].join("")
	, function () {
		var xform = require('../')
		, decoded
	
		decoded = xform.decode("+%25%26%2B%C2%A3%E2%82%AC")
		
		expect(decoded).toBe(" %&+£€")
	})
})
