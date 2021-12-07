"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, er: null };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ er: `error: ${error}, errorInfo: ${errorInfo}` });
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>{`Something went wrong. ${this.state.er}`}</h1>;
        }
        return this.props.children;
    }
}
exports.default = ErrorBoundary;
