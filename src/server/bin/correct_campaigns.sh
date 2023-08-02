#!/bin/bash

url_base="https://tvi-indonesia.lapig.iesa.ufg.br/service/campaign/correct?campaignId="

while read -r campaign; do
#  url="${url_base}${campaign}"
#  echo  "$url"
#  echo "$(date) - Calling: $url" >> /APP/tvi/src/server/bin/correct_campaigns.log
#  curl "$url" > /dev/null 2>&1
done < "$1"
