#!/bin/sh

rm -r dist
mkdir dist

cp .eslintrc.js dist/
cp .prettierrc dist/
cp codegen.yml dist/
cp -r webpack dist/webpack
cp -r src dist
