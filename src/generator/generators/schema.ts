import { IECSSchema } from "@kryptonstudio/ecs";
import { reduce } from "../utils";
import { generateComponentSchema } from './componentSchema';

export const generate = (data: IECSSchema) => `
const componentSchemas = {
${reduce(Object.values(data.components), (component) => `
  ${component.component}: ${generateComponentSchema(component)},
`)}
}
`;
