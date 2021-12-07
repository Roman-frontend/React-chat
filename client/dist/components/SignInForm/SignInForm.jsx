"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInForm = void 0;
const react_1 = __importDefault(require("react"));
const formik_1 = require("formik");
const styles_1 = require("@mui/styles");
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const useStyles = (0, styles_1.makeStyles)((theme) => ({
    label: {
        margin: '0px 14px',
    },
}));
function SignInForm(props) {
    const { label, type, name, autoFocus } = props;
    const classes = useStyles();
    return (<div>
      <formik_1.Field name={name}>
        {(props) => {
            const { field, meta } = props;
            return (<>
              <TextField_1.default style={{ width: '33.7vw', margin: '2vh 0vw' }} variant='standard' InputLabelProps={{
                    classes: { standard: classes.label },
                }} label={label} color='input' 
            //зупиняє анімацію
            //InputLabelProps={{ shrink: true }}
            autoFocus={autoFocus} name={name} type={type} {...field} id='mui-theme-provider-standard-input'/>
            </>);
        }}
      </formik_1.Field>
      <formik_1.ErrorMessage name={name} render={(msg) => <div className='auth-form__error'>{msg}</div>}/>
    </div>);
}
exports.SignInForm = SignInForm;
