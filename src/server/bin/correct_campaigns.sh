#!/bin/bash

url_base="https://tvi-indonesia.lapig.iesa.ufg.br/service/campaign/correct?campaign="

while read -r campaign; do
  url="${url_base}${campaign}"
  echo "$(date) - Calling: $url" >> /APP/tvi/src/server/bin/correct_campaigns.log
  curl "$url" \
  -H 'Cookie: _ga_4TTCX3CVPZ=GS1.2.1689695661.1.0.1689695661.60.0.0; _ga_JKERHJR2YK=GS1.1.1689695700.1.1.1689696749.0.0.0; _ga_6MKZ8HZF31=GS1.1.1690468879.8.0.1690468879.0.0.0; _ga=GA1.1.1034410112.1688910116; _ga_9R6KJJQE1F=GS1.1.1690548599.2.1.1690548830.0.0.0; sid=s%3Aj89lghtcSHKJ8XRjInKIv-cJDRkigciY.6g4hd9M97CrtS9six16uG%2F8mH0yy6%2BWnOO8xjwibN1s' \
  > /dev/null 2>&1
done < "$1"
