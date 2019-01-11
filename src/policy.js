const IAM = require( 'aws-sdk/clients/iam' );
const { lambda: { role: RoleName } } = require( '../claudia.json' );
const { s3Bucket } = require( '../config' );

const iam = new IAM();

const generateBucketPolicy = () => JSON.stringify( {
	Version: '2012-10-17',
	Statement: [
		{
			Effect: 'Allow',
			Action: [
				'cloudfront:CreateInvalidation',
			],
			Resource: '*',
		},
		{
			Effect: 'Allow',
			Action: [
				's3:*',
			],
			Resource: [
				`arn:aws:s3:::${s3Bucket}`,
				`arn:aws:s3:::${s3Bucket}/*`,
			],
		},
	],
} );

const addPolicy = async () => {
	// Create bucket policy.
	const PolicyName = `s3-policy-${RoleName}`;
	console.log( `Creating policy ${PolicyName}...` );
	const { Policy: { Arn: PolicyArn } } = await iam.createPolicy( {
		PolicyDocument: generateBucketPolicy(),
		PolicyName,
	} ).promise();

	// Attach to Lambda execution role.
	console.log( `Attaching policy to ${RoleName}...` );
	await iam.attachRolePolicy( { PolicyArn, RoleName } ).promise();
};

addPolicy().then( () => console.log( 'done!' ) );
