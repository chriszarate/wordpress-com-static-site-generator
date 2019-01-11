const CloudFront = require( 'aws-sdk/clients/cloudfront' );
const { cfDistributionId: DistributionId } = require( '../config' );

const cloudfront = new CloudFront();

const getInvalidationParams = () => ( {
	DistributionId,
	InvalidationBatch: {
		CallerReference: `wordpress-com-static-site-${new Date().getTime()}`,
		Paths: {
			Quantity: 1, // a wildcard counts as one path
			Items: [
				'/*',
			],
		},
	},
} );

exports.invalidate = () => {
	if ( ! DistributionId ) {
		return Promise.resolve();
	}

	console.log( `Invalidating distribution ${DistributionId}...` );
	return cloudfront.createInvalidation( getInvalidationParams() ).promise();
};
