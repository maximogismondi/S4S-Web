#!/usr/bin/env sh

npm run build 

npm install -g firebase-tools --ignore-engines

firebase deploy --only hosting --token "$FIREBASE_DEPLOY_TOKEN"