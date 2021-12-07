"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setStylesChat(theme) {
    return {
        root: {
            display: 'flex',
            alignItems: 'center',
            flexFlow: 'column',
            height: '100vh',
            lineHeight: 'normal',
            background: '#dfe0f7',
            minWidth: 890,
        },
        workSpace: {
            minWidth: 550,
            maxWidth: 900,
            height: 600,
            background: theme.palette.primary.main,
        },
        header: { paddingLeft: 8 },
        conversation: {
            height: 520,
            flexGrow: 1,
            p: '20px 0px 0px 0px',
            backgroundColor: theme.palette.primary.light,
        },
    };
}
exports.default = setStylesChat;
