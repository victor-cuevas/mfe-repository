import { exec } from 'child_process';
import util from 'util';
import { readFileSync, writeFileSync } from 'fs';

const exe = util.promisify(exec);

async function syncConfigFiles() {
  const s3Bucket = process.env.BUCKET;
  const mfeName = process.env.MFE_NAME;
  const newBffUrl = process.env.BFF_URL;

  try {
    const { stdout: downloadStdout } = await exe(`aws s3 cp s3://${s3Bucket}/assets/config.json uploadedConfig.json`);

    console.log('stdout:', downloadStdout);

    const uploadedConfigFile = readFileSync('uploadedConfig.json', 'utf-8');
    // use env.BFF_URL
    const uploadedConfig = JSON.parse(uploadedConfigFile);

    const remoteNameWithCaps = mfeName
      .split('-')
      .slice(1)
      .map(el => el.charAt(0).toUpperCase() + el.slice(1))
      .join('');
    const remoteName = `mfe${remoteNameWithCaps}`;

    const mfeConfig = uploadedConfig.REMOTE_MFES.find(mfe => mfe.remoteName === remoteName);

    if (!mfeConfig) {
      console.log(`No config found for for ${mfeName}. Please use the "Deploy QA TST env" workflow instead`);
      process.exit(1);
    }

    mfeConfig.apiUrl = newBffUrl;

    const configToUpload = JSON.stringify(uploadedConfig, null, 2);
    writeFileSync('modifiedConfig.json', configToUpload);

    console.log(uploadedConfig);
    const { stdout: uploadStdout } = await exe(`aws s3 cp modifiedConfig.json s3://${s3Bucket}/assets/config.json`);

    console.log('stdout:', uploadStdout);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

await syncConfigFiles();
