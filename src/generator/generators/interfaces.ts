import { IECSSchema } from "../../schema/types";
import { reduce } from "../utils";

export const generate = (data: IECSSchema) => `
export interface IComponents {
  ${reduce(Object.values(data.components), (component) => `
    ${component}: I${component},
  `)}
}`;
