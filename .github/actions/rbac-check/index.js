const core = require('@actions/core');

const allowed = ['your-username'];
const actor = process.env.GITHUB_ACTOR;

if (!allowed.includes(actor)) {
  core.setFailed(`Unauthorized user: ${actor}`);
}