#!/bin/bash
read -p "Are you sure you want to wipe all data? This action cannot be undone. (yes/no): " confirmation

if [[ "$confirmation" == "yes" || "$confirmation" == "y" ]]; then
  rm ./answers/*.txt
  rm ./forms/*.txt
  echo "All data wiped."
else
  echo "Operation cancelled."
fi