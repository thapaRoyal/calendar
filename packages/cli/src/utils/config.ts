import { z } from 'zod';
import { cosmiconfig } from 'cosmiconfig';
import path from 'path';
import fs from 'fs-extra';

/**
 * Configuration schema
 */
export const configSchema = z.object({
  $schema: z.string().optional(),
  framework: z.enum(['react', 'vue', 'svelte']).default('react'),
  typescript: z.boolean().default(true),
  tailwind: z.boolean().default(true),
  aliases: z.object({
    components: z.string().default('@/components'),
    utils: z.string().default('@/lib/utils'),
    hooks: z.string().optional(),
  }).default({
    components: '@/components',
    utils: '@/lib/utils',
  }),
  defaultCalendar: z.enum(['AD', 'BS']).default('BS'),
  locale: z.enum(['en', 'ne']).default('en'),
});

export type Config = z.infer<typeof configSchema>;

const explorer = cosmiconfig('calendar', {
  searchPlaces: [
    'calendar.config.json',
    'calendar.config.js',
    'calendar.config.cjs',
    '.calendarrc',
    '.calendarrc.json',
  ],
});

/**
 * Get the configuration file path
 */
export function getConfigPath(cwd: string): string {
  return path.join(cwd, 'calendar.config.json');
}

/**
 * Check if configuration exists
 */
export async function configExists(cwd: string): Promise<boolean> {
  const result = await explorer.search(cwd);
  return result !== null;
}

/**
 * Read configuration
 */
export async function getConfig(cwd: string): Promise<Config | null> {
  try {
    const result = await explorer.search(cwd);
    if (!result) {
      return null;
    }
    return configSchema.parse(result.config);
  } catch (error) {
    return null;
  }
}

/**
 * Write configuration
 */
export async function writeConfig(cwd: string, config: Config): Promise<void> {
  const configPath = getConfigPath(cwd);
  const configWithSchema = {
    $schema: 'https://thaparoyal-calendar.dev/schema.json',
    ...config,
  };
  await fs.writeJSON(configPath, configWithSchema, { spaces: 2 });
}

/**
 * Get project info
 */
export async function getProjectInfo(cwd: string): Promise<{
  hasPackageJson: boolean;
  hasTailwind: boolean;
  hasTypeScript: boolean;
  framework: 'react' | 'vue' | 'svelte' | null;
}> {
  const packageJsonPath = path.join(cwd, 'package.json');
  const tailwindConfigPath = path.join(cwd, 'tailwind.config.js');
  const tailwindConfigTsPath = path.join(cwd, 'tailwind.config.ts');
  const tsconfigPath = path.join(cwd, 'tsconfig.json');

  const hasPackageJson = await fs.pathExists(packageJsonPath);
  const hasTailwind = (await fs.pathExists(tailwindConfigPath)) || (await fs.pathExists(tailwindConfigTsPath));
  const hasTypeScript = await fs.pathExists(tsconfigPath);

  let framework: 'react' | 'vue' | 'svelte' | null = null;

  if (hasPackageJson) {
    const packageJson = await fs.readJSON(packageJsonPath);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps.react || deps['react-dom']) {
      framework = 'react';
    } else if (deps.vue) {
      framework = 'vue';
    } else if (deps.svelte) {
      framework = 'svelte';
    }
  }

  return {
    hasPackageJson,
    hasTailwind,
    hasTypeScript,
    framework,
  };
}
