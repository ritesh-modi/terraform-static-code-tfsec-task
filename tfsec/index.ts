import * as tl from 'azure-pipelines-task-lib';
import * as toolLib from 'azure-pipelines-tool-lib';
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';



let osPlat: string = os.platform();
let osArch: string = os.arch();

async function run() {
    try {
        let version: string | undefined = tl.getInput('tfsecversion', true);

        if (version){
            version = version.trim();
        }
        let envPath = await getTfsec(version as string);
        if (osPlat != 'win32') {
            await verifyTflint(envPath);
        }

        console.log('========================== tfsec download completed successfully ===========================');
        tl.setResult(tl.TaskResult.Succeeded, "successfully installed Tfsec at " + envPath);

    }
    catch (error) {
        console.error('ERROR:' + error.message);
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

async function TfSec(version: string ): Promise<string> {
    console.log('========================== Starting downloading Tfsec ===========================');
    let fileName: string = getFileName();
    let downloadUrl: string = getDownloadUrl(fileName, version);
    let downloadPath: string;
    try {
            if (osPlat == 'win32') {
                console.log("downloading tfsec on windows operating system");
                downloadPath = await toolLib.downloadTool(downloadUrl, "c:\\tfsec.exe");
                console.log(downloadPath + " added to PATH environmental variable");
                toolLib.prependPath("c:\\");
            }
            else {
                console.log("downloading tfsec on linux/mac operating system");
                downloadPath = await toolLib.downloadTool(downloadUrl, "/usr/local/bin/tfsec");
                const args: Array<string> = new Array<string>();
                args.push('chmod')
                args.push('+x')
                args.push('/usr/local/bin/tfsec');
                await tl.exec('sudo', args);
                console.log("tfsec downloaded to path /usr/local/bin/");
            }
        
    } catch (error) {
        tl.debug(error);
        throw (util.format("Failed to download version %s. Please verify that the version is valid and resolve any other issues. %s", version, error));
    }


    return downloadPath;
}

async function getTfsec(version: string): Promise<string>  {
    let toolPath: string;
    let finalVersion: string = fixVersion(version);
    console.log("tfsec version to be downloaded: " + finalVersion);
    toolPath = await TfSec(finalVersion);
    console.log("tfsec tool is at " + toolPath);
    return toolPath;
}

function fixVersion(version: string): string {
    
    if(version.charAt(0) != 'v') {
        //append minor and patch version if not available
        version = 'v' + version;
    }

    let versionPart = version.split(".");

    if(versionPart[1] == null) {
        //append minor and patch version if not available
        return version.concat(".0.0");
    }
    else if(versionPart[2] == null) {
        //append patch version if not available
        return version.concat(".0");
    } 
    return version;
}

function getFileName( ): string {
    let platform: string = osPlat == "win32" ? "windows" : osPlat;
    let arch: string = osArch == "x64" ? "amd64" : "386";
    let ext: string = osPlat == "win32" ? "exe" : "";
    let filename: string
    if (osPlat == 'win32') {
        filename = util.format("tfsec-%s-%s.%s", platform, arch, ext);
    }
    else {
        filename = util.format("tfsec-%s-%s", platform, arch);
    }
   
    return filename;
}

function getDownloadUrl(filename: string, version: string): string {
    return util.format("https://github.com/aquasecurity/tfsec/releases/download/%s/%s",version, filename);
}

async function verifyTflint(path : string) {
    console.log(("Verify TFSec Installation"));
    let tfsecPath = tl.which("tfsec", true);
    console.log(tfsecPath);
    let tfsecTool : ToolRunner = tl.tool(tfsecPath);
    tfsecTool.arg("--version");
    return tfsecTool.exec();
}


run();