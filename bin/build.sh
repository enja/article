#!/bin/bash
if [ -d "www" ]; then
  echo 'Deleting www dir...'
  rm -r www
fi
echo 'build CSS and JavaScript...'
npm run build-css
echo 'Run harp compile...'
harp compile
echo 'You are good to go!'
