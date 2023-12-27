import fs from 'fs';
import { NextConfig } from 'next';
import path from 'path';

export type LogbunNextJsConfig = {
  silent?: boolean;
};

// This function finds a logbun config file and adds it to webpack.entry array
export function withLogbunConfig(defaultConfig: NextConfig, logbunConfig: LogbunNextJsConfig): NextConfig {
  return {
    ...defaultConfig,
    webpack: async (webpackConfig, context) => {
      const { isServer, dir: projectDir, nextRuntime } = context;

      const configType = isServer ? (nextRuntime === 'edge' ? 'edge' : 'server') : 'browser';

      let result = { ...webpackConfig };

      const originalEntry = result.entry;

      if (typeof defaultConfig.webpack === 'function') {
        result = defaultConfig.webpack(result, context);
      }

      return {
        ...result,
        async entry() {
          // See if config file exists, if it does store it
          const configs = [`logbun.${configType}.config.ts`, `logbun.${configType}.config.js`];

          let logbunConfigFile = '';

          for (const filename of configs) {
            if (fs.existsSync(path.resolve(projectDir, filename))) {
              logbunConfigFile = filename;
            }
          }

          if (!logbunConfigFile) {
            console.debug('Logbun config file not found. Using current nextjs config file');
            return originalEntry;
          }

          // We want to append the logbun config file too all existing keys on the result of entries

          const currentEntries: { [key: string]: string | object } =
            typeof originalEntry === 'function' ? await originalEntry() : { ...originalEntry };

          if (!Object.keys(currentEntries).length) {
            console.debug(`No entry points for configType[${configType}]`);
          }

          Object.entries(currentEntries).forEach(([key, value]) => {
            if (typeof value === 'string') {
              result[key] = [value, `./${logbunConfigFile}`];
            } else if (Array.isArray(value)) {
              result[key] = [...value, `./${logbunConfigFile}`];
            } else if (value && typeof value === 'object' && 'import' in value) {
              const origImport = value.import as string | string[];

              let newImport = [`./${logbunConfigFile}`];

              if (typeof origImport === 'string') {
                newImport = [...newImport, origImport];
              } else {
                newImport = [...newImport, ...origImport];
              }

              result[key] = { ...value, import: newImport };
            } else {
              console.error('Could not inject file');
            }
          });

          return result;
        },
      };
    },
  };
}
