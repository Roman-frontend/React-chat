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
exports.DrawTitles = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const styles_1 = require("@mui/styles");
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const KeyboardArrowDown_1 = __importDefault(require("@mui/icons-material/KeyboardArrowDown"));
const KeyboardArrowUp_1 = __importDefault(require("@mui/icons-material/KeyboardArrowUp"));
const Button_1 = __importDefault(require("@mui/material/Button"));
require("./user-sets.sass");
const styles = (theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
        fontSize: '4vh',
        textAlign: 'right',
        margin: 0,
    },
    buttonRoot: {
        padding: 0,
        width: '22px',
        minWidth: 0,
    },
});
exports.DrawTitles = (0, react_1.memo)((0, styles_1.withStyles)(styles)((props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { name, divClass, stateShowing, seterStateShowing, setModalAdd, classes, } = props;
    const channelsIconRef = (0, react_1.useRef)();
    const channelsTitleRef = (0, react_1.useRef)();
    const msgIconRef = (0, react_1.useRef)();
    const msgTitleRef = (0, react_1.useRef)();
    const stateIcon = stateShowing ? (<KeyboardArrowUp_1.default fontSize='large'/>) : (<KeyboardArrowDown_1.default fontSize='large'/>);
    const translationChannel = t('description.channelTitle');
    const iconRef = name === translationChannel ? channelsIconRef : msgIconRef;
    const titleRef = name === translationChannel ? channelsTitleRef : msgTitleRef;
    (0, react_1.useEffect)(() => {
        function addEvent(focusedElement, elementForDraw = null) {
            const eventElement = elementForDraw ? elementForDraw : focusedElement;
            focusedElement.current.addEventListener('mouseover', () => {
                eventElement.current.classList.add('left-bar__title_active');
            });
            focusedElement.current.addEventListener('mouseout', () => {
                eventElement.current.classList.remove('left-bar__title_active');
            });
        }
        addEvent(iconRef);
        addEvent(titleRef, iconRef);
    }, []);
    return (<div className={(classes.root, divClass)}>
        <Grid_1.default container className='left-bar__title-name'>
          <Grid_1.default item xs={1} ref={iconRef} style={{ margin: '0px 12px 0px 14px' }} onClick={() => seterStateShowing(!stateShowing)}>
            {stateIcon}
          </Grid_1.default>
          <Grid_1.default item xs={8} ref={titleRef} onClick={() => seterStateShowing(!stateShowing)}>
            {name}
          </Grid_1.default>
          <Grid_1.default item xs={1} style={{ font: '2rem serif' }} onClick={() => setModalAdd(true)}>
            <Button_1.default variant='outlined' color='primary' size='small' style={{ background: 'white' }} classes={{ root: classes.buttonRoot }}>
              +
            </Button_1.default>
          </Grid_1.default>
        </Grid_1.default>
      </div>);
}));
