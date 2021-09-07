# Terraform static code analyzer

This task can be used in Azure devops within pipelines to validate Terraform script from security perspective. It will check the configuration of the resources and evaluate all the rules. It will report back if any of the rules are not satisfied. This task install TFSec utility on the agents and deployment Groups.    


Supported features:
1. Installs TFSec on both windows as well as linux operating system
2. Adds the path to environment variables
3. TFSec utility can be invoked without absolute path



### 1. Install the below Task in your azure devops org:
- Name: tfsec
- Publisher: rimodi



### 2. Select tfsec and use the task .
```
- task: tfsec@1
  inputs:
    tfsecversion: '0.58.6'
```

* tfsecversion: Accepts TFSec version number in format "vx.x.x", "x.x.x", "x.x"


### Sample YAML pipeline to execute TFSec task on linux agent.
```
trigger: 
- master

pool:
  vmImage: ubuntu-18.04

variables:
  dev_environment_scripts: $(System.DefaultWorkingDirectory)/dev-env

stages:
- stage: terraform_build
  jobs:
  - job: terraform_plan
    steps:
    - task: tfsec@1
      inputs:
        tfsecversion: '0.58.6'

    - task: CmdLine@2
      inputs:
        script: |
          cd $(dev_environment_scripts)
          tfsec . --tfvars-file=./dev.tfvars -e GEN003 --verbose
```

### Sample YAML pipeline to execute TFSec task on windows agent.
```
trigger: 
- master

pool:
  vmImage: windows-2019

variables:
  dev_environment_scripts: $(System.DefaultWorkingDirectory)/dev-env

stages:
- stage: terraform_build
  jobs:
  - job: terraform_plan
    steps:
    - task: tfsec@1
      inputs:
        tfsecversion: '0.58.6'

    - task: CmdLine@2
      inputs:
        script: |
          cd $(dev_environment_scripts)
          tfsec . --tfvars-file=./dev.tfvars -e GEN003 --verbose
```

### Sample Terraform scripts with Security issues
 - Notice that the value for enable_https_traffic_only element is "false". This by default is an error for TFSec.
```
variable resource_group_name { type = string}
variable resource_group_location { type = string}
variable storage_account_name { type = string}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.53.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" resource_group  {
    name = var.resource_group_name
    location = var.resource_group_location
}

resource "azurerm_storage_account" storage_account {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_tier             = "Standard"
  account_kind = "StorageV2"
  account_replication_type = "GRS"
  enable_https_traffic_only = false
  min_tls_version = "TLS1_2"
}
```

The script within pipeline execution results in an error message
```
 Result 1

  [azure-storage-enforce-https][HIGH] Resource 'azurerm_storage_account.storage_account' explicitly turns off secure transfer to storage account.

      26 | 
      27 | resource "azurerm_storage_account" storage_account {
      28 |   name                     = var.storage_account_name
      29 |   resource_group_name      = azurerm_resource_group.resource_group.name
      30 |   location                 = azurerm_resource_group.resource_group.location
      31 |   account_tier             = "Standard"
      32 |   account_kind = "StorageV2"
      33 |   account_replication_type = "GRS"
      34 |   enable_https_traffic_only = false
      35 |   min_tls_version = "TLS1_2"
      36 | }
      37 | 
      38 | output resource_group_id {
      39 |     value = azurerm_resource_group.resource_group.id

  Legacy ID:  AZU014
  Impact:     Insecure transfer of data into secure accounts could be read if intercepted
  Resolution: Only allow secure connection for transferring data into storage accounts

  More Info:
  - https://tfsec.dev/docs/azure/storage/enforce-https#azure/storage 
  - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account#enable_https_traffic_only 
  - https://docs.microsoft.com/en-us/azure/storage/common/storage-require-secure-transfer 

```

Turning the value back to "True" ensures that pipeline executes successfully.