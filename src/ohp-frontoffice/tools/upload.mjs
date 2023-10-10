import yargs from "yargs";
import { exec } from "child_process";
import * as util from "util";

const args = yargs(process.argv.slice(2)).argv;
const exe = util.promisify(exec);

async function syncDirs(localSource, s3target) {
  try {
    const { stdout, stderr } = await exe(
      `aws s3 rm s3://${s3target}/${args.appName} --recursive && aws s3 sync ${localSource} s3://${s3target}/${args.appName}`
    );
    console.log('stdout:', stdout);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      process.exit(1);
    }
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

await syncDirs(`./dist/apps/${args.appName}`, args.s3target);
