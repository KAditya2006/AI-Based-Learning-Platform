#!/bin/bash
# MongoDB Restore Script
# Usage: ./restore-db.sh [ARCHIVE_FILE_PATH]

set -e

if [ -z "$1" ]; then
  echo "Error: Archive file path required."
  echo "Usage: ./restore-db.sh /path/to/archive.archive"
  exit 1
fi

ARCHIVE_FILE="$1"
MONGO_URI=${MONGODB_URI:-"mongodb://localhost:27017/mospi_skill_platform"}

echo "Starting MongoDB restore from $ARCHIVE_FILE..."

# Run mongorestore
mongorestore --uri="$MONGO_URI" --archive="$ARCHIVE_FILE" --gzip --drop

echo "Restore completed successfully."
