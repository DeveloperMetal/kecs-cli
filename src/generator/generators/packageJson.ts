export const generate = () => {
  const packageJson = {
    name: "ecs-client-types",
    version: "1.0.0",
    license: "MIT"
  }

  return JSON.stringify(packageJson, undefined, 2);
};