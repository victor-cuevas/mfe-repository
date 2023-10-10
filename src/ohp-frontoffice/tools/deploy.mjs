import yargs from "yargs";
import { exec, execFile } from "child_process";
import * as util from "util";

const args = yargs(process.argv.slice(2)).argv;
const exe = util.promisify(exec);

async function syncDirs(s3source, s3target, subfolder) {
  console.log('BUCKET_PARAM_syncDirs', s3target);
  try {
    const { stdout, stderr } = await exe(
      `aws s3 rm s3://${s3target} --recursive && aws s3 sync s3://${s3source}/${subfolder} s3://${s3target}`
    );
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    process.exit(1);
  }
}

async function invalidateDistribution(bucket) {
  execFile('sh', ['tools/invalidate.sh'], { env: { ...process.env, BUCKET: bucket } }, (error, stdout, stderr) => {
    console.log('BUCKET_PARAM_invalidateDistribution', bucket);
    if (error) {
      console.log(`error: ${error.message}`);
      process.exit(1);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      process.exit(1);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

await syncDirs(args.s3source, args.s3target, args.appName);
await invalidateDistribution(args.s3target);
