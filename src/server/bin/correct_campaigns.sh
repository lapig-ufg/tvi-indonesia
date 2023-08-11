#!/bin/bash

while read -r campaign; do
  # /APP/tvi/src/server/bin/correct_campaigns.log
  echo "$(date) - Calling: $campaign" >> /APP/tvi/src/server/bin/correct_campaigns.log
  #mongo tvi-indonesia --host 172.18.0.6 --eval 'var campaignId="'$campaign'";' correct_campaign.js > /dev/null 2>&1
  mongo tvi-indonesia --host 172.18.0.6 --eval 'var campaignId="'$campaign'";' correct_campaign.js >> /APP/tvi/src/server/bin/correct_campaigns.log
done < "$1"
