export const getDate = (timestampOrStr) => {
  let parsedDate = timestampOrStr;

  // Convert timestamp to number
  if (/^\d*$/.test(parsedDate)) {
    parsedDate = Number(parsedDate);
  }

  return new Date(parsedDate);
};