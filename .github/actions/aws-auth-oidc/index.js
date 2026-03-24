const core = require('@actions/core');
const https = require('https');
const { execSync } = require('child_process');

async function getOIDCToken() {
  return new Promise((resolve, reject) => {
    const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
    const token = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;

    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        resolve(parsed.value);
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const role = core.getInput('role-to-assume');
    const region = core.getInput('aws-region');

    console.log("Requesting OIDC token from GitHub...");

    const idToken = await getOIDCToken();

    console.log("Assuming AWS role via OIDC...");

    const command = `
      aws sts assume-role-with-web-identity \
        --role-arn ${role} \
        --role-session-name github-actions \
        --web-identity-token '${idToken}' \
        --duration-seconds 3600
    `;

    const output = execSync(command).toString();
    const creds = JSON.parse(output).Credentials;

    // ✅ Export credentials
    core.exportVariable('AWS_ACCESS_KEY_ID', creds.AccessKeyId);
    core.exportVariable('AWS_SECRET_ACCESS_KEY', creds.SecretAccessKey);
    core.exportVariable('AWS_SESSION_TOKEN', creds.SessionToken);
    core.exportVariable('AWS_REGION', region);

    console.log("AWS credentials configured successfully");

    // Optional debug
    const identity = execSync('aws sts get-caller-identity').toString();
    console.log(identity);

  } catch (err) {
    core.setFailed(err.message);
  }
}

run();