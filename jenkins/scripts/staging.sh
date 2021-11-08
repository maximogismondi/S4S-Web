#!/usr/bin/env sh

npm run staging

npm install -g firebase-tools

firebase deploy -P staging --token "$FIREBASE_DEPLOY_TOKEN"