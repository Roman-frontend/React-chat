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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpPage = void 0;
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const notistack_1 = require("notistack");
const styles_1 = require("@mui/material/styles");
const material_1 = require("@mui/material");
const Button_1 = __importDefault(require("@mui/material/Button"));
const system_1 = require("@mui/system");
const react_router_dom_1 = require("react-router-dom");
const validate_hook_js_1 = require("../../hooks/validate.hook.js");
const validateMethods_jsx_1 = require("../../components/Helpers/validateMethods.jsx");
const auth_hook_js_1 = require("../../hooks/auth.hook.js");
const SignUpForm_jsx_1 = require("../../components/SignUpForm/SignUpForm.jsx");
const queryes_1 = require("../../components/../GraphQLApp/queryes");
const Loader_jsx_1 = require("../../components/Helpers/Loader.jsx");
require("./auth-body.sass");
exports.SignUpPage = (0, react_1.memo)((props) => {
    const theme = (0, styles_1.useTheme)();
    const { auth } = (0, auth_hook_js_1.useAuth)();
    const { enqueueSnackbar } = (0, notistack_1.useSnackbar)();
    const { errors, validate } = (0, validate_hook_js_1.useValidate)({
        name: validateMethods_jsx_1.validateName,
        email: validateMethods_jsx_1.validateEmail,
        password: validateMethods_jsx_1.validatePassword,
    });
    const ref = {
        name: (0, react_1.useRef)(undefined),
        email: (0, react_1.useRef)(undefined),
        password: (0, react_1.useRef)(undefined),
    };
    const [register, { loading }] = (0, client_1.useMutation)(queryes_1.REGISTER, {
        update(cache, { data: { register } }) {
            cache.modify({
                fields: {
                    users(existingUsers = []) {
                        const newUserRef = cache.writeFragment({
                            data: register.record,
                            fragment: (0, client_1.gql) `
                fragment NewUser on User {
                  id
                  name
                  email
                }
              `,
                        });
                        return [...existingUsers, newUserRef];
                    },
                },
            });
        },
        onError(error) {
            console.log(`Некоректні дані при реєстрації ${error}`);
            enqueueSnackbar('Failed registration!', { variant: 'error' });
        },
        onCompleted(data) {
            if (data.register.status === 'OK') {
                auth(data.register.record);
            }
            enqueueSnackbar('Success registration!', { variant: 'success' });
        },
    });
    const handleSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        const formData = {
            name: ref.name.current.children[1].children[0].value,
            email: ref.email.current.children[1].children[0].value,
            password: String(ref.password.current.children[1].children[0].value),
        };
        ref.password.current.children[1].children[0].value = '';
        validate(formData);
        register({ variables: Object.assign({}, formData) });
    });
    return (<div style={{ display: 'flex', justifyContent: 'center' }}>
      <material_1.Paper sx={{
            position: 'relative',
            top: '15vh',
            background: theme.palette.primary.dark,
        }}>
        <span style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 25,
            margin: '20px 0px 0px',
        }}>
          Реєстрація
        </span>

        <SignUpForm_jsx_1.SignUpForm label='Name' placeholder='Введите имя' name='name' autoFocus={true} fieldError={errors.name} type='name' inputSignUpRef={ref.name}/>
        <SignUpForm_jsx_1.SignUpForm label='Email' placeholder='Введите email' name='email' fieldError={errors.email} type='email' inputSignUpRef={ref.email}/>
        <SignUpForm_jsx_1.SignUpForm label='Password' placeholder='Введите пароль' name='password' fieldError={errors.password} type='password' inputSignUpRef={ref.password}/>

        <system_1.Box style={{ display: 'flex' }}>
          <Button_1.default size='small' variant='contained' color='primary' style={{
            width: '9vw',
            margin: '15px',
        }} onClick={handleSubmit}>
            Register
          </Button_1.default>

          <react_router_dom_1.Link to={`/signIn`} style={{ textDecoration: 'none' }}>
            <Button_1.default size='small' color='secondary' variant='contained' sx={{ margin: '15px' }}>
              Has account go to login
            </Button_1.default>
          </react_router_dom_1.Link>
        </system_1.Box>

        {loading ? <Loader_jsx_1.AuthLoader /> : null}
      </material_1.Paper>
    </div>);
});
exports.default = exports.SignUpPage;
