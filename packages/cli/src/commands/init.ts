import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { getProjectInfo, writeConfig, configExists, type Config } from '../utils/config.js';

/**
 * Initialize calendar configuration in a project
 */
export async function init(cwd: string) {
  const spinner = ora();

  try {
    // Check if already initialized
    if (await configExists(cwd)) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'Calendar configuration already exists. Overwrite?',
        initial: false,
      });

      if (!overwrite) {
        console.log(chalk.yellow('Initialization cancelled.'));
        return;
      }
    }

    // Detect project info
    spinner.start('Detecting project configuration...');
    const projectInfo = await getProjectInfo(cwd);
    spinner.stop();

    if (!projectInfo.hasPackageJson) {
      console.log(
        chalk.red('No package.json found. Please run this command in a Node.js project.')
      );
      process.exit(1);
    }

    // Prompt for configuration
    const response = await prompts([
      {
        type: 'select',
        name: 'framework',
        message: 'Which framework are you using?',
        choices: [
          { title: 'React', value: 'react' },
          { title: 'Vue', value: 'vue' },
          { title: 'Svelte', value: 'svelte' },
          { title: 'Angular', value: 'angular' },
          { title: 'Vanilla JS', value: 'vanilla' },
        ],
        initial:
          projectInfo.framework === 'vue'
            ? 1
            : projectInfo.framework === 'svelte'
              ? 2
              : projectInfo.framework === 'angular'
                ? 3
                : projectInfo.framework === 'vanilla'
                  ? 4
                  : 0,
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Are you using TypeScript?',
        initial: projectInfo.hasTypeScript,
      },
      {
        type: 'confirm',
        name: 'tailwind',
        message: 'Are you using Tailwind CSS?',
        initial: projectInfo.hasTailwind,
      },
      {
        type: 'select',
        name: 'defaultCalendar',
        message: 'Default calendar type:',
        choices: [
          { title: 'BS (Bikram Sambat / Nepali)', value: 'BS' },
          { title: 'AD (Gregorian)', value: 'AD' },
        ],
        initial: 0,
      },
      {
        type: 'select',
        name: 'locale',
        message: 'Default locale:',
        choices: [
          { title: 'English', value: 'en' },
          { title: 'Nepali (नेपाली)', value: 'ne' },
        ],
        initial: 0,
      },
      {
        type: 'text',
        name: 'componentsAlias',
        message: 'Components alias (e.g., @/components):',
        initial: '@/components',
      },
      {
        type: 'text',
        name: 'utilsAlias',
        message: 'Utils alias (e.g., @/lib/utils):',
        initial: '@/lib/utils',
      },
      {
        type: 'confirm',
        name: 'useSrcDir',
        message: 'Are you using a src/ directory?',
        initial: projectInfo.hasSrcDir,
      },
    ]);

    if (!response.framework) {
      console.log(chalk.yellow('Initialization cancelled.'));
      return;
    }

    // Create config
    const config: Config = {
      framework: response.framework,
      typescript: response.typescript,
      tailwind: response.tailwind,
      baseDir: response.useSrcDir ? 'src' : '',
      defaultCalendar: response.defaultCalendar,
      locale: response.locale,
      aliases: {
        components: response.componentsAlias,
        utils: response.utilsAlias,
      },
    };

    // Write config file
    spinner.start('Writing configuration...');
    await writeConfig(cwd, config);
    spinner.succeed('Configuration written to calendar.config.json');

    // Install core dependency
    const { installDeps } = await prompts({
      type: 'confirm',
      name: 'installDeps',
      message: 'Install @thaparoyal/calendar-core dependency?',
      initial: true,
    });

    if (installDeps) {
      spinner.start('Installing dependencies...');

      // Detect package manager
      const hasYarnLock = await fs.pathExists(path.join(cwd, 'yarn.lock'));
      const hasPnpmLock = await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'));
      const hasBunLock = await fs.pathExists(path.join(cwd, 'bun.lockb'));

      let packageManager = 'npm';
      if (hasPnpmLock) packageManager = 'pnpm';
      else if (hasYarnLock) packageManager = 'yarn';
      else if (hasBunLock) packageManager = 'bun';

      const installCmd = packageManager === 'npm' ? 'install' : 'add';
      const frameworkPkg = `@thaparoyal/calendar-${response.framework}`;

      try {
        await execa(packageManager, [installCmd, '@thaparoyal/calendar-core', frameworkPkg], {
          cwd,
          stdio: 'pipe',
        });
        spinner.succeed('Dependencies installed');
      } catch (error) {
        spinner.warn('Failed to install dependencies. Please install manually:');
        console.log(
          chalk.cyan(`  ${packageManager} ${installCmd} @thaparoyal/calendar-core ${frameworkPkg}`)
        );
      }
    }

    console.log();
    console.log(chalk.green('✓ Calendar initialized successfully!'));
    console.log();
    console.log('Next steps:');
    console.log(chalk.cyan('  1. Run `npx trc add calendar` to add the calendar component'));
    console.log(chalk.cyan('  2. Import and use the component in your app'));
    console.log();
  } catch (error) {
    spinner.fail('Initialization failed');
    console.error(error);
    process.exit(1);
  }
}
