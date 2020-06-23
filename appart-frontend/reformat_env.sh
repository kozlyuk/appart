#!/bin/bash

RED=$(tput setaf 1)
NEUTRAL=$(tput sgr0)
YELLOW=$(tput setaf 3)

START_STRING=$1
FINAL_STRING=$2

if [ -w ./.env.production ]; then
  printf "$YELLOW""File .env.production has write permission\n""$NEUTRAL"
else
  printf "$RED""You don't have write permission for file .env.production\n""$NEUTRAL"
  exit 1
fi

sed "s/${START_STRING}/${FINAL_STRING}/g" ./.env.production >>./temp_env || exit 1
rm -rf ./.env.production || exit 1
cat ./temp_env >>./.env.production || exit 1
rm -rf ./temp_env || exit 1
