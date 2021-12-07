"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function FormikControl(props) {
    const { control } = props;
    switch (control) {
        case 'input':
        case 'textarea':
        case 'select':
        case 'radio':
        case 'checkbox':
        case 'date':
        default: return null;
    }
}
exports.default = FormikControl;
