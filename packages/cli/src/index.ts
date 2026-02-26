import { Command } from 'commander';
import chalk from 'chalk';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
import { list } from './commands/list.js';

const program = new Command();

program
  .name('trc')
  .description('CLI for @thaparoyal/calendar - Add calendar components to your project')
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('Initialize calendar configuration in your project')
  .option('-c, --cwd <path>', 'Working directory', process.cwd())
  .action(async (options) => {
    await init(options.cwd);
  });

// Add command
program
  .command('add')
  .description('Add calendar components to your project')
  .argument('[components...]', 'Components to add')
  .option('-c, --cwd <path>', 'Working directory', process.cwd())
  .option('-y, --yes', 'Skip confirmation prompts', false)
  .action(async (components, options) => {
    await add(components, options.cwd, { yes: options.yes });
  });

// List command
program
  .command('list')
  .alias('ls')
  .description('List all available components')
  .action(async () => {
    await list();
  });

// Parse and handle errors
program.parseAsync(process.argv).catch((error) => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
