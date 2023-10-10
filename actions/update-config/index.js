import * as core from "@actions/core";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AWS_ACCOUNT_ID = core.getInput("aws_account_id");
const INFRASTRUCTURE_ID = core.getInput("infrastructure_id");
const MFE_NAME = core.getInput("mfe_name");
const API_URL = core.getInput("api_url");
const CONFIG_TEMPLATE = core.getInput("config_template");

console.log(__dirname);
console.log("check input values:");
console.log("AWS_ACCOUNT_ID: ", AWS_ACCOUNT_ID);
console.log("INFRASTRUCTURE_ID: ", INFRASTRUCTURE_ID);
console.log("MFE_NAME: ", MFE_NAME);
console.log("API_URL: ", API_URL);
console.log("CONFIG_TEMPLATE: ", CONFIG_TEMPLATE);

const devConfig = path.join(
  __dirname,
  "..",
  "..",
  "terraform",
  "configuration",
  "team",
  "dev",
  "config.json"
);

const getConfigTemplate = (infrastructureId) => {
  const templatePath = path.join(__dirname, "..", "..", CONFIG_TEMPLATE);
  const configTemplate = fs.readFileSync(templatePath, "utf-8");
  const replaceId = configTemplate.replaceAll(
    "<infrastructure_id>",
    infrastructureId
  );
  return JSON.parse(replaceId);
};

const updateMfesConfig = (mfeName, infrastructureId, apiUrl, config) => {
  // use App-Shell for config reset
  if (mfeName === "app-shell") {
    config.REMOTE_MFES = [];

    return config;
  }

  const remoteNameWithCaps = mfeName
    .split("-")
    .slice(1)
    .map((el) => el.charAt(0).toUpperCase() + el.slice(1))
    .join("");
  const remoteName = `mfe${remoteNameWithCaps}`;

  let mfeConfig = config.REMOTE_MFES.find(
    (mfe) => mfe.remoteName === remoteName
  );

  const defaultConfigRaw = fs.readFileSync(devConfig, "utf-8");
  const defaultConfig = JSON.parse(defaultConfigRaw);

  const defaultMfeConfig = defaultConfig.REMOTE_MFES.find(
    (mfe) => mfe.remoteName === remoteName
  );

  // MFE hasn't been deployed in the past
  if (!mfeConfig) {
    // MFE doesn't exist
    if (!defaultMfeConfig) {
      core.setFailed(
        `Invalid MFE name: Could not find a default mfe configuration for ${remoteName} in team/dev`
      );
      process.exit(1);
    }

    // Clone the MFE configuration from DEV
    console.log(
      `Configuration not found for ${mfeName}. Will provide a default configuration from team/dev`
    );
    mfeConfig = { ...defaultMfeConfig };
    mfeConfig.remoteUrl = `https://${infrastructureId}-${mfeName}.portals.dev.project.tech`;
    config.REMOTE_MFES = [...config.REMOTE_MFES, mfeConfig];
    console.log("remotes: ", config.REMOTE_MFES);
  }

  // Update the API url if provided, else, reset to the default API in DEV.
  mfeConfig.apiUrl = apiUrl !== "" ? apiUrl : defaultMfeConfig.apiUrl;
  return config;
};

const s3 = new AWS.S3();
const s3GetConfigParams = {
  Bucket: `${INFRASTRUCTURE_ID}-app-shell-${AWS_ACCOUNT_ID}`,
  Key: "assets/config.json",
};

let mfeList = [];
let newConfig;
let oldConfig;

try {
  const { Body } = await s3.getObject(s3GetConfigParams).promise();
  oldConfig = JSON.parse(Body.toString("utf-8"));
} catch (error) {
  if (MFE_NAME === "app-shell") {
    console.log(
      "Could not retrieve the old configuration. A new one will be generated from the template"
    );
  } else {
    core.setFailed(
      `Error when retrieving the app-shell config: ${error} App-shell should be deployed before attempting to deploy other MFEs`
    );
    process.exit(1);
  }
}

if (oldConfig?.REMOTE_MFES) mfeList = oldConfig.REMOTE_MFES;
console.log("oldConfig", oldConfig);

// use the new config params with the old MFE setup
newConfig = getConfigTemplate(INFRASTRUCTURE_ID);
if (mfeList.length) newConfig.REMOTE_MFES = mfeList;

const config = updateMfesConfig(
  MFE_NAME,
  INFRASTRUCTURE_ID,
  API_URL,
  newConfig
);

console.log("OUTPUT: mfesConfig ====>", JSON.stringify(config, undefined, 2));
core.setOutput("mfesConfig", JSON.stringify(config));
