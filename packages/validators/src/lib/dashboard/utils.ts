export const formatDuration = (hours: number): string => {
  return hours.toFixed(1);
};

export const getAlertColor = (urgent: boolean): string => {
  return urgent ? "#EF4444" : "#6B7280";
};

export const getAlertBackgroundColor = (urgent: boolean): string => {
  return urgent ? "#FEF2F2" : "#F3F4F6";
};
