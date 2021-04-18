"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const package_json_1 = __importDefault(require("../../../package.json"));
const generate = () => {
    const packageJson = {
        name: "@kryptonstudio/ecs-client",
        version: "1.0.0",
        license: "MIT",
        dependencies: {
            "@kryptonstudio/ecs": package_json_1.default.dependencies["@kryptonstudio/ecs"]
        }
    };
    return JSON.stringify(packageJson, undefined, 2);
};
exports.generate = generate;
//# sourceMappingURL=packageJson.js.map