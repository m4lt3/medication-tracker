#!/usr/bin/bash

echo "const fileList = [" >> dist/sw.js;

for file in dist/*; do
  if [[ "${file##*/}" == "assets" ]]; then
    echo "skipping $file"
  elif [[ "${file##*/}" == "sw.js" ]]; then
    echo "skipping $file"
  else
    echo "\"./${file##*/}\"," >> dist/sw.js
  fi
done

for file in dist/assets/*; do
  echo "\"./assets/${file##*/}\"," >> dist/sw.js
done

echo "];" >> dist/sw.js
