"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentSchema = void 0;
const utils_1 = require("../utils");
const generateComponentSchema = (component) => `{
  component: ${component.component},
  fields: [${utils_1.reduce(Object.keys(component.fields), (fieldName) => `
    ${fieldName}: {
      typeof: FieldTypeOf.${component.fields[fieldName].type},
      defaultValue: FieldTypeOf.${component.fields[fieldName].defaultValue},
      allowNull: FieldTypeOf.${component.fields[fieldName].allowNull}
    },`)}
  ]
}`;
exports.generateComponentSchema = generateComponentSchema;
//# sourceMappingURL=componentSchema.js.map