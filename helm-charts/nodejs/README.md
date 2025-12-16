# Node.JS

Node.JS/NestJS chart for Kubernetes. Contain manifests template for K8s.

## Prerequisites

-   Kubernetes 1.12+
-   Helm 3.1.0
-   PV provisioner support in the underlying infrastructure

## Components

-   Application deployment
-   Application service, ingress for network access
-   Migrations job for pre-start hooks
-   ConfigMap and Secret for passing environment variables
-   Optional MySQL or PostgreSQL database for development purposes

## Usage

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release ./
```

## Values

See [values.yaml](./values.yaml)
