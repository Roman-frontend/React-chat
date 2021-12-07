"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
function EndActionButton(props) {
    const { setCloseBtnChangeMsg, closeBtnReplyMsg, setCloseBtnReplyMsg, inputRef, changeMessageRef, } = props;
    const topInput = document
        .getElementById('mainInput')
        .getBoundingClientRect().top;
    const topButtonClose = closeBtnReplyMsg ? topInput - 56 : topInput;
    function hideButtonExit() {
        setCloseBtnReplyMsg(null);
        setCloseBtnChangeMsg(null);
        changeMessageRef.current = null;
        inputRef.current.value = '';
    }
    return (<material_1.Button 
    //className='conversation-input__end-action-button'
    size='small' style={{ color: 'black' }} fontSize='large' type='checkbox' id='checkbox' name='checkbox' onClick={hideButtonExit} inputprops={{ 'aria-label': 'primary checkbox' }}>
      X
    </material_1.Button>);
}
exports.default = EndActionButton;
