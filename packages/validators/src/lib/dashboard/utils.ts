export const formatDuration = (hours: number): string => {
  return hours.toFixed(1);
};

export const getAlertVariant = (
  urgent: boolean,
): "destructive" | "secondary" => {
  return urgent ? "destructive" : "secondary";
};
