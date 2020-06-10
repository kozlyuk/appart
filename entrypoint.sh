#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py migrate
echo "Migrating completed"
python manage.py collectstatic --no-input --clear
echo "Collecting staticfiles completed"

exec "$@"
