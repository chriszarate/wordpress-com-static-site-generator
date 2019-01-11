const S3 = require( 'aws-sdk/clients/s3' );

const s3 = new S3();

exports.putS3Object = options => new Promise( resolve => {
	s3.putObject( options, err => {
		if (err) {
			throw err;
		}

		resolve();
	} )
} );
