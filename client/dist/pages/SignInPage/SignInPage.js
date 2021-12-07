"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInPage = void 0;
const react_1 = __importStar(require("react"));
const formik_1 = require("formik");
const react_router_dom_1 = require("react-router-dom");
const client_1 = require("@apollo/client");
const notistack_1 = require("notistack");
const styles_1 = require("@mui/material/styles");
const material_1 = require("@mui/material");
const Button_1 = __importDefault(require("@mui/material/Button"));
const queryes_1 = require("../../components/../GraphQLApp/queryes");
const auth_hook_js_1 = require("../../hooks/auth.hook.js");
const SignInForm_jsx_1 = require("../../components/SignInForm/SignInForm.jsx");
const Loader_1 = require("../../components/Helpers/Loader");
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const Input_1 = __importDefault(require("@mui/material/Input"));
const InputLabel_1 = __importDefault(require("@mui/material/InputLabel"));
const InputAdornment_1 = __importDefault(require("@mui/material/InputAdornment"));
const FormControl_1 = __importDefault(require("@mui/material/FormControl"));
const VisibilityOff_1 = __importDefault(require("@mui/icons-material/VisibilityOff"));
const Visibility_1 = __importDefault(require("@mui/icons-material/Visibility"));
const system_1 = require("@mui/system");
const SignInPage = ({ route }) => {
    const { enqueueSnackbar } = (0, notistack_1.useSnackbar)();
    const theme = (0, styles_1.useTheme)();
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [valuess, setValuess] = (0, react_1.useState)({
        password: '',
        showPassword: false,
    });
    const prevHandleChange = (prop) => (event) => {
        setValuess(Object.assign(Object.assign({}, valuess), { [prop]: event.target.value }));
    };
    const prevHandleClickShowPassword = () => {
        setValuess(Object.assign(Object.assign({}, valuess), { showPassword: !valuess.showPassword }));
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const { auth } = (0, auth_hook_js_1.useAuth)();
    const [loginData, setLoginData] = (0, react_1.useState)({ email: '', password: '' });
    const [stopLogin, setStopLogin] = (0, react_1.useState)(true);
    const { loading, refetch } = (0, client_1.useQuery)(queryes_1.LOGIN, {
        //Вимкнути автоматичний логін
        skip: stopLogin,
        variables: { email: loginData.email, password: loginData.password },
        //variables: { email: 'test@mail.ru', password: '11111111' },
        onError(error) {
            console.log(`Помилка авторизації ${error}`);
            enqueueSnackbar('Fail login', { variant: 'error' });
        },
        onCompleted(data) {
            if (data.login.status === 'OK') {
                auth(data.login.record);
                enqueueSnackbar('Successful login', { variant: 'success' });
            }
            else {
                enqueueSnackbar(data.login.error.message, { variant: 'error' });
            }
        },
    });
    const onSubmit = (values, { resetForm }) => {
        try {
            setLoginData({ email: values.email, password: valuess.password });
            resetForm({
                values: {
                    email: values.email,
                    password: '',
                },
            });
            setStopLogin(false);
            refetch();
        }
        catch (e) {
            console.error('Помилочка : ', e);
        }
    };
    return (<div style={{ display: 'flex', justifyContent: 'center' }}>
      <material_1.Paper sx={{
            position: 'relative',
            top: '15vh',
            background: theme.palette.primary.dark,
        }}>
        <formik_1.Formik initialValues={{ email: '', password: '' }} onSubmit={onSubmit}>
          <formik_1.Form>
            <span style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 25,
            margin: '20px 0px 0px',
        }}>
              Авторизація
            </span>

            <SignInForm_jsx_1.SignInForm label='Email' name='email' type='email' autoFocus={true}/>
            <>
              <formik_1.Field name='password'>
                {(props) => {
            return (<>
                      <FormControl_1.default name='password' style={{ width: '33.7vw' }} id='password' color='input'>
                        <InputLabel_1.default>Password</InputLabel_1.default>
                        <Input_1.default type={valuess.showPassword ? 'text' : 'password'} 
            //value={values.password}
            onChange={prevHandleChange('password')} endAdornment={<InputAdornment_1.default position='end'>
                              <IconButton_1.default aria-label='toggle password visibility' onClick={prevHandleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                {valuess.showPassword ? (<Visibility_1.default />) : (<VisibilityOff_1.default />)}
                              </IconButton_1.default>
                            </InputAdornment_1.default>}/>
                      </FormControl_1.default>
                    </>);
        }}
              </formik_1.Field>
            </>
            <formik_1.ErrorMessage name='password' render={(msg) => <div className='auth-form__error'>{msg}</div>}/>
            <system_1.Box style={{ display: 'flex' }}>
              <Button_1.default size='small' variant='contained' color='primary' style={{
            width: '9vw',
            margin: '15px',
        }} type='submit'>
                Enter
              </Button_1.default>

              <react_router_dom_1.Link to={`/signUp`} style={{ textDecoration: 'none' }}>
                <Button_1.default size='small' color='secondary' variant='contained' sx={{ margin: '15px' }}>
                  Go to register
                </Button_1.default>
              </react_router_dom_1.Link>
            </system_1.Box>
            {loading ? <Loader_1.AuthLoader /> : null}
          </formik_1.Form>
        </formik_1.Formik>
      </material_1.Paper>
    </div>);
};
exports.SignInPage = SignInPage;
