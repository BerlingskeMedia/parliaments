'use strict';

var server = require("../src/app");
var mysql;

describe ( 'testing' , function () {
  bar = null;

  beforeEach(function() {
    mysql = {
      query: function(value) {
        bar = value;
      }
    };

    spyOn(mysql, 'query');
  });


  it ( 'returns _id, _version, checksum etc.' , function ( done ) {
    var options = {
      method: "GET",
      url: "/v0/members"
    };

    server.inject(options, function(response) {
      var result = response.result;

      // expect( err ).toEqual( null );
      // expect( data._id ).not.toBeNull();
      // expect( broadwaydatabase.isValidId( data._id )).toEqual( true );
      // expect( data._version ).toEqual( 1 );
      // expect( checksum ).not.toBeNull();
      // expect( checksum.length ).toEqual( 40 );
      // temp = { data: data, checksum: checksum };
      // done();
      expect(response.statusCode).toEqual(200);

      // expect(result).to.be.instanceof(Array);
      // expect(result).to.have.length(5);

      done();
    });
  });
});
