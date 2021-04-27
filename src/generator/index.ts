import { IECSSchema } from "../schema/types";
import { parseYaml } from "../parsers/yaml";
import { IGeneratorArgs } from "./types";
import findup from "findup-sync";
import fs from "fs/promises";
import path from "path";
import { generate as generateInterfaces } from "./generators/interfaces";
import { generate as generateSchema } from "./generators/schema";
import { generate as generatePackage } from "./generators/packageJson";

function generateCode(data: IECSSchema) {
  const src = `
import {
  ECSBase
} from "@kryptonstudio/ecs";

// Component and Entity Schema ////////////////////////////////////////////////
${generateSchema(data)}

// Component Interfaces //////////////////////////////////////////////////////
${generateInterfaces(data)}
`;

  return src;
}

export default async function (argv: IGeneratorArgs) {
  const data: IECSSchema = {
    components: [],
    entities: []
  };

  try {
    await parseYaml(argv.i, data);
  } catch(err) {
    console.log("-- Error parsing yaml ---------------")
    console.error(err);
    return;
  }
  // tslint:disable-next-line: no-console
  const src = generateCode(data);
  const node_modules_path = findup("node_modules");
  let output_path = "";

  if ( node_modules_path ) {
    output_path = path.join(node_modules_path, "@kryptonstudio", "ecs-client");
    await fs.mkdir(output_path, {
      recursive: true
    });
  }

  if ( argv.o ) {
    try {
      await fs.stat(argv.o);
      output_path = argv.o;
    } catch(ex) {
      console.log(ex);
      await fs.mkdir(argv.o, { recursive: true });
    }
  }

  if ( src && output_path) {
    console.log("Writing client...");
    await fs.writeFile(path.join(output_path, 'index.ts'), src, { encoding: "utf-8" });
    console.log("Writing @kryptonstudio/ecs-client package");
    await fs.writeFile(path.join(output_path, 'package.json'), generatePackage(), { encoding: "utf-8" });
    console.log("Client Generated.");
  }
}