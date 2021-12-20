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
exports.AddPeopleToChannel = void 0;
const react_1 = __importStar(require('react'));
const react_modal_1 = __importDefault(require('react-modal'));
const client_1 = require('@apollo/client');
const styles_1 = require('@mui/material/styles');
const styles_2 = require('@mui/styles');
const Dialog_1 = __importDefault(require('@mui/material/Dialog'));
const DialogTitle_1 = __importDefault(require('@mui/material/DialogTitle'));
const SelectPeople_jsx_1 = require('../SelectPeople/SelectPeople.jsx');
const queryes_1 = require('../../../GraphQLApp/queryes');
const queryes_2 = require('../../SetsUser/SetsUserGraphQL/queryes');
const reactiveVars_js_1 = require('../../../GraphQLApp/reactiveVars');
react_modal_1.default.setAppElement('#root');
const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});
exports.AddPeopleToChannel = (0, styles_2.withStyles)(styles)((props) => {
  const {
    chatNameRef,
    isErrorInPopap,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    doneInvite,
    classes,
  } = props;
  const theme = (0, styles_1.useTheme)();
  const { data: auth } = (0, client_1.useQuery)(queryes_1.AUTH);
  const { data: dChannels } = (0, client_1.useQuery)(queryes_2.CHANNELS);
  const { data: allUsers } = (0, client_1.useQuery)(queryes_1.GET_USERS);
  const notInvitedRef = (0, react_1.useRef)();
  const activeChannelId = (0, client_1.useReactiveVar)(
    reactiveVars_js_1.activeChatId
  ).activeChannelId;
  (0, react_1.useEffect)(() => {
    var _a;
    if (allUsers && allUsers.users && auth && auth.id) {
      let allNotInvited = allUsers.users.filter((user) => user.id !== auth.id);
      if (
        activeChannelId &&
        ((_a =
          dChannels === null || dChannels === void 0
            ? void 0
            : dChannels.userChannels) === null || _a === void 0
          ? void 0
          : _a.length)
      ) {
        dChannels.userChannels.forEach((channel) => {
          if (channel && channel.id === activeChannelId) {
            channel.members.forEach((memberId) => {
              allNotInvited = allNotInvited.filter((user) => {
                return user.id !== memberId;
              });
            });
          }
        });
      }
      notInvitedRef.current = allNotInvited;
      //notInvitedRef.current = allUsers.users;
    }
  }, [allUsers, dChannels, auth, activeChannelId]);
  const closePopap = () => {
    setModalAddPeopleIsOpen(false);
  };
  return (
    <>
      <Dialog_1.default
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        open={modalAddPeopleIsOpen}
        onClose={() => setModalAddPeopleIsOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle_1.default
          id='form-dialog-title'
          classes={{ root: classes.titleRoot }}
        >
          Invite people to #{chatNameRef.current}
        </DialogTitle_1.default>
        <SelectPeople_jsx_1.SelectPeople
          closePopap={closePopap}
          isErrorInPopap={isErrorInPopap}
          notInvitedRef={notInvitedRef.current}
          done={doneInvite}
        />
      </Dialog_1.default>
    </>
  );
});
