import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { getConfig, type Config } from '../utils/config.js';
import {
  getRegistryItem,
  getRegistryNames,
  resolveDependencies,
  type RegistryItem,
} from '../utils/registry.js';

/**
 * Add components to the project
 */
export async function add(components: string[], cwd: string, options: { yes?: boolean }) {
  const spinner = ora();

  try {
    // Get configuration
    const config = await getConfig(cwd);

    if (!config) {
      console.log(chalk.red('No calendar configuration found.'));
      console.log(chalk.yellow('Run `npx trc init` first to initialize your project.'));
      process.exit(1);
    }

    // If no components specified, show selection prompt
    if (components.length === 0) {
      const availableComponents = getRegistryNames().filter(
        (name) => getRegistryItem(name)?.type === 'registry:ui'
      );

      const { selectedComponents } = await prompts({
        type: 'multiselect',
        name: 'selectedComponents',
        message: 'Which components would you like to add?',
        choices: availableComponents.map((name) => {
          const item = getRegistryItem(name)!;
          return {
            title: item.title,
            value: name,
            description: item.description,
          };
        }),
      });

      if (!selectedComponents || selectedComponents.length === 0) {
        console.log(chalk.yellow('No components selected.'));
        return;
      }

      components = selectedComponents;
    }

    // Resolve all dependencies
    const allComponents = new Set<string>();
    for (const component of components) {
      const deps = resolveDependencies(component);
      deps.forEach((dep) => allComponents.add(dep));
    }

    // Validate components exist
    const invalidComponents: string[] = [];
    for (const component of allComponents) {
      if (!getRegistryItem(component)) {
        invalidComponents.push(component);
      }
    }

    if (invalidComponents.length > 0) {
      console.log(chalk.red(`Unknown components: ${invalidComponents.join(', ')}`));
      console.log(chalk.yellow(`Available components: ${getRegistryNames().join(', ')}`));
      process.exit(1);
    }

    // Collect npm dependencies
    const npmDeps = new Set<string>();
    const npmDevDeps = new Set<string>();

    for (const componentName of allComponents) {
      const item = getRegistryItem(componentName)!;
      item.dependencies.forEach((dep) => npmDeps.add(dep));
      item.devDependencies.forEach((dep) => npmDevDeps.add(dep));
    }

    // Show summary
    console.log();
    console.log(chalk.bold('Components to install:'));
    for (const componentName of allComponents) {
      const item = getRegistryItem(componentName)!;
      console.log(chalk.cyan(`  - ${item.title}`));
    }

    if (npmDeps.size > 0) {
      console.log();
      console.log(chalk.bold('Dependencies to install:'));
      console.log(chalk.cyan(`  ${Array.from(npmDeps).join(', ')}`));
    }

    if (!options.yes) {
      const { proceed } = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed with installation?',
        initial: true,
      });

      if (!proceed) {
        console.log(chalk.yellow('Installation cancelled.'));
        return;
      }
    }

    // Install npm dependencies
    if (npmDeps.size > 0 || npmDevDeps.size > 0) {
      spinner.start('Installing npm dependencies...');

      // Detect package manager
      const hasYarnLock = await fs.pathExists(path.join(cwd, 'yarn.lock'));
      const hasPnpmLock = await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'));
      const hasBunLock = await fs.pathExists(path.join(cwd, 'bun.lockb'));

      let packageManager = 'npm';
      if (hasPnpmLock) packageManager = 'pnpm';
      else if (hasYarnLock) packageManager = 'yarn';
      else if (hasBunLock) packageManager = 'bun';

      const installCmd = packageManager === 'npm' ? 'install' : 'add';

      try {
        if (npmDeps.size > 0) {
          await execa(packageManager, [installCmd, ...Array.from(npmDeps)], {
            cwd,
            stdio: 'pipe',
          });
        }

        if (npmDevDeps.size > 0) {
          const devFlag = packageManager === 'npm' ? '--save-dev' : '-D';
          await execa(packageManager, [installCmd, devFlag, ...Array.from(npmDevDeps)], {
            cwd,
            stdio: 'pipe',
          });
        }

        spinner.succeed('Dependencies installed');
      } catch (error) {
        spinner.warn('Failed to install some dependencies');
      }
    }

    // Write component files
    spinner.start('Writing component files...');

    for (const componentName of allComponents) {
      const item = getRegistryItem(componentName)!;

      for (const file of item.files) {
        const targetPath = resolveFilePath(file.path, config);
        const fullPath = path.join(cwd, targetPath);

        // Create directory if needed
        await fs.ensureDir(path.dirname(fullPath));

        // Transform content based on config
        let content = file.content;
        content = transformContent(content, config);

        // Check if file exists
        if (await fs.pathExists(fullPath)) {
          if (!options.yes) {
            const { overwrite } = await prompts({
              type: 'confirm',
              name: 'overwrite',
              message: `File ${targetPath} already exists. Overwrite?`,
              initial: false,
            });

            if (!overwrite) {
              console.log(chalk.yellow(`  Skipped ${targetPath}`));
              continue;
            }
          }
        }

        await fs.writeFile(fullPath, content);
        console.log(chalk.green(`  Created ${targetPath}`));
      }
    }

    spinner.succeed('Components added successfully!');

    console.log();
    console.log(chalk.green('✓ Installation complete!'));
    console.log();
    console.log('Import the components:');
    for (const componentName of components) {
      const item = getRegistryItem(componentName)!;
      if (item.type === 'registry:ui') {
        const componentPath = config.aliases.components.replace('@/', '');
        console.log(chalk.cyan(`  import { ${capitalize(componentName)} } from "${config.aliases.components}/ui/${componentName}";`));
      }
    }
    console.log();

  } catch (error) {
    spinner.fail('Installation failed');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Resolve file path based on config
 */
function resolveFilePath(filePath: string, config: Config): string {
  // Replace path prefixes
  if (filePath.startsWith('ui/')) {
    const componentsPath = config.aliases.components.replace(/^@\//, 'src/');
    return filePath.replace('ui/', `${componentsPath}/ui/`);
  }

  if (filePath.startsWith('lib/')) {
    const utilsPath = config.aliases.utils.replace(/^@\//, 'src/');
    const utilsDir = path.dirname(utilsPath);
    return filePath.replace('lib/', `${utilsDir}/`);
  }

  if (filePath.startsWith('hooks/')) {
    const hooksPath = config.aliases.hooks?.replace(/^@\//, 'src/') || 'src/hooks';
    return filePath.replace('hooks/', `${hooksPath}/`);
  }

  return `src/${filePath}`;
}

/**
 * Transform content based on config
 */
function transformContent(content: string, config: Config): string {
  // Replace import aliases
  content = content.replace(/@\/components/g, config.aliases.components);
  content = content.replace(/@\/lib\/utils/g, config.aliases.utils);

  // Convert to JavaScript if needed
  if (!config.typescript) {
    // Remove type annotations (basic transformation)
    content = content.replace(/: [A-Z][a-zA-Z<>[\]|&,\s]*/g, '');
    content = content.replace(/import type \{[^}]+\} from [^;]+;?\n?/g, '');
    content = content.replace(/<[A-Z][a-zA-Z<>[\]|&,\s]*>/g, '');
  }

  return content;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
