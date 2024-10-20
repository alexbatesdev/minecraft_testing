#!/bin/bash
# Backup script running inside Minecraft container with daily, weekly, and monthly backup rotation
# Written by AI assistant

BACKUP_DIR=/backups/daily
WEEKLY_BACKUP_DIR=/backups/weekly
MONTHLY_BACKUP_DIR=/backups/monthly
WORLD_DIR=/data/world
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DAY_OF_WEEK=$(date +%u)  # 1 = Monday, 7 = Sunday
DAY_OF_MONTH=$(date +%d)  # Day of the month (01, 02, ..., 31)

# Ensure the backup directories exist
mkdir -p $BACKUP_DIR
mkdir -p $WEEKLY_BACKUP_DIR
mkdir -p $MONTHLY_BACKUP_DIR

# Save the Minecraft world state in-game
/usr/local/bin/rcon-cli save-off   # Turn off world saving temporarily
/usr/local/bin/rcon-cli save-all   # Force-save the world
sleep 5             # Wait a few seconds to ensure save completes

# Create a backup of the world folder
tar -cvzf $BACKUP_DIR/minecraft_daily_$TIMESTAMP.tar.gz -C $WORLD_DIR .

# Re-enable saving in Minecraft
/usr/local/bin/rcon-cli save-on

# Delete daily backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -name "*.tar.gz" -exec rm {} \;

# If it's Sunday, create a weekly backup
if [ "$DAY_OF_WEEK" -eq 7 ]; then
    cp $BACKUP_DIR/minecraft_daily_$TIMESTAMP.tar.gz $WEEKLY_BACKUP_DIR/minecraft_weekly_$TIMESTAMP.tar.gz
    # Delete weekly backups older than 6 weeks
    find $WEEKLY_BACKUP_DIR -type f -mtime +42 -name "*.tar.gz" -exec rm {} \;
    
    # If it's the first Sunday of the month, save a monthly backup
    if [ "$DAY_OF_MONTH" -le 07 ]; then
        cp $BACKUP_DIR/minecraft_daily_$TIMESTAMP.tar.gz $MONTHLY_BACKUP_DIR/minecraft_monthly_$TIMESTAMP.tar.gz
        # Note: Monthly backups are not deleted, they stay forever
    fi
fi
