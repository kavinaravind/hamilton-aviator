# hamilton-aviator

> Log flights, track duty hours, manage maintenance records, and generate FAA-ready reports all in one place. No more juggling spreadsheets, notes, and disconnected tools. It's the unified solution that eliminates risk, inefficiency, and compliance gaps for pilots

## Quick Start

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
cp .env.example .env

# Push the drizzle schema to the database
pnpm db:push

# Push seed data to the database
pnpm db:seed
```

### 2. Build and Run

```bash
# Build ios
pnpm ios

# Run stack
pnpm dev
```

## Deployment

```bash
docker build -f apps/nextjs/Dockerfile -t hamilton-aviator --platform=linux/amd64 .
docker tag hamilton-aviator:latest us-central1-docker.pkg.dev/kavin-aravind/cloud-run-source-deploy/hamilton-aviator:v1
docker push us-central1-docker.pkg.dev/kavin-aravind/cloud-run-source-deploy/hamilton-aviator:v1
```

## References

Bootstrapped with [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)!
