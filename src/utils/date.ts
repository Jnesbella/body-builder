export const dateToUTCString = (date: Date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export const utcStringToDate = (utcString: string) => {
  // Split timestamp into [ Y, M, D, h, m, s ]
  const parts = utcString.split(/[- :]/);

  // Apply each element to the Date function
  const date = new Date(
    Date.UTC(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10),
      parseInt(parts[3], 10),
      parseInt(parts[4], 10),
      parseInt(parts[5], 10)
    )
  );

  return date;
};
