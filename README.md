# movie-service

Initial scaffold for the movie-service repository.

## CI/CD (GitHub Actions → Artifact Registry → Cloud Run)

Workflow: `.github/workflows/cicd-cloudrun.yml`

### What it does

- **Backend (`movieworld`, `moviereview`)**
  - Unit tests
  - JaCoCo coverage + upload coverage artifact
  - Sonar analysis (optional; requires secrets)
  - Build jar
  - Build Docker image
  - Scan Docker image (Trivy)
  - Push Docker image to Artifact Registry
  - Deploy to Cloud Run
- **Frontend (`movieapp`)**
  - Unit tests (Jest) + coverage + upload coverage artifact
  - Sonar analysis (optional; requires secrets)
  - Build Angular app
  - Build Docker image
  - Scan Docker image (Trivy)
  - Push Docker image to Artifact Registry
  - Deploy to Cloud Run **after** both backend services are deployed

### Required GitHub Secrets

- `GCP_PROJECT_ID`
- `GCP_REGION` (e.g. `us-central1`)
- `GCP_ARTIFACT_REPO` (Artifact Registry Docker repo name)
- `GCP_WORKLOAD_IDENTITY_PROVIDER` (full resource name for GitHub OIDC)
- `GCP_SERVICE_ACCOUNT` (service account email used by WIF)

### Optional GitHub Secrets (Sonar)

- `SONAR_TOKEN`
- `SONAR_ORG`
- `SONAR_HOST_URL` (defaults to `https://sonarcloud.io`)
- `SONAR_PROJECTKEY_MOVIEWORLD`
- `SONAR_PROJECTKEY_MOVIEREVIEW`
- `SONAR_PROJECTKEY_MOVIEAPP`

## Google MCP (Cloud Run) in Cursor

This repo includes `.cursor/mcp.json` configured for Google’s official Cloud Run MCP server (`@google-cloud/cloud-run-mcp`).

- Edit `.cursor/mcp.json` and set:
  - `GOOGLE_CLOUD_PROJECT`
  - `GOOGLE_CLOUD_REGION`
- In Cursor, enable the MCP server and authenticate with `gcloud auth application-default login` (recommended for local dev tooling).

Note: **Do not commit** any service account keys/credential JSON into the repo.

## Cloud Run port binding (backend)

`movieworld` and `moviereview` are configured to listen on Cloud Run’s `PORT` env var:

- `server.port=${PORT:8080}`

This is the recommended approach on Cloud Run (no Dockerfile entrypoint override needed).
