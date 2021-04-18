"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const utils_1 = require("../utils");
const generate = (data) => utils_1.reduce(data.components, (component) => `
/**
 * Component: ${component.component}
 **/
export interface ${component.component} extends IComponent {
${utils_1.reduce(Object.keys(component.fields), (fieldName) => `
  ${fieldName}: ${component.fields[fieldName].type}`)}
}`);
exports.generate = generate;
//# sourceMappingURL=interfaces.js.map