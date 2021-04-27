import { IComponentSchema, IECSSchema } from "@kryptonstudio/ecs";
import { reduce } from "../utils";

export const generateComponentSchema = (component: IComponentSchema) => `{
  component: ${component.component},
  fields: [${reduce(Object.keys(component.fields), (fieldName) => `
    ${fieldName}: {
      typeof: FieldTypeOf.${component.fields[fieldName].type},
      defaultValue: FieldTypeOf.${component.fields[fieldName].defaultValue},
      allowNull: FieldTypeOf.${component.fields[fieldName].allowNull}
    },`)}
  ]
}`
