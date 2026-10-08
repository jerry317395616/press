#!/usr/bin/env bash
set -euo pipefail

umask 077
destination=/home/zyd/frappe/press-deployment/backups/app-server
mkdir -p "$destination"

rsync -am \
  --chmod=Du=rwx,Dgo=,Fu=rw,Fgo= \
  --include='*/' \
  --include='**/private/backups/***' \
  --exclude='*' \
  root@10.144.133.12:/home/frappe/benches/ \
  "$destination/"
