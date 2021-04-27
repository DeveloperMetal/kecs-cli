"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_1 = require("../parsers/yaml");
const findup_sync_1 = __importDefault(require("findup-sync"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const interfaces_1 = require("./generators/interfaces");
const schema_1 = require("./generators/schema");
const packageJson_1 = require("./generators/packageJson");
function generateCode(data) {
    const src = `
import {
  ECSBase
} from "@kryptonstudio/ecs";

// Component and Entity Schema ////////////////////////////////////////////////
${schema_1.generate(data)}

// Component Interfaces //////////////////////////////////////////////////////
${interfaces_1.generate(data)}
`;
    return src;
}
function default_1(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            components: [],
            entities: []
        };
        try {
            yield yaml_1.parseYaml(argv.i, data);
        }
        catch (err) {
            console.log("-- Error parsing yaml ---------------");
            console.error(err);
            return;
        }
        const src = generateCode(data);
        const node_modules_path = findup_sync_1.default("node_modules");
        let output_path = "";
        if (node_modules_path) {
            output_path = path_1.default.join(node_modules_path, "@kryptonstudio", "ecs-client");
            yield promises_1.default.mkdir(output_path, {
                recursive: true
            });
        }
        if (argv.o) {
            try {
                yield promises_1.default.stat(argv.o);
                output_path = argv.o;
            }
            catch (ex) {
                console.log(ex);
                yield promises_1.default.mkdir(argv.o, { recursive: true });
            }
        }
        if (src && output_path) {
            console.log("Writing client...");
            yield promises_1.default.writeFile(path_1.default.join(output_path, 'index.ts'), src, { encoding: "utf-8" });
            console.log("Writing @kryptonstudio/ecs-client package");
            yield promises_1.default.writeFile(path_1.default.join(output_path, 'package.json'), packageJson_1.generate(), { encoding: "utf-8" });
            console.log("Client Generated.");
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map