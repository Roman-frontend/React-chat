"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidate = void 0;
const react_1 = require("react");
const ERROR_ALERT = 'Некоректні дані при реєстрації';
const useValidate = (validateFields) => {
    const [errors, setErrors] = (0, react_1.useState)({});
    const validate = (0, react_1.useCallback)((inputValue) => {
        let resultValidate = {};
        for (let fieldName in validateFields) {
            const validatedForm = validateFields[fieldName](inputValue[fieldName]);
            resultValidate[fieldName] = validatedForm;
        }
        resultValidate.isError = Object.values(resultValidate).find((value) => typeof value === 'string')
            ? ERROR_ALERT
            : false;
        setErrors(Object.assign({}, resultValidate));
    }, [validateFields]);
    return { errors, validate };
};
exports.useValidate = useValidate;
