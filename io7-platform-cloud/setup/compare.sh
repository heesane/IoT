#!/bin/bash
folder='data'
[ $# -eq 1 ] && [ -d $1 ]  && folder=$1
for f in `find $folder -type f|grep -v '/flows.json'|grep -v '/dynamic-security.json'`; do echo $f ; diff -b $f ~/$f; done
