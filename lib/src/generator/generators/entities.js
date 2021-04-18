"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const utils_1 = require("../utils");
const generate = (data) => `
/**
 * Initializes ECS framework
 */
export default function (ecs: ECS<IDefine>) {
  // Initializes all entities ////////////////////////////////////////
${utils_1.reduce((data.entities || []), (entity) => entity.components.length > 0 ? `
  ecs.entity("${entity.entity}", "${entity.components.join('", "')}")
` : `
  ecs.entity("${entity.entity}")
`)}
}`;
exports.generate = generate;
//# sourceMappingURL=entities.js.map