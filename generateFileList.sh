#!/usr/bin/bash

echo "" > fileList.txt;

for file in dist/*; do
  echo "\"./${file##*/}\"," >> fileList.txt
done

for file in dist/assets/*; do
  echo "\"./assets/${file##*/}\"," >> fileList.txt
done
