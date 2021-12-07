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
exports.Channels = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const client_1 = require("@apollo/client");
const styles_1 = require("@mui/material/styles");
const styles_2 = require("@mui/styles");
const Button_1 = __importDefault(require("@mui/material/Button"));
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemIcon_1 = __importDefault(require("@mui/material/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const ExpandLess_1 = __importDefault(require("@mui/icons-material/ExpandLess"));
const ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
const Collapse_1 = __importDefault(require("@mui/material/Collapse"));
const SupervisedUserCircle_1 = __importDefault(require("@mui/icons-material/SupervisedUserCircle"));
const queryes_1 = require("../../SetsUser/SetsUserGraphQL/queryes");
const AddChannel_1 = require("../../Modals/AddChannel/AddChannel");
const Channel_1 = require("./Channel");
const nanoid_1 = require("nanoid");
const useStyles = (0, styles_2.makeStyles)((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
    },
}));
function Channels(props) {
    const { isOpenLeftBar, modalAddChannelIsOpen, setModalAddChannelIsOpen, isErrorInPopap, setIsErrorInPopap, } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    const theme = (0, styles_1.useTheme)();
    const classes = useStyles();
    const { data: allChannels } = (0, client_1.useQuery)(queryes_1.CHANNELS);
    const [open, setOpen] = (0, react_1.useState)(true);
    return (<>
      <div>
        <List_1.default component='nav' className={classes.root}>
          {isOpenLeftBar ? (<ListItem_1.default key={(0, nanoid_1.nanoid)()} style={{ paddingLeft: 0 }} button onClick={() => setOpen(!open)}>
              <ListItemIcon_1.default style={{ justifyContent: 'center' }}>
                <SupervisedUserCircle_1.default color='action'/>
              </ListItemIcon_1.default>
              <ListItemText_1.default style={{ textAlign: 'center' }} primary={t('description.channelTitle')}/>
              {open ? <ExpandLess_1.default /> : <ExpandMore_1.default />}
            </ListItem_1.default>) : (<ListItem_1.default key={(0, nanoid_1.nanoid)()} style={{ padding: 0, margin: 0, justifyContent: 'center' }} button onClick={() => setOpen(!open)}>
              <ListItemIcon_1.default style={{ padding: '0', justifyContent: 'center' }}>
                <SupervisedUserCircle_1.default color='action'/>
              </ListItemIcon_1.default>
            </ListItem_1.default>)}
          {allChannels ? (<Collapse_1.default in={open} timeout='auto' unmountOnExit>
              <List_1.default>
                {allChannels.userChannels.map((channel) => channel ? (<react_1.default.Fragment key={channel.id}>
                      <Channel_1.Channel channel={channel} isOpenLeftBar={isOpenLeftBar}/>
                    </react_1.default.Fragment>) : null)}
              </List_1.default>
            </Collapse_1.default>) : null}
        </List_1.default>
      </div>
      <Button_1.default size='small' sx={{
            width: '100%',
            padding: 0,
            '&:hover': { color: theme.palette.leftBarItem.light },
        }} color='warning' onClick={() => setModalAddChannelIsOpen(true)}>
        {isOpenLeftBar ? `+ ${t('description.addChannel')}` : '+'}
      </Button_1.default>
      <AddChannel_1.AddChannel modalAddChannelIsOpen={modalAddChannelIsOpen} setModalAddChannelIsOpen={setModalAddChannelIsOpen} isErrorInPopap={isErrorInPopap} setIsErrorInPopap={setIsErrorInPopap}/>
    </>);
}
exports.Channels = Channels;
