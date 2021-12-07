"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChannelName = exports.CreateDirectMsgName = void 0;
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const Person_1 = __importDefault(require("@mui/icons-material/Person"));
function CreateDirectMsgName({ name }) {
    return (<material_1.Grid container style={{ alignItems: 'center' }}>
      <material_1.Grid item xs={2}>
        <Person_1.default style={{ background: 'cadetblue', borderRadius: '0.4rem' }}/>
      </material_1.Grid>
      <material_1.Grid item xs={10}>
        {name}
      </material_1.Grid>
    </material_1.Grid>);
}
exports.CreateDirectMsgName = CreateDirectMsgName;
function CreateChannelName({ isPrivate, name }) {
    const nameChannel = isPrivate ? <p>&#128274;{name}</p> : <p>{`#${name}`}</p>;
    return (<material_1.Grid container className='left-bar__title-name'>
      <material_1.Grid item xs={12}>
        {nameChannel}
      </material_1.Grid>
    </material_1.Grid>);
}
exports.CreateChannelName = CreateChannelName;
CreateDirectMsgName.defaultProps = {
    name: 'Невизначений',
};
CreateChannelName.defaultProps = {
    name: 'Невизначений',
};
