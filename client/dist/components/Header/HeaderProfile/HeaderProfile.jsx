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
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemIcon_1 = __importDefault(require("@mui/material/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const Avatar_1 = __importDefault(require("@mui/material/Avatar"));
const MeetingRoom_1 = __importDefault(require("@mui/icons-material/MeetingRoom"));
const auth_hook_js_1 = require("../../../hooks/auth.hook.js");
const App_1 = require("../../../App");
const queryes_1 = require("../../../GraphQLApp/queryes");
const User_Icon_png_1 = __importDefault(require("../../../images/User-Icon.png"));
const HeaderProfile = (props) => {
    const { setTheme } = (0, react_1.useContext)(App_1.CustomThemeContext);
    const { data: auth } = (0, client_1.useQuery)(queryes_1.AUTH);
    const { logout } = (0, auth_hook_js_1.useAuth)();
    const client = (0, client_1.useApolloClient)();
    function handleLogout() {
        //client.resetStore()  Найпростіший спосіб переконатися, що стан інтерфейсу користувача та сховища відображає поточні дозволи користувача - це зателефонувати client.resetStore () після завершення процесу входу або виходу. Це призведе до очищення сховища та перегляду всіх активних запитів.
        client.clearStore(); //Якщо ви просто хочете, щоб магазин був очищений, і ви не хочете отримувати активні запити, використовуйте замість цього client.clearStore (). Інший варіант - перезавантажити сторінку, що матиме подібний ефект.
        setTheme('light');
        logout();
    }
    return (<List_1.default>
      <ListItem_1.default button>
        <ListItemIcon_1.default>
          <Avatar_1.default alt='Remy Sharp' src={User_Icon_png_1.default} style={{ size: '5px' }}/>
        </ListItemIcon_1.default>
        <ListItemText_1.default primary={auth && auth.name ? auth.name : '#general'}/>
      </ListItem_1.default>
      <ListItem_1.default button onClick={handleLogout}>
        <ListItemIcon_1.default>
          <MeetingRoom_1.default />
        </ListItemIcon_1.default>
        <ListItemText_1.default primary='Logout'/>
      </ListItem_1.default>
    </List_1.default>);
};
exports.default = react_1.default.memo(HeaderProfile);
