const core = require('@actions/core');
const { execSync } = require('child_process');

try {
  const env = core.getInput('env');
  const key = core.getInput('state_key');

  console.log(`State key: ${key}`);

  execSync(`terraform init -backend-config="key=${key}"`, { stdio: 'inherit' });

  execSync(`terraform plan -var-file=envs/${env}.tfvars`, { stdio: 'inherit' });

  execSync(`terraform apply -auto-approve`, { stdio: 'inherit' });

} catch (err) {
  core.setFailed(err.message);
}