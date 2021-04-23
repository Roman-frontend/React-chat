export const messageDate = (date = Date.now()) => {
  const rowDate = new Date(parseInt(date));
  let result = '';
  result +=
    rowDate.getHours() +
    ':' +
    rowDate.getMinutes() +
    ':' +
    rowDate.getSeconds();
  return result;
};
