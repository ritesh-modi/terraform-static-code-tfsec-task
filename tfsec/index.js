"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = __importStar(require("azure-pipelines-task-lib"));
var toolLib = __importStar(require("azure-pipelines-tool-lib"));
var os = __importStar(require("os"));
var util = __importStar(require("util"));
var osPlat = os.platform();
var osArch = os.arch();
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var version, envPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    version = tl.getInput('tfsecversion', true);
                    if (version) {
                        version = version.trim();
                    }
                    return [4 /*yield*/, getTfsec(version)];
                case 1:
                    envPath = _a.sent();
                    if (!(osPlat != 'win32')) return [3 /*break*/, 3];
                    return [4 /*yield*/, verifyTflint(envPath)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    console.log('========================== tfsec download completed successfully ===========================');
                    tl.setResult(tl.TaskResult.Succeeded, "successfully installed Tfsec at " + envPath);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('ERROR:' + error_1.message);
                    tl.setResult(tl.TaskResult.Failed, error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function TfSec(version) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, downloadUrl, downloadPath, args, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('========================== Starting downloading Tfsec ===========================');
                    fileName = getFileName();
                    downloadUrl = getDownloadUrl(fileName, version);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (!(osPlat == 'win32')) return [3 /*break*/, 3];
                    console.log("downloading tfsec on windows operating system");
                    return [4 /*yield*/, toolLib.downloadTool(downloadUrl, "c:\\tfsec.exe")];
                case 2:
                    downloadPath = _a.sent();
                    console.log(downloadPath + " added to PATH environmental variable");
                    toolLib.prependPath("c:\\");
                    return [3 /*break*/, 6];
                case 3:
                    console.log("downloading tfsec on linux/mac operating system");
                    return [4 /*yield*/, toolLib.downloadTool(downloadUrl, "/usr/local/bin/tfsec")];
                case 4:
                    downloadPath = _a.sent();
                    args = new Array();
                    args.push('chmod');
                    args.push('+x');
                    args.push('/usr/local/bin/tfsec');
                    return [4 /*yield*/, tl.exec('sudo', args)];
                case 5:
                    _a.sent();
                    console.log("tfsec downloaded to path /usr/local/bin/");
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    tl.debug(error_2);
                    throw (util.format("Failed to download version %s. Please verify that the version is valid and resolve any other issues. %s", version, error_2));
                case 8: return [2 /*return*/, downloadPath];
            }
        });
    });
}
function getTfsec(version) {
    return __awaiter(this, void 0, void 0, function () {
        var toolPath, finalVersion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finalVersion = fixVersion(version);
                    console.log("tfsec version to be downloaded: " + finalVersion);
                    return [4 /*yield*/, TfSec(finalVersion)];
                case 1:
                    toolPath = _a.sent();
                    console.log("tfsec tool is at " + toolPath);
                    return [2 /*return*/, toolPath];
            }
        });
    });
}
function fixVersion(version) {
    if (version.charAt(0) != 'v') {
        //append minor and patch version if not available
        version = 'v' + version;
    }
    var versionPart = version.split(".");
    if (versionPart[1] == null) {
        //append minor and patch version if not available
        return version.concat(".0.0");
    }
    else if (versionPart[2] == null) {
        //append patch version if not available
        return version.concat(".0");
    }
    return version;
}
function getFileName() {
    var platform = osPlat == "win32" ? "windows" : osPlat;
    var arch = osArch == "x64" ? "amd64" : "386";
    var ext = osPlat == "win32" ? "exe" : "";
    var filename;
    if (osPlat == 'win32') {
        filename = util.format("tfsec-%s-%s.%s", platform, arch, ext);
    }
    else {
        filename = util.format("tfsec-%s-%s", platform, arch);
    }
    return filename;
}
function getDownloadUrl(filename, version) {
    return util.format("https://github.com/aquasecurity/tfsec/releases/download/%s/%s", version, filename);
}
function verifyTflint(path) {
    return __awaiter(this, void 0, void 0, function () {
        var tfsecPath, tfsecTool;
        return __generator(this, function (_a) {
            console.log(("Verify TFSec Installation"));
            tfsecPath = tl.which("tfsec", true);
            console.log(tfsecPath);
            tfsecTool = tl.tool(tfsecPath);
            tfsecTool.arg("--version");
            return [2 /*return*/, tfsecTool.exec()];
        });
    });
}
run();
