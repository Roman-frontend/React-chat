"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledBadgeWraper = void 0;
const styles_1 = require("@mui/material/styles");
const Badge_1 = __importDefault(require("@mui/material/Badge"));
const Avatar_1 = __importDefault(require("@mui/material/Avatar"));
const nanoid_1 = require("nanoid");
const StyledBadge = (0, styles_1.styled)(Badge_1.default)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));
const StyledBadgeWraper = (props) => {
    const { name, styleBadge, styleAvatar, variant } = props;
    return (<StyledBadge style={styleBadge} key={(0, nanoid_1.nanoid)()} overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant={variant}>
      <Avatar_1.default style={styleAvatar} alt={name} size='small'>
        {name[0]}
      </Avatar_1.default>
    </StyledBadge>);
};
exports.StyledBadgeWraper = StyledBadgeWraper;
