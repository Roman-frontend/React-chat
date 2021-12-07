"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpForm = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("@mui/styles");
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const material_1 = require("@mui/material");
require("./auth-form.sass");
const useStyles = (0, styles_1.makeStyles)((theme) => ({
    inputIsValidated: {
        color: material_1.colors.lime[900],
    },
    inputIsNotValidated: {
        color: material_1.colors.red[900],
    },
    label: {
        margin: '0px 14px',
    },
}));
function SignUpForm(props) {
    const { label, type, name, fieldError = true, inputSignUpRef, autoFocus = false, } = props;
    const classes = useStyles();
    const isError = fieldError === undefined || fieldError === true ? false : true;
    return (<div>
      <TextField_1.default style={{ width: '33.7vw' }} label={label} name={name} type={type} InputLabelProps={{
            classes: { standard: classes.label },
        }} autoFocus={autoFocus} ref={inputSignUpRef} error={isError} size='small' variant='standard'/>
      <p className={isError ? 'auth-form__error' : null}>{fieldError}</p>
    </div>);
}
exports.SignUpForm = SignUpForm;
