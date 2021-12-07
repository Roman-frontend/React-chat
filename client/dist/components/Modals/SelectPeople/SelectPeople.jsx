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
exports.SelectPeople = void 0;
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const styled_1 = __importDefault(require("@emotion/styled"));
const material_1 = require("@mui/material");
const Box_1 = __importDefault(require("@mui/material/Box"));
const FormControl_1 = __importDefault(require("@mui/material/FormControl"));
const DialogActions_1 = __importDefault(require("@mui/material/DialogActions"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const react_dropdown_select_1 = __importDefault(require("react-dropdown-select"));
const styles_1 = require("@mui/material/styles");
const queryes_1 = require("../../../GraphQLApp/queryes");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const StyledBadge_1 = require("../../Helpers/StyledBadge");
//коли відкриваю попап створення чату і нічого не заповняю, нажимаю done і воно просто закриває попап має показати шо є якісь обовязкові поля
const StyledSelect = (0, styled_1.default)(react_dropdown_select_1.default) `
  ${({ dropdownRenderer }) => dropdownRenderer &&
    `
		.react-dropdown-select-dropdown {
			overflow: initial;
		}
	`}
`;
const SelectPeople = (props) => {
    const { isDialogChanged, closePopap, done, isErrorInPopap, notInvitedRef } = props;
    const theme = (0, styles_1.useTheme)();
    const [list, setList] = (0, react_1.useState)(notInvitedRef);
    const [invited, setInvited] = (0, react_1.useState)([]);
    const [minHeight, setMinHeight] = (0, react_1.useState)(120);
    const { data: allUsers } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const usersOnline = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveOnlineMembers);
    const styles = {
        root: {
            minWidth: '400px',
            minHeight,
            maxHeight: '300px',
            margin: '0 auto',
            overflowY: 'hidden',
        },
        dialogContent: {
            padding: isDialogChanged ? '8px 24px' : 0,
        },
    };
    function todo() {
        done('done', invited /* invitedRef.current */);
    }
    function addPeopleToInvited(selected, addMethod) {
        addMethod(selected);
        const selectedIndex = list.indexOf(selected);
        if (allUsers && allUsers.users && allUsers.users[0]) {
            const electData = allUsers.users.filter((user) => user.id === selected.id);
            setList((prevList) => {
                prevList.splice(selectedIndex, 1);
                return prevList;
            });
            setInvited((prev) => prev.concat(electData[0].id));
            //invitedRef.current = invitedRef.current.concat(electData[0].id);
        }
    }
    const itemRenderer = ({ item, itemIndex, props, state, methods }) => (<Box_1.default key={item.id} sx={{
            background: theme.palette.primary.main,
            '&:hover': { background: theme.palette.primary.dark },
        }} onClick={() => addPeopleToInvited(item, methods.addItem)}>
      <div style={{ margin: '10px' }}>
        <StyledBadge_1.StyledBadgeWraper variant={usersOnline.includes(item.id) ? 'dot' : 'standard'} styleBadge={{ margin: '0px 10px 0px 0px' }} name={item.email}/>
        {item.email}
      </div>
    </Box_1.default>);
    return (<div style={styles.root}>
      <StyledSelect placeholder='Select peoples' required={true} searchBy={'email'} separator={true} clearable={true} searchable={true} dropdownHandle={true} dropdownHeight={'120px'} direction={'ltr'} multi={true} labelField={'email'} valueField={'email'} options={list} dropdownGap={5} keepSelectedInList={true} onDropdownOpen={() => setMinHeight(240)} onDropdownClose={() => setMinHeight(120)} onClearAll={() => undefined} onSelectAll={() => undefined} noDataLabel='No matches found' closeOnSelect={false} dropdownPosition={'bottom'} itemRenderer={itemRenderer}/>
      {isErrorInPopap ? (<p style={{
                fontSize: 12,
                paddingLeft: 4,
                marginTop: 6,
                color: 'red',
                fontWeight: 600,
            }}>
          required
        </p>) : null}
      <DialogContent_1.default classes={{ root: styles.dialogContent }} style={{ position: 'absolute', bottom: 0 }}>
        <FormControl_1.default>
          <DialogActions_1.default>
            <material_1.Button size='small' variant='contained' color='error' onClick={closePopap}>
              Close
            </material_1.Button>
            <material_1.Button size='small' variant='contained' color='secondary' onClick={todo}>
              Add
            </material_1.Button>
          </DialogActions_1.default>
        </FormControl_1.default>
      </DialogContent_1.default>
    </div>);
};
exports.SelectPeople = SelectPeople;
