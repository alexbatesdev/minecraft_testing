# Minecraft server Dockerfile

# Base image (adjust to your needs)
FROM itzg/minecraft-server:java21

# Switch to root user to install packages
USER root

RUN apt-get update && apt-get install -y tzdata

ENV TZ=America/Denver
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install cron
RUN apt-get update && apt-get install -y cron

# Copy the backup script into the container
COPY backup.sh /minecraft/backup.sh

# Make the script executable
RUN chmod +x /minecraft/backup.sh

# Add the cron job for daily execution at 2 AM
RUN (crontab -l; echo "0 2 * * * /minecraft/backup.sh >> /var/log/minecraft_backup.log 2>&1") | crontab -

# Start cron in the foreground so the container keep running (cron + minecraft server)
# CMD cron && /start
ENTRYPOINT ["sh", "-c", "cron && /start"]
# CMD tail -f /dev/null
# ENTRYPOINT ["tail", "-f", "/dev/null"]