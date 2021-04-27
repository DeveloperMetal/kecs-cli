import { IECSSchema } from "@kryptonstudio/ecs";
import { reduce } from "../utils";
import { generateComponentSchema } from './componentSchema';

export const generate = (data: IECSSchema) => `
const componentSchemas = {
${reduce(Object.values(data.components), (component) => `
  ${component}: ${generateComponentSchema(component)},
`)}
}

export interface IComponents {
${reduce(Object.values(data.components), (component) => `
  ${component}: I${component},
`)}
}
`;
