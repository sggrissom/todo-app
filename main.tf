terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.1"
    }
  }
}

provider "azurerm" {
  features {}
}

# Variables
variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "todo-app"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-${var.app_name}-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-${var.app_name}-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Container Apps Environment
resource "azurerm_container_app_environment" "main" {
  name                       = "cae-${var.app_name}-${var.environment}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Random string for unique naming
resource "random_string" "unique_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = "acr${replace(var.app_name, "-", "")}${var.environment}${random_string.unique_suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Container App
resource "azurerm_container_app" "main" {
  name                         = "ca-${var.app_name}-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "todo-app"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "ASPNETCORE_ENVIRONMENT"
        value = "Production"
      }
    }

    min_replicas = 1
    max_replicas = 3
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 8080

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server   = azurerm_container_registry.main.login_server
    username = azurerm_container_registry.main.admin_username
    password_secret_name = "registry-password"
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.main.admin_password
  }

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Outputs
output "container_app_url" {
  value = "https://${azurerm_container_app.main.latest_revision_fqdn}"
}

output "container_registry_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}