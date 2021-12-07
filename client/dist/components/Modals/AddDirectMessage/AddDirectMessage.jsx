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
exports.AddDirectMessage = void 0;
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const styles_1 = require("@mui/material/styles");
const styles_2 = require("@mui/styles");
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
const queryes_1 = require("../../../GraphQLApp/queryes");
const SelectPeople_jsx_1 = require("../SelectPeople/SelectPeople.jsx");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const queryes_2 = require("../../SetsUser/SetsUserGraphQL/queryes");
const styles = (theme) => ({
    titleRoot: {
        padding: '24px 16px 0px 16px',
    },
});
exports.AddDirectMessage = (0, styles_2.withStyles)(styles)((props) => {
    const { data: dUsers } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const { data: dDms } = (0, client_1.useQuery)(queryes_2.GET_DIRECT_MESSAGES);
    const { done, classes, modalAddDmIsOpen, setModalAddDmIsOpen, isErrorInPopap, } = props;
    const theme = (0, styles_1.useTheme)();
    const closePopap = () => {
        setModalAddDmIsOpen(false);
    };
    const listNotInvited = (0, react_1.useMemo)(() => {
        var _a, _b;
        if (((_a = dUsers === null || dUsers === void 0 ? void 0 : dUsers.users) === null || _a === void 0 ? void 0 : _a.length) && (0, reactiveVars_1.reactiveVarId)()) {
            let allNotInvited = dUsers.users.filter((user) => user.id !== (0, reactiveVars_1.reactiveVarId)());
            if ((_b = dDms === null || dDms === void 0 ? void 0 : dDms.directMessages) === null || _b === void 0 ? void 0 : _b.length) {
                dDms.directMessages.forEach((directMessage) => {
                    directMessage.members.forEach((memberId) => {
                        allNotInvited = allNotInvited.filter((user) => user.id !== memberId);
                    });
                });
            }
            return allNotInvited;
            //return dUsers.users;
        }
    }, [dUsers, dDms, (0, reactiveVars_1.reactiveVarId)()]);
    return (<>
      <Dialog_1.default open={modalAddDmIsOpen} onClose={() => setModalAddDmIsOpen(false)} sx={{
            '& .MuiDialog-paper': {
                backgroundColor: theme.palette.primary.main,
            },
        }}>
        <DialogTitle_1.default id='form-dialog-title' classes={{ root: classes.titleRoot }}>
          Invite people to {(0, reactiveVars_1.reactiveVarName)()}
        </DialogTitle_1.default>
        <SelectPeople_jsx_1.SelectPeople closePopap={closePopap} notInvitedRef={listNotInvited} done={done} isErrorInPopap={isErrorInPopap}/>
      </Dialog_1.default>
    </>);
});
