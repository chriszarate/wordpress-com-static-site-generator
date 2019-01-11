const WPAPI = require( 'wpapi' );
const { wordpressDomain } = require( '../config' );

// Connect to WPCOM REST API.
const wp = WPAPI.site( 'https://public-api.wordpress.com/wp/v2/sites/' );

// https://github.com/WP-API/node-wpapi/issues/329
const withNS = request => request.namespace( wordpressDomain );

const getPages = ( perPage = 10 ) => withNS( wp.pages().perPage( perPage ) );
const getPosts = ( perPage = 10 ) => withNS( wp.posts().perPage( perPage ) );

// Get entire collection using pagination helper.
const getCollection = async request => {
	const response = await request.get();
	if ( ! response._paging || ! response._paging.next ) {
		return response;
	}

	const nextResponse = await getCollection( response._paging.next );

	return [ ...response, ...nextResponse ];
};

exports.getPages = () => getCollection( getPages() );
exports.getPosts = () => getCollection( getPosts() );
