import { IECSSchema } from "../../schema/types";
import { reduce } from "../utils";

export const generate = (data: IECSSchema) => `
${reduce(Object.values(data.components), (component) => `
export interface I${component.component} {${reduce(Object.entries(
  component.fields || {}), ([fieldName, field]) => `
  ${fieldName}: ${field.type}`)}
}`)}

export interface IClientComponents extends IComponentDefinition {${reduce(Object.values(data.components), (component) => `
    ${component.component}: I${component.component}`)}
}`;
