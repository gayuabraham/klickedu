#!/usr/bin/env bash
# Used by Render (and similar hosts) on each deploy
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input
python manage.py seed_demo_data
