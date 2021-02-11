exports.formatYupError = (err) => {
  const errors = [];
  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  console.log(errors);
  return errors;
  /* return {
    errors: errors[0].message,
    name: 'errorName',
    email: 'errorEmail',
    password: 'errorPassword',
    id: 'null',
  }; */
};
