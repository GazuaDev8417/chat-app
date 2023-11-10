"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class Authentication {
    constructor() {
        this.token = (payload) => {
            return jsonwebtoken_1.default.sign({ payload }, process.env.JWT_KEY);
        };
        this.tokenData = (token) => {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        };
    }
}
exports.Authentication = Authentication;
