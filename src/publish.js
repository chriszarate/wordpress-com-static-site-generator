const fs = require( 'fs' );
const path = require( 'path' );
const util = require( 'util' );
const dayjs = require( 'dayjs' );
const { s3Bucket, ...config } = require( '../config' );
const { invalidate } = require( './invalidate' );
const { renderTemplate } = require( './render' );
const { putS3Object } = require( './s3' );
const { getPosts, getPages } = require( './wp' );

// Node 8+
const writeFile = util.promisify( fs.writeFile );

const publishHtml = async ( templateName, fileName, data, ContentType = 'text/html' ) => {
	// Pass in some helpers.
	const html = await renderTemplate( templateName, { ...data, config, dayjs } );

	// For local testing.
	if ( process.env.DEBUG ) {
		const debugPath = `./test/${fileName.replace( /\.html$/, '' )}`;

		await writeFile( `${debugPath}.html`, html );
		await writeFile( `${debugPath}.json`, JSON.stringify( data ) );

		return;
	}

	// Publish HTML to S3.
	console.log( `Publishing ${fileName}...` );
	await putS3Object( {
		ACL: 'public-read',
		Body: Buffer.from( html ),
		Bucket: s3Bucket,
		ContentEncoding: 'utf-8',
		ContentType,
		Key: fileName,
	} );
};

module.exports = async () => {
	const pages = await getPages();
	const posts = await getPosts();

	// Render aggregation pages.
	await publishHtml( 'home', 'index.html', { posts } );
	await publishHtml( 'feed', 'feed', { posts }, 'application/atom+xml' );

	// Render posts and pages.
	await Promise.all( posts.map( post => publishHtml( 'post', post.slug, { post, posts } ) ) );
	await Promise.all( pages.map( page => publishHtml( 'page', page.slug, { page } ) ) );

	// Invalidate the cache.
	if ( ! process.env.DEBUG ) {
		await invalidate();
	}

	return { message: 'updated' };
};
