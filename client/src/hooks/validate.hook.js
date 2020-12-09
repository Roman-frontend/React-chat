import { useState, useCallback } from 'react';

export const useValidate = (validateFields) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    (inputValue) => {
      let resultValidate = {};

      for (let fieldName in validateFields) {
        const validatedForm = validateFields[fieldName](inputValue[fieldName]);
        resultValidate[fieldName] = validatedForm;
      }

      setErrors({ ...resultValidate });
    },
    [validateFields]
  );

  return { errors, validate };
};
