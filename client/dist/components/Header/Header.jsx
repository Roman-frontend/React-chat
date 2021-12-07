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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
require("tippy.js/dist/tippy.css");
const styles_1 = require("@mui/material/styles");
const Tooltip_1 = __importStar(require("@mui/material/Tooltip"));
const Zoom_1 = __importDefault(require("@mui/material/Zoom"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Toolbar_1 = __importDefault(require("@mui/material/Toolbar"));
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Menu_1 = __importDefault(require("@mui/icons-material/Menu"));
const material_1 = require("@mui/material");
const Avatar_1 = __importDefault(require("@mui/material/Avatar"));
const Drawer_1 = __importDefault(require("@mui/material/Drawer"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const HeaderProfile_jsx_1 = __importDefault(require("./HeaderProfile/HeaderProfile.jsx"));
const HeaderStyles_jsx_1 = require("./HeaderStyles.jsx");
const App_1 = require("../../App");
const User_Icon_png_1 = __importDefault(require("../../images/User-Icon.png"));
const BootstrapTooltip = (0, styles_1.styled)((_a) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<Tooltip_1.default {...props} arrow classes={{ popper: className }}/>);
})(({ theme }) => ({
    [`& .${Tooltip_1.tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${Tooltip_1.tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));
function Header(props) {
    const theme = (0, styles_1.useTheme)();
    const { isOpenLeftBar, setIsOpenLeftBar } = props;
    const { currentTheme, setTheme } = (0, react_1.useContext)(App_1.CustomThemeContext);
    const menuId = 'primary-search-account-menu';
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const [isOpenRightBarUser, setIsOpenRightBarUser] = (0, react_1.useState)(false);
    const [language, setLanguage] = (0, react_1.useState)('en');
    const isDark = Boolean(currentTheme === 'dark');
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setLanguage(language);
    };
    const handleChangeSwitch = (event) => {
        const { checked } = event.target;
        if (!checked) {
            setTheme('dark');
        }
        else {
            setTheme('light');
        }
    };
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')) {
            return null;
        }
        setIsOpenRightBarUser(open);
    };
    return (<material_1.Grid container spacing={1} style={{ justifyContent: 'space-between' }}>
      <HeaderStyles_jsx_1.AppBar color='primary' sx={{
            '& .MuiAppBar-colorPrimary': {
                color: theme.palette.primary.dark,
            },
            background: theme.palette.primary.dark,
        }} position='relative' open={isOpenLeftBar}>
        <Toolbar_1.default>
          <IconButton_1.default onClick={() => setIsOpenLeftBar(!isOpenLeftBar)} edge='start'>
            <Menu_1.default />
          </IconButton_1.default>
          <material_1.Grid item xs={9}>
            <Typography_1.default variant='h6' noWrap component='div'>
              {t('description.header')}
            </Typography_1.default>
          </material_1.Grid>
          <material_1.Grid item xs={2}>
            <HeaderStyles_jsx_1.MaterialUISwitch sx={{ m: 1 }} checked={!isDark} onChange={handleChangeSwitch}/>
          </material_1.Grid>
          <material_1.Grid item xs={1}>
            <BootstrapTooltip title={language === 'en'
            ? t('description.infoLanguage')
            : t('description.changeEnLanguage')} TransitionComponent={Zoom_1.default} placement='bottom'>
              <Button_1.default style={{
            background: language === 'en' && theme.palette.primary.main,
            border: language === 'en' && 'solid 2px',
            padding: 0,
        }} color='inherit' onClick={() => changeLanguage('en')}>
                EN
              </Button_1.default>
            </BootstrapTooltip>
          </material_1.Grid>
          <material_1.Grid item xs={1}>
            <BootstrapTooltip title={language === 'ru'
            ? t('description.infoLanguage')
            : t('description.changeRuLanguage')} TransitionComponent={Zoom_1.default} placement='bottom'>
              <Button_1.default style={{
            background: language === 'ru' && theme.palette.primary.main,
            border: language === 'ru' && 'solid 2px',
            padding: 0,
        }} color='inherit' onClick={() => changeLanguage('ru')}>
                RU
              </Button_1.default>
            </BootstrapTooltip>
          </material_1.Grid>
          <material_1.Grid item xs={1}>
            <IconButton_1.default size='large' edge='end' aria-label='account of current user' aria-controls={menuId} aria-haspopup='true' onClick={toggleDrawer(true)}>
              <Avatar_1.default alt='Remy Sharp' src={User_Icon_png_1.default}/>
            </IconButton_1.default>
          </material_1.Grid>
          <div>
            <react_1.default.Fragment>
              <Drawer_1.default anchor='right' sx={{
            '& .MuiDrawer-paperAnchorRight': {
                background: theme.palette.primary.main,
            },
        }} open={isOpenRightBarUser} onClose={toggleDrawer(false)}>
                <Box_1.default sx={{ width: 250, margin: '56px 0px 0px 0px' }} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                  <HeaderProfile_jsx_1.default />
                </Box_1.default>
              </Drawer_1.default>
            </react_1.default.Fragment>
          </div>
        </Toolbar_1.default>
      </HeaderStyles_jsx_1.AppBar>
    </material_1.Grid>);
}
exports.default = Header;
