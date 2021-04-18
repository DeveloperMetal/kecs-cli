"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const utils_1 = require("../utils");
const generate = (data) => `
export interface ECSCore extends ECSDefine {
${utils_1.reduce(data.components, (component) => `
  ${component.component}: ${component.component}
`)}
}
`;
exports.generate = generate;
//# sourceMappingURL=ecsDefine.js.map