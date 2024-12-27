import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const BACKUP_DIR = path.resolve(process.cwd(), 'backup-final');

interface MoveOperation {
  from: string;
  to: string;
}

async function main() {
  try {
    console.log('🚀 Iniciando ajustes finais de estrutura...\n');

    // 1. Backup
    await createBackup();

    // 2. Mover arquivos restantes do shared
    await moveSharedFiles();

    // 3. Reorganizar estrutura dos módulos
    await reorganizeModules();

    // 4. Padronizar nomes
    await standardizeNames();

    // 5. Limpar diretórios vazios
    await cleanEmptyDirectories();

    console.log('\n✅ Ajustes finais concluídos!');
  } catch (error) {
    console.error('\n❌ Erro durante os ajustes:', error);
    await rollback();
    process.exit(1);
  }
}

async function createBackup() {
  console.log('📦 Criando backup...');
  if (await fs.pathExists(BACKUP_DIR)) {
    await fs.remove(BACKUP_DIR);
  }
  await fs.copy(SRC_DIR, BACKUP_DIR);
}

async function moveSharedFiles() {
  console.log('🔄 Movendo arquivos do shared...');

  const moves: MoveOperation[] = [
    { from: 'shared/app.module.ts', to: 'core/infra/module.ts' },
    { from: 'shared/database', to: 'core/infra/database' },
    { from: 'shared/env', to: 'core/infra/config' },
    { from: 'shared/http', to: 'core/infra/http' },
    { from: 'shared/transaction', to: 'core/infra/database/transaction' },
    { from: 'shared/utils', to: 'core/utils' }
  ];

  for (const move of moves) {
    const fromPath = path.join(SRC_DIR, move.from);
    const toPath = path.join(SRC_DIR, move.to);

    if (await fs.pathExists(fromPath)) {
      await fs.ensureDir(path.dirname(toPath));
      await fs.move(fromPath, toPath, { overwrite: true });
    }
  }
}

async function reorganizeModules() {
  console.log('🔄 Reorganizando módulos...');

  const modules = await fs.readdir(path.join(SRC_DIR, 'modules'));

  for (const module of modules) {
    const modulePath = path.join(SRC_DIR, 'modules', module);
    if (!(await fs.stat(modulePath)).isDirectory()) continue;

    // Criar nova estrutura
    await fs.ensureDir(path.join(modulePath, 'infra/http/controllers'));
    await fs.ensureDir(path.join(modulePath, 'infra/http/presenters'));

    // Mover controllers
    const controllers = glob.sync(path.join(modulePath, 'infra/controllers/**/*.ts'));
    for (const controller of controllers) {
      const fileName = path.basename(controller);
      const newPath = path.join(modulePath, 'infra/http/controllers', fileName);
      if (await fs.pathExists(controller)) {
        await fs.move(controller, newPath, { overwrite: true });
      }
    }

    // Mover presenters
    const presenters = glob.sync(path.join(modulePath, 'infra/presenters/**/*.ts'));
    for (const presenter of presenters) {
      const fileName = path.basename(presenter);
      const newPath = path.join(modulePath, 'infra/http/presenters', fileName);
      if (await fs.pathExists(presenter)) {
        await fs.move(presenter, newPath, { overwrite: true });
      }
    }
  }
}

async function standardizeNames() {
  console.log('📝 Padronizando nomes...');

  const files = glob.sync(path.join(SRC_DIR, '**/*.ts'));

  for (const file of files) {
    const fileName = path.basename(file);
    let newFileName = fileName;

    // Remover sufixo -controller
    if (fileName.includes('.controller.ts')) {
      newFileName = fileName.replace('.controller.ts', '.ts');
    }

    // Corrigir typos conhecidos
    if (fileName.includes('delele-')) {
      newFileName = fileName.replace('delele-', 'delete-');
    }

    if (newFileName !== fileName && await fs.pathExists(file)) {
      const newPath = path.join(path.dirname(file), newFileName);
      await fs.move(file, newPath, { overwrite: true });

      // Atualizar importações no conteúdo do arquivo
      const content = await fs.readFile(newPath, 'utf8');
      const updatedContent = content
        .replace(/\.controller'/g, "'")
        .replace(/\.controller"/g, '"')
        .replace(/delele-/g, 'delete-');
      await fs.writeFile(newPath, updatedContent);
    }
  }
}

async function cleanEmptyDirectories() {
  console.log('🧹 Limpando diretórios vazios...');
  
  const isEmptyDir = async (dir: string): Promise<boolean> => {
    const items = await fs.readdir(dir);
    return items.length === 0;
  };

  const findEmptyDirs = async (startPath: string): Promise<string[]> => {
    let emptyDirs: string[] = [];
    const items = await fs.readdir(startPath);
    
    for (const item of items) {
      const fullPath = path.join(startPath, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        if (await isEmptyDir(fullPath)) {
          emptyDirs.push(fullPath);
        } else {
          emptyDirs = emptyDirs.concat(await findEmptyDirs(fullPath));
        }
      }
    }
    
    return emptyDirs;
  };

  const emptyDirs = await findEmptyDirs(SRC_DIR);
  for (const dir of emptyDirs) {
    await fs.remove(dir);
  }
}

async function rollback() {
  console.log('🔄 Realizando rollback...');
  await fs.remove(SRC_DIR);
  if (await fs.pathExists(BACKUP_DIR)) {
    await fs.move(BACKUP_DIR, SRC_DIR);
  }
}

main().catch(console.error);