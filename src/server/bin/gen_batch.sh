#!/bin/bash

# Check if correct number of arguments passed
if [ $# -ne 4 ]; then
  echo "Please provide 4 arguments: a directory, a number, start year and end year."
  exit 1
fi

# Directory where the GeoJSON files are located
dir=$1

# Log directory
logdir="logs"

# Get input parameters
num=$2
start_year=$3
end_year=$4

# Loop through all .geojson files in the directory
for filepath in "$dir"/*.geojson
do
  # Extract the filename from the path
  filename=$(basename "$filepath")

  # Extract the filename without the .geojson extension
  base="${filename%.geojson}"

  # Form the output file name
  password="$base"_xpto

#  echo "$filepath" "$base" "$num" "$password" "$start_year" "$end_year"
  # Run the node script in the background with nohup and output redirected to a log file
  nohup node import_points.js "$filepath" "$base" "$num" "$password" "$start_year" "$end_year" > "$logdir/$base.log" 2>&1 &
done
