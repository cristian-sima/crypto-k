#!/usr/bin/env sh

# Should be run in the nix-shell provided by shell.nix
# Make sure to run `npm install` on the first go

rm -f kadena-crypto.js
npm run build
browserify index.js --standalone lib \
   --exclude=./wordlists/japanese.json \
   --exclude=./wordlists/spanish.json \
   --exclude=./wordlists/italian.json \
   --exclude=./wordlists/french.json \
   --exclude=./wordlists/korean.json \
   --exclude=./wordlists/czech.json \
   --exclude=./wordlists/portuguese.json \
   --exclude=./wordlists/chinese_simplified.json \
   --exclude=./wordlists/chinese_traditional.json \
   > kadena-crypto.js
