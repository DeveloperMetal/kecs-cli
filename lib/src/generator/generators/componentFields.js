"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const utils_1 = require("../utils");
const generate = (data) => utils_1.reduce(data.components, (component) => `
const ${component.component}Fields: ComponentFields<${component.component}> = {
${utils_1.reduce(Object.keys(component.fields), (fieldName) => `
  ${fieldName}: {
    typeof: FieldTypeOf.${component.fields[fieldName].type},
    defaultValue: FieldTypeOf.${component.fields[fieldName].defaultValue},
    allowNull: FieldTypeOf.${component.fields[fieldName].allowNull}
  },`)}
}`);
exports.generate = generate;
//# sourceMappingURL=componentFields.js.map