#!/usr/bin/env bash
# Used by Render (and similar hosts) on each deploy
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input

# Seed counselors; sample students only if the DB has no leads yet.
# Safe with persistent Postgres — will not wipe real data on redeploy.
# Set SEED_DEMO_DATA=false to skip entirely.
if [ "${SEED_DEMO_DATA:-true}" = "true" ]; then
  python manage.py seed_demo_data
fi
