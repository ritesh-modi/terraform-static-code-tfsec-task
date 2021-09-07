# terraform-static-code-tfsec-task
This document provides the install and build steps for Terraform static security code analyzer task for Azure DevOps. The overview document provides steps for usage.

# Terraform static code analyzer

This task can be used in Azure devops within pipelines to validate Terraform script from security perspective. It will check the configuration of the resources and evaluate all the rules. It will report back if any of the rules are not satisfied. This task install TFSec utility on the agents and deployment Groups.    


Supported features:
1. Installs TFSec on both windows as well as linux operating system
2. Adds the path to environment variables
3. TFSec utility can be invoked without absolute path



### 1. Install the below Task in your azure devops org:
- Name: tfsec
- Publisher: rimodi



### 2. Select tfsec and use the task
```
- task: tfsec@1
  inputs:
    tfsecversion: '0.58.6'
```

* tfsecversion: Accepts TFSec version number in format "vx.x.x", "x.x.x", "x.x"


## Build Process of the task

### 1. Prerequisites

The steps in prerequisites should be executed prior to building this task. The prerequisite steps are listed @ https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#prerequisites

Steps to build:

### 2. Clone this repo and modify the vss-extension.json file
```
modify the version, publisher and name elements

```

### 2. Modify the task.json file
```
modify the id elements with a new guid value.

```
        

### 3. Generate vsix file.

Run ```codecoveragethreshold/tsc``` and ```tfx extension create --manifest-globs vss-extension.json```, this will generate vsix file which can be uploaded to the marketplace.


This project welcomes contributions and suggestions. 

## Communication and Support

TO BE UPDATED
