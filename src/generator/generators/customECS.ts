import { IECSSchema } from "../../schema/types";
import { reduce } from "../utils";

export const generate = (data: IECSSchema) => reduce(data.components, (component) => `
/**
 * ECS Client
 **/
export interface ECSClient extends ECS {

}`);
