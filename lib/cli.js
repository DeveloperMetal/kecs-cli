var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("schema/types", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("parsers/yaml", ["path", "glob", "js-yaml", "fs"], function (exports_2, context_2) {
    "use strict";
    var path_1, glob_1, js_yaml_1, fs_1;
    var __moduleName = context_2 && context_2.id;
    function globPath(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                glob_1.default(pattern, (err, matches) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(matches);
                    }
                });
            });
        });
    }
    function globSearch(searchPaths, pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (const search of searchPaths) {
                const searchPath = path_1.default.join(search, pattern);
                const matches = yield globPath(searchPath);
                results.push(...matches);
            }
            return results;
        });
    }
    function parseYaml(yamlPath, data, depth = 0, openCache = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = "  ".repeat(depth);
            console.log(prefix + "-------------------------------------------");
            console.log(prefix + "-- Parsing: ", yamlPath);
            const input = js_yaml_1.default.load(fs_1.default.readFileSync(yamlPath, 'utf8'));
            const inputPathDir = path_1.default.resolve(path_1.default.dirname(yamlPath));
            const searchPaths = [inputPathDir];
            if ("include" in input) {
                console.log(prefix + "--------------", input);
                for (const include of input.include) {
                    if (typeof include === "string") {
                        console.log(prefix + "--- include: ", include);
                        const results = yield globSearch(searchPaths, include);
                        for (const result of results) {
                            if (result != yamlPath) {
                                const resultYamlPath = result.endsWith('.yml') ? result : path_1.default.join(result, 'index.yml');
                                if (Reflect.has(openCache, resultYamlPath)) {
                                    console.log(prefix + "--- skip");
                                    return;
                                }
                                else {
                                    openCache[resultYamlPath] = true;
                                    yield parseYaml(resultYamlPath, data, depth + 1, openCache);
                                }
                            }
                        }
                    }
                    else {
                        try {
                            console.log(prefix + "--- module: ", include.module);
                            const modulePath = require.resolve(include.module);
                            if (modulePath) {
                                const results = yield globSearch([modulePath], include.import);
                                if (results.length === 0) {
                                    console.error(prefix + `[ERROR] Missing module import file: ${include.module}/${include.import}`);
                                }
                            }
                        }
                        catch (e) {
                            console.error(prefix + `[ERROR] Missing module: ${include.module}`);
                            throw e;
                        }
                    }
                }
            }
            else if ("component" in input && typeof input.component === "string") {
                data.components.push(input);
            }
            else if ("entity" in input && typeof input.entity === "string") {
                if (data.entities) {
                    data.entities.push(input);
                }
            }
            else if (input.constructor === Array) {
                if ("component" in input[0]) {
                    for (const component of input) {
                        data.components.push(component);
                    }
                }
                else if ("entity" in input[0]) {
                    if (data.entities) {
                        for (const entity of input) {
                            data.entities.push(entity);
                        }
                    }
                }
            }
        });
    }
    exports_2("parseYaml", parseYaml);
    return {
        setters: [
            function (path_1_1) {
                path_1 = path_1_1;
            },
            function (glob_1_1) {
                glob_1 = glob_1_1;
            },
            function (js_yaml_1_1) {
                js_yaml_1 = js_yaml_1_1;
            },
            function (fs_1_1) {
                fs_1 = fs_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("generator/types", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("generator/utils", [], function (exports_4, context_4) {
    "use strict";
    var reduce;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            exports_4("reduce", reduce = (arr, fn) => {
                return arr.reduce((p, c) => `${p}${fn(c)}`, '');
            });
        }
    };
});
System.register("generator/generators/interfaces", ["generator/utils"], function (exports_5, context_5) {
    "use strict";
    var utils_1, generate;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            exports_5("generate", generate = (data) => utils_1.reduce(data.components, (component) => `
/**
 * Component: ${component.component}
 **/
export interface ${component.component} extends IComponent {
${utils_1.reduce(Object.keys(component.fields), (fieldName) => `
  ${fieldName}: ${component.fields[fieldName].type}`)}
}`));
        }
    };
});
System.register("generator/generators/componentFields", ["generator/utils"], function (exports_6, context_6) {
    "use strict";
    var utils_2, generate;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (utils_2_1) {
                utils_2 = utils_2_1;
            }
        ],
        execute: function () {
            exports_6("generate", generate = (data) => utils_2.reduce(data.components, (component) => `
const ${component.component}Fields: ComponentFields<${component.component}> = {
${utils_2.reduce(Object.keys(component.fields), (fieldName) => `
  ${fieldName}: {
    typeof: FieldTypeOf.${component.fields[fieldName].type},
    defaultValue: FieldTypeOf.${component.fields[fieldName].defaultValue},
    allowNull: FieldTypeOf.${component.fields[fieldName].allowNull}
  },`)}
}`));
        }
    };
});
System.register("generator/generators/ecsDefine", ["generator/utils"], function (exports_7, context_7) {
    "use strict";
    var utils_3, generate;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (utils_3_1) {
                utils_3 = utils_3_1;
            }
        ],
        execute: function () {
            exports_7("generate", generate = (data) => `
export interface ECSCore extends ECSDefine {
${utils_3.reduce(data.components, (component) => `
  ${component.component}: ${component.component}
`)}
}
`);
        }
    };
});
System.register("generator/generators/entities", ["generator/utils"], function (exports_8, context_8) {
    "use strict";
    var utils_4, generate;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (utils_4_1) {
                utils_4 = utils_4_1;
            }
        ],
        execute: function () {
            exports_8("generate", generate = (data) => `
/**
 * Initializes ECS framework
 */
export default function (ecs: ECS<IDefine>) {
  // Initializes all entities ////////////////////////////////////////
${utils_4.reduce((data.entities || []), (entity) => entity.components.length > 0 ? `
  ecs.entity("${entity.entity}", "${entity.components.join('", "')}")
` : `
  ecs.entity("${entity.entity}")
`)}
}`);
        }
    };
});
System.register("generator/index", ["parsers/yaml", "findup-sync", "fs/promises", "path", "generator/generators/interfaces", "generator/generators/componentFields", "generator/generators/ecsDefine", "generator/generators/entities"], function (exports_9, context_9) {
    "use strict";
    var yaml_1, findup_sync_1, promises_1, path_2, interfaces_1, componentFields_1, ecsDefine_1, entities_1;
    var __moduleName = context_9 && context_9.id;
    function generateCode(data) {
        const src = `
import {
  IDefine,
  IComponent,
  IEntity,
  FieldTypeOf,
  ComponentFields,
  ECSDefine,
  ECS } from "@kryptonstudio/ecs";

// Interfaces /////////////////////////////////////////////////////////////////
${interfaces_1.generate(data)}

// Fields /////////////////////////////////////////////////////////////////////
${componentFields_1.generate(data)}

// ECSDefine //////////////////////////////////////////////////////////////////
${ecsDefine_1.generate(data)}

// Entities ///////////////////////////////////////////////////////////////////
${entities_1.generate(data)}
`;
        return src;
    }
    function default_1(argv) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                components: [],
                entities: []
            };
            try {
                yield yaml_1.parseYaml(argv.i, data);
            }
            catch (err) {
                console.log("-- Error parsing yaml ---------------");
                console.error(err);
                return;
            }
            console.log("-- Generating ------------------------");
            console.log(data);
            const src = generateCode(data);
            const node_modules_path = findup_sync_1.default("node_modules");
            let output_path = "";
            if (node_modules_path) {
                output_path = path_2.default.join(node_modules_path, "@kryptonstudio", "ECSClient");
                yield promises_1.default.mkdir(output_path, {
                    recursive: true
                });
            }
            if (argv.o) {
                try {
                    yield promises_1.default.stat(argv.o);
                    output_path = argv.o;
                }
                catch (ex) {
                    console.log(ex);
                    yield promises_1.default.mkdir(argv.o, { recursive: true });
                }
                console.log(src);
                promises_1.default.writeFile(path_2.default.join(output_path, 'index.ts'), src, { encoding: "utf-8" });
            }
        });
    }
    exports_9("default", default_1);
    return {
        setters: [
            function (yaml_1_1) {
                yaml_1 = yaml_1_1;
            },
            function (findup_sync_1_1) {
                findup_sync_1 = findup_sync_1_1;
            },
            function (promises_1_1) {
                promises_1 = promises_1_1;
            },
            function (path_2_1) {
                path_2 = path_2_1;
            },
            function (interfaces_1_1) {
                interfaces_1 = interfaces_1_1;
            },
            function (componentFields_1_1) {
                componentFields_1 = componentFields_1_1;
            },
            function (ecsDefine_1_1) {
                ecsDefine_1 = ecsDefine_1_1;
            },
            function (entities_1_1) {
                entities_1 = entities_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("projectInit/types", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("projectInit/index", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    function default_2(args) {
        console.log(args);
    }
    exports_11("default", default_2);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("index", ["yargs", "generator/index", "projectInit/index"], function (exports_12, context_12) {
    "use strict";
    var yargs_1, generator_1, projectInit_1;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (yargs_1_1) {
                yargs_1 = yargs_1_1;
            },
            function (generator_1_1) {
                generator_1 = generator_1_1;
            },
            function (projectInit_1_1) {
                projectInit_1 = projectInit_1_1;
            }
        ],
        execute: function () {
            yargs_1.default
                .command({
                command: "init",
                describe: "Bootstraps a kecs project",
                builder: {
                    name: {
                        string: true,
                        demandOption: true
                    }
                },
                handler: projectInit_1.default
            })
                .command({
                command: "generate",
                describe: "Generates ecs typed client",
                builder: {
                    in: {
                        alias: "i",
                        string: true,
                        demandOption: true
                    },
                    out: {
                        alias: "o",
                        string: true,
                        demandOption: false
                    }
                },
                handler: generator_1.default
            })
                .help()
                .showHelpOnFail(true)
                .parse();
        }
    };
});
System.register("schema/index", ["schema/types"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_13(exports);
    }
    return {
        setters: [
            function (types_1_1) {
                exportStar_1(types_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=cli.js.map