#!/bin/bash

# Deployment script for Todo App to Azure Container Apps

set -e

# Default values
ENVIRONMENT="dev"
SKIP_BUILD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
  -e | --environment)
    ENVIRONMENT="$2"
    shift 2
    ;;
  --skip-build)
    SKIP_BUILD=true
    shift
    ;;
  -h | --help)
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -e, --environment ENV    Deployment environment (dev, prod) [default: dev]"
    echo "  --skip-build            Skip Docker build step"
    echo "  -h, --help              Show this help message"
    exit 0
    ;;
  *)
    echo "Unknown option $1"
    exit 1
    ;;
  esac
done

echo "Deploying Todo App to Azure Container Apps"
echo "Environment: $ENVIRONMENT"

# Check if required tools are installed
command -v az >/dev/null 2>&1 || {
  echo "Azure CLI is required but not installed. Aborting." >&2
  exit 1
}
command -v terraform >/dev/null 2>&1 || {
  echo "Terraform is required but not installed. Aborting." >&2
  exit 1
}
command -v docker >/dev/null 2>&1 || {
  echo "Docker is required but not installed. Aborting." >&2
  exit 1
}

# Check if logged into Azure
if ! az account show &>/dev/null; then
  echo "Please log into Azure CLI first: az login"
  exit 1
fi

# Initialize Terraform if needed
if [ ! -d ".terraform" ]; then
  echo "Initializing Terraform..."
  terraform init
fi

# Plan Terraform deployment
echo "Planning Terraform deployment..."
terraform plan -var="environment=${ENVIRONMENT}" -out=tfplan

# Apply Terraform configuration
echo "Applying Terraform configuration..."
terraform apply tfplan

# Get container registry details
ACR_LOGIN_SERVER=$(terraform output -raw container_registry_login_server)
RESOURCE_GROUP=$(terraform output -raw resource_group_name)

echo "Container Registry: $ACR_LOGIN_SERVER"

if [ "$SKIP_BUILD" = false ]; then
    echo "Waiting for Container Registry to be ready..."
    sleep 30
  # Build and push Docker image
  echo "Building Docker image..."
  docker build -t todo-app:latest .

  # Log into Azure Container Registry
  echo "Logging into Azure Container Registry..."
  az acr login --name "${ACR_LOGIN_SERVER%%.azurecr.io}"

  # Tag and push image
  echo "Tagging and pushing image..."
  docker tag todo-app:latest "$ACR_LOGIN_SERVER/todo-app:latest"
  docker push "$ACR_LOGIN_SERVER/todo-app:latest"

  # Update container app with new image
  echo "Updating container app..."
  az containerapp update \
    --name "ca-todo-app-$ENVIRONMENT" \
    --resource-group "$RESOURCE_GROUP" \
    --image "$ACR_LOGIN_SERVER/todo-app:latest"
fi

# Get the application URL
APP_URL=$(terraform output -raw container_app_url)

echo "Deployment completed successfully!"
echo "Application URL: $APP_URL"

