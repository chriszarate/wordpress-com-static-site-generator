const ApiBuilder = require( 'claudia-api-builder' );
const publish = require( './src/publish' );

const api = new ApiBuilder();

api.post( '/update', publish );

module.exports = api;
