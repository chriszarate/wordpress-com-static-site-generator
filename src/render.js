const ejs = require( 'ejs' );
const path = require( 'path' );

const getInputPath = name => path.resolve( __dirname, `../templates/${name}.ejs` );

// Render template.
exports.renderTemplate = async ( templateName, data ) => ejs.renderFile( getInputPath( templateName ), data );
