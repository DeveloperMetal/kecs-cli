declare module "schema/types" {
    export type ISchemaInclude = {
        module: string;
        import: string;
    } | string;
    export interface IFieldSchema {
        type: "string" | "boolean" | "number" | "float32Array" | "object";
        defaultValue: string | boolean | number | object | null;
        allowNull: boolean;
    }
    export interface IComponentSchema {
        component: string;
        fields: {
            [name: string]: IFieldSchema;
        };
    }
    export interface IEntitySchema {
        entity: string;
        components: string[];
    }
    export interface IECSSchema {
        components: IComponentSchema[];
        entities?: IEntitySchema[];
    }
    export type GeneratorInput = {
        include: ISchemaInclude[];
    } | IComponentSchema | IEntitySchema | IComponentSchema[] | IEntitySchema[];
}
declare module "parsers/yaml" {
    import { IECSSchema } from "schema/types";
    export function parseYaml(yamlPath: string, data: IECSSchema, depth?: number, openCache?: {
        [name: string]: boolean;
    }): Promise<void>;
}
declare module "generator/types" {
    export interface IGeneratorArgs {
        _: string[];
        "$0": string;
        in: string;
        out: string;
        i: string;
        o: string;
    }
}
declare module "generator/utils" {
    export const reduce: <T>(arr: T[], fn: (c: T) => string) => string;
}
declare module "generator/generators/interfaces" {
    import { IECSSchema } from "schema/types";
    export const generate: (data: IECSSchema) => string;
}
declare module "generator/generators/componentFields" {
    import { IECSSchema } from "schema/types";
    export const generate: (data: IECSSchema) => string;
}
declare module "generator/generators/ecsDefine" {
    import { IECSSchema } from "schema/types";
    export const generate: (data: IECSSchema) => string;
}
declare module "generator/generators/entities" {
    import { IECSSchema } from "schema/types";
    export const generate: (data: IECSSchema) => string;
}
declare module "generator/index" {
    import { IGeneratorArgs } from "generator/types";
    export default function (argv: IGeneratorArgs): Promise<void>;
}
declare module "projectInit/types" {
    export type IProjectInitArgs = {
        _: string[];
        "$0": string;
        name: string;
    };
}
declare module "projectInit/index" {
    import { IProjectInitArgs } from "projectInit/types";
    export default function (args: IProjectInitArgs): void;
}
declare module "index" { }
declare module "schema/index" {
    export * from "schema/types";
}
//# sourceMappingURL=cli.d.ts.map