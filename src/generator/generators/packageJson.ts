import packageJsonData from "../../../package.json";

export const generate = () => {
  const packageJson = {
    name: "@kryptonstudio/ecs-client",
    version: "1.0.0",
    license: "MIT",
    dependencies: {
      "@kryptonstudio/ecs": packageJsonData.dependencies["@kryptonstudio/ecs"]
    }
  }

  return JSON.stringify(packageJson, undefined, 2);
};