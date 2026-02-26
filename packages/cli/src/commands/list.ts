import chalk from 'chalk';
import { getRegistryItem, getRegistryNames } from '../utils/registry.js';

/**
 * List available components
 */
export async function list() {
  console.log();
  console.log(chalk.bold('Available components:'));
  console.log();

  const components = getRegistryNames();

  for (const name of components) {
    const item = getRegistryItem(name)!;
    const typeLabel = getTypeLabel(item.type);

    console.log(`  ${chalk.cyan(name.padEnd(20))} ${typeLabel.padEnd(12)} ${chalk.gray(item.description)}`);
  }

  console.log();
  console.log('Usage:');
  console.log(chalk.cyan('  npx trc add <component>'));
  console.log(chalk.cyan('  npx trc add calendar date-picker'));
  console.log();
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'registry:ui':
      return chalk.green('[ui]');
    case 'registry:hook':
      return chalk.blue('[hook]');
    case 'registry:lib':
      return chalk.yellow('[lib]');
    case 'registry:style':
      return chalk.magenta('[style]');
    default:
      return chalk.gray('[unknown]');
  }
}
