#!/bin/bash
# MongoDB Backup Script
# Usage: ./backup-db.sh [BACKUP_DIR]

set -e

BACKUP_DIR=${1:-"/var/backups/mospi_skill_platform"}
MONGO_URI=${MONGODB_URI:-"mongodb://localhost:27017/mospi_skill_platform"}
DATE=$(date +%Y-%m-%d_%H-%M-%S)
TARGET_FILE="$BACKUP_DIR/mospi_backup_$DATE.archive"

echo "Starting MongoDB backup to $TARGET_FILE..."

# Ensure directory exists
mkdir -p "$BACKUP_DIR"

# Run mongodump
mongodump --uri="$MONGO_URI" --archive="$TARGET_FILE" --gzip

echo "Backup completed successfully."
