export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  
  // If the date is today
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
  
  // If the date is within the last 7 days
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 7) {
    return d.toLocaleDateString('en-US', { 
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Otherwise show the full date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export function getEmailCategory(category?: string): {
  label: string;
  color: 'success' | 'error' | 'warning' | 'info' | 'primary';
} {
  switch (category?.toLowerCase()) {
    case 'interested':
      return { label: 'Interested', color: 'success' };
    case 'meeting_booked':
      return { label: 'Meeting Booked', color: 'primary' };
    case 'not_interested':
      return { label: 'Not Interested', color: 'error' };
    case 'out_of_office':
      return { label: 'Out of Office', color: 'info' };
    default:
      return { label: 'Spam', color: 'warning' };
  }
}