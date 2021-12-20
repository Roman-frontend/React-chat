'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Chat = void 0;
const react_1 = __importStar(require('react'));
const client_1 = require('@apollo/client');
const Box_1 = __importDefault(require('@mui/material/Box'));
const styles_1 = require('@mui/material/styles');
const CssBaseline_1 = __importDefault(require('@mui/material/CssBaseline'));
const Grid_1 = __importDefault(require('@mui/material/Grid'));
const reactiveVars_1 = require('../../GraphQLApp/reactiveVars');
const queryes_1 = require('../../GraphQLApp/queryes');
const Header_jsx_1 = __importDefault(require('../../components/Header/Header'));
const Conversation_jsx_1 = __importDefault(
  require('../../components/Conversation/Conversation.jsx')
);
const SetsUser_jsx_1 = __importDefault(
  require('../../components/SetsUser/SetsUser.jsx')
);
const registerUnload_1 = require('../../components/Helpers/registerUnload');
const queryes_2 = require('../../components/SetsUser/SetsUserGraphQL/queryes');
const Loader_1 = require('../../components/Helpers/Loader');
const reactiveVars_2 = require('../../GraphQLApp/reactiveVars');
const styles_js_1 = __importDefault(require('./styles'));
const Chat = () => {
  const usersOnline = (0, client_1.useReactiveVar)(
    reactiveVars_1.reactiveOnlineMembers
  );
  const activeChat = (0, client_1.useReactiveVar)(reactiveVars_2.activeChatId);
  const activeChannelId = (0, client_1.useReactiveVar)(
    reactiveVars_2.activeChatId
  ).activeChannelId;
  const activeDirectMessageId = (0, client_1.useReactiveVar)(
    reactiveVars_2.activeChatId
  ).activeDirectMessageId;
  const { loading: lUsers } = (0, client_1.useQuery)(queryes_1.GET_USERS);
  const { loading: lChannels, data: dChannels } = (0, client_1.useQuery)(
    queryes_2.CHANNELS
  );
  const { loading: lDms, data: dDms } = (0, client_1.useQuery)(
    queryes_2.GET_DIRECT_MESSAGES
  );
  const [isErrorInPopap, setIsErrorInPopap] = (0, react_1.useState)(false);
  const [isOpenLeftBar, setIsOpenLeftBar] = (0, react_1.useState)(true);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = (0, react_1.useState)(
    false
  );
  const [show, setShow] = (0, react_1.useState)(false);
  const [dataForBadgeInformNewMsg, setChatsHasNewMsgs] = (0, react_1.useState)(
    []
  );
  const [styles, setStyles] = (0, react_1.useState)({});
  const theme = (0, styles_1.useTheme)();
  (0, react_1.useEffect)(() => {
    setStyles((0, styles_js_1.default)(theme));
  }, [theme]);
  (0, react_1.useEffect)(() => {
    showConversation();
  }, [activeChat, modalAddPeopleIsOpen]);
  (0, react_1.useEffect)(() => {
    var _a, _b;
    if (
      (((_a =
        dChannels === null || dChannels === void 0
          ? void 0
          : dChannels.userChannels) === null || _a === void 0
        ? void 0
        : _a.length) ||
        ((_b =
          dDms === null || dDms === void 0 ? void 0 : dDms.directMessages) ===
          null || _b === void 0
          ? void 0
          : _b.length)) &&
      (activeChannelId || activeDirectMessageId)
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [activeChannelId, activeDirectMessageId, lChannels, lDms]);
  (0, react_1.useEffect)(() => {
    var _a, _b;
    if (
      !(
        ((_a =
          dChannels === null || dChannels === void 0
            ? void 0
            : dChannels.userChannels) === null || _a === void 0
          ? void 0
          : _a.length) ||
        ((_b =
          dDms === null || dDms === void 0 ? void 0 : dDms.directMessages) ===
          null || _b === void 0
          ? void 0
          : _b.length)
      )
    ) {
      setShow(false);
    }
  }, [dChannels, dDms]);
  (0, react_1.useEffect)(() => {
    const storage = JSON.parse(sessionStorage.getItem('storageData'));
    if (storage) (0, reactiveVars_1.reactiveVarPrevAuth)(storage);
    (0, registerUnload_1.registerOnlineUser)(usersOnline);
    (0, registerUnload_1.registerEnterPage)();
    return (0, registerUnload_1.registerUnloadPage)(
      'Leaving page',
      registerUnload_1.registerOfflineUser
    );
  }, []);
  const showConversation = () => {
    if (show) {
      return (
        <Conversation_jsx_1.default
          modalAddPeopleIsOpen={modalAddPeopleIsOpen}
          setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
          isErrorInPopap={isErrorInPopap}
          setIsErrorInPopap={setIsErrorInPopap}
          dataForBadgeInformNewMsg={dataForBadgeInformNewMsg}
          setChatsHasNewMsgs={setChatsHasNewMsgs}
        />
      );
    }
    return null;
  };
  if (lUsers && lChannels && lDms) {
    return <Loader_1.Loader />;
  }
  return (
    <Box_1.default style={styles.root}>
      <Grid_1.default container spacing={2} style={styles.workSpace}>
        <CssBaseline_1.default />
        <Grid_1.default item xs={12} style={styles.header}>
          <Header_jsx_1.default
            isOpenLeftBar={isOpenLeftBar}
            setIsOpenLeftBar={setIsOpenLeftBar}
          />
        </Grid_1.default>
        <SetsUser_jsx_1.default
          isErrorInPopap={isErrorInPopap}
          setIsErrorInPopap={setIsErrorInPopap}
          isOpenLeftBar={isOpenLeftBar}
          setIsOpenLeftBar={setIsOpenLeftBar}
          modalAddPeopleIsOpen={modalAddPeopleIsOpen}
          dataForBadgeInformNewMsg={dataForBadgeInformNewMsg}
          setChatsHasNewMsgs={setChatsHasNewMsgs}
        />
        <Box_1.default component='main' sx={styles.conversation}>
          <main>{showConversation()}</main>
        </Box_1.default>
      </Grid_1.default>
    </Box_1.default>
  );
};
exports.Chat = Chat;
