#!/bin/bash
# Backup Verification Script
# Usage: ./verify-backup.sh [ARCHIVE_FILE_PATH]

set -e

if [ -z "$1" ]; then
  echo "Error: Archive file path required."
  echo "Usage: ./verify-backup.sh /path/to/archive.archive"
  exit 1
fi

ARCHIVE_FILE="$1"

echo "Verifying backup archive structure..."

# Use bsondump or mongorestore --dryRun to verify structure (simplified here to archive check)
if [ ! -f "$ARCHIVE_FILE" ]; then
    echo "Archive file not found: $ARCHIVE_FILE"
    exit 1
fi

# Print archive contents without restoring
mongorestore --archive="$ARCHIVE_FILE" --gzip --dryRun > /dev/null

echo "Archive integrity verified."
