SERVICE_ACCOUNT := "next-2025-demo@test-project-219923.iam.gserviceaccount.com"
REGION := "us-central1"
DATE := `date --utc +"%Y%m%d%H%M%S"`
TAG := "oc" + DATE
PROJECT_ID := "test-project-219923"

default:
  npm run just -- --list

deploy:
  gcloud run deploy \
    fligth-search-api \
    --project={{PROJECT_ID}} \
    --region={{REGION}} \
    --source=. \
    --tag={{TAG}} \
    --allow-unauthenticated \
    --service-account={{SERVICE_ACCOUNT}} \
    --labels=target-id=fligth-search-api,project-id=test-project-219923
  gcloud run services \
    update-traffic \
    fligth-search-api \
    --project={{PROJECT_ID}} \
    --to-latest \
    --region={{REGION}}