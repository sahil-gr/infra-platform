const core = require('@actions/core');
const fs = require('fs');

try {
  const env = core.getInput('env');
  const file = `envs/${env}.tfvars`;

  if (!fs.existsSync(file)) {
    throw new Error(`Missing file: ${file}`);
  }

  const content = fs.readFileSync(file, 'utf8');

  if (!content.includes('instance_type')) {
    throw new Error('instance_type missing');
  }

  if (!content.includes('environment')) {
    throw new Error('environment missing');
  }

  console.log(`Validation passed for ${file}`);
} catch (e) {
  core.setFailed(e.message);
}