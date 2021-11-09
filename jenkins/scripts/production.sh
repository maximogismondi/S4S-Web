#!/usr/bin/env sh

npm run build

npm install -g firebase-tools

firebase deploy --only hosting --token "$FIREBASE_DEPLOY_TOKEN"