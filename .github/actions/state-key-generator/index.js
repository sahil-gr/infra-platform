const core = require('@actions/core');

const env = core.getInput('env');
const service = core.getInput('service');

const key = `org/project/${env}/${service}/terraform.tfstate`;

core.setOutput('key', key);