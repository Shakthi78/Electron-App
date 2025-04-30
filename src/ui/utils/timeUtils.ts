/**
 * Format time in 12-hour format with AM/PM
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date as "Day, Month Date, Year"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get time for a specific timezone
 */
export function getTimeInTimezone(timezone: string): Date {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  };
  
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);
  
  let hour = 0, minute = 0, second = 0;
  
  for (const part of parts) {
    if (part.type === 'hour') {
      hour = parseInt(part.value);
    } else if (part.type === 'minute') {
      minute = parseInt(part.value);
    } else if (part.type === 'second') {
      second = parseInt(part.value);
    }
  }
  
  const newDate = new Date();
  newDate.setHours(hour, minute, second);
  return newDate;
}

/**
 * Format time in 24-hour format for timezone display
 */
export function formatTimeForTimezone(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Calculate minutes until next meeting
 */
export function getMinutesUntilMeeting(meetingStartTime: Date): number {
  const now = new Date();
  const diffMs = meetingStartTime.getTime() - now.getTime();
  return Math.floor(diffMs / 60000); // Convert ms to minutes
}

/**
 * Format minutes as human-readable time
 */
export function formatMinutesAsTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}