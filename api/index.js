const serverlesswp = require('serverlesswp');

const { validate } = require('../util/install.js');
const { setup } = require('../util/directory.js');

const logWithTimestamp = (message) => {
  const now = new Date();
  const timestamp = now.toISOString();
  const milliseconds = now.getMilliseconds();
  console.log(`[${timestamp}.${milliseconds.toString().padStart(3, '0')}] ${message}`);
};

// This is where all requests to WordPress are routed through. See vercel.json or netlify.toml for the redirection rules.
exports.handler = async function (event, context, callback) {
    // Move the /wp directory to /tmp/wp so that it is writeable.
    logWithTimestamp('handler')
    setup();
    logWithTimestamp('setup done')

    // Send the request (event object) to the serverlesswp library. It includes the PHP server that allows WordPress to handle the request.
    let response = await serverlesswp({docRoot: '/tmp/wp', event: event});
    
    logWithTimestamp('serverlesswp done')
    // Check to see if the database environment variables are in place.
    let checkInstall = validate(response);

    
    logWithTimestamp('validate done', checkInstall)
    
    if (checkInstall) {
        return checkInstall;
    }
    else {
        // Return the response for serving.
        return response;
    }
}
