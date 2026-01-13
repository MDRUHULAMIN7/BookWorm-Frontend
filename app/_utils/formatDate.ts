import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    relative: formatDistanceToNow(date, { addSuffix: true }),
    absolute: format(date, 'MMM dd, yyyy HH:mm'),
  };
};
