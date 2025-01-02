import * as fs from 'fs';
import * as path from 'path';

const initColors = async () => {
  try {
    return (await import('chalk')).default;
  } catch (error) {
    return {
      blue: (text: string) => text,
      green: (text: string) => text,
      yellow: (text: string) => text,
      cyan: (text: string) => text,
      red: (text: string) => text
    };
  }
};

interface FileEntry {
    path: string;
    category: string;
    type: string;
    module: string | null;
    layer: string | null;
    fullPath: string;
}

interface ModuleDependency {
    from: string;
    to: string;
    type: string;
}

interface Issue {
    type: 'error' | 'warning' | 'info';
    message: string;
    files?: string[];
}

class ProjectScanner {
    private files: FileEntry[] = [];
    private chalk: any;
    private readonly ignoreDirs = ['node_modules', 'dist', 'coverage', 'src_backup'];
    private readonly fileTypes = {
        controller: '.controller.',
        useCase: '.use-case.',
        repository: '.repository.',
        entity: '.entity.',
        presenter: '.presenter.',
        mapper: '.mapper.',
        service: '.service.',
        module: '.module.',
        test: '.spec.',
        queueConsumer: '.queue-consumer.',
        queueProducer: '.queue-producer.'
    };

    constructor() {
        this.initializeChalk();
    }

    private async initializeChalk() {
        this.chalk = await initColors();
    }

    async scan() {
        console.log('\n🔍 Iniciando escaneamento do projeto...\n');
        this.scanDirectory('src');
        this.analyzeFiles();
        this.reportIssues();
        console.log('\n✅ Escaneamento concluído!\n');
    }

    private scanDirectory(dir: string) {
        if (this.ignoreDirs.includes(path.basename(dir))) return;

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                this.scanDirectory(fullPath);
            } else if (entry.name.endsWith('.ts')) {
                this.categorizeFile(fullPath);
            }
        }
    }

    private categorizeFile(filePath: string) {
        const normalizedPath = filePath.replace(/\\/g, '/');
        const category = this.getCategory(normalizedPath);
        const type = this.getFileType(normalizedPath);
        const module = this.extractModule(normalizedPath);
        const layer = this.extractLayer(normalizedPath);

        this.files.push({
            path: this.removeDoubleExtensions(normalizedPath),
            category,
            type,
            module,
            layer,
            fullPath: filePath
        });
    }

    private removeDoubleExtensions(path: string): string {
        Object.values(this.fileTypes).forEach(type => {
            const doublePattern = new RegExp(`${type}${type}`);
            path = path.replace(doublePattern, type);
        });
        return path;
    }

    private getCategory(path: string): string {
        if (path.includes('/domain/')) return 'domain';
        if (path.includes('/infra/')) return 'infrastructure';
        if (path.includes('/application/')) return 'application';
        if (path.includes('.module.ts')) return 'module';
        if (path.includes('/shared/')) return 'shared';
        return 'unknown';
    }

    private getFileType(path: string): string {
        for (const [key, value] of Object.entries(this.fileTypes)) {
            if (path.includes(value)) return key;
        }
        return 'unknown';
    }

    private extractModule(path: string): string | null {
        const moduleMatch = path.match(/src\/modules\/([^/]+)/);
        if (moduleMatch) return moduleMatch[1];

        const coreMatch = path.match(/src\/core\/([^/]+)/);
        if (coreMatch) return `core-${coreMatch[1]}`;

        return null;
    }

    private extractLayer(path: string): string | null {
        if (path.includes('/domain/')) return 'domain';
        if (path.includes('/infra/')) return 'infrastructure';
        if (path.includes('/application/')) return 'application';
        if (path.includes('/presentation/')) return 'presentation';
        return null;
    }

    private analyzeFiles() {
        console.log('📊 Análise de estrutura do projeto:\n');
        const moduleStructure = this.groupByModuleAndCategory();
        this.printModuleStructure(moduleStructure);
        this.printDetailedStatistics();
    }

    private groupByModuleAndCategory() {
        const structure: { [key: string]: { [key: string]: FileEntry[] } } = {};

        this.files.forEach(file => {
            const moduleName = file.module || 'other';
            const category = file.category;

            if (!structure[moduleName]) {
                structure[moduleName] = {};
            }

            if (!structure[moduleName][category]) {
                structure[moduleName][category] = [];
            }

            structure[moduleName][category].push(file);
        });

        return structure;
    }

    private printModuleStructure(structure: { [key: string]: { [key: string]: FileEntry[] } }) {
        Object.keys(structure)
            .sort((a, b) => {
                if (a.startsWith('core-') && !b.startsWith('core-')) return -1;
                if (!a.startsWith('core-') && b.startsWith('core-')) return 1;
                return a.localeCompare(b);
            })
            .forEach(moduleName => {
                console.log(`${moduleName}:`);

                Object.entries(structure[moduleName])
                    .sort(([a], [b]) => {
                        const order = ['domain', 'application', 'infrastructure', 'module', 'unknown'];
                        return order.indexOf(a) - order.indexOf(b);
                    })
                    .forEach(([category, files]) => {
                        console.log(`  ${category}:`);
                        files
                            .sort((a, b) => a.path.localeCompare(b.path))
                            .forEach(file => {
                                // Mostra o caminho relativo começando de src/
                                const relativePath = file.path.substring(file.path.indexOf('src/'));
                                console.log(`    - ${relativePath}`);
                            });
                        console.log('');
                    });
            });
    }

    private printDetailedStatistics() {
        console.log('\n📈 Estatísticas Detalhadas:\n');
        console.log(`Total de arquivos: ${this.files.length}\n`);

        // Por módulo
        console.log('Arquivos por módulo:');
        const moduleStats = this.groupBy(this.files, 'module');
        Object.entries(moduleStats)
            .sort(([a], [b]) => (a || '').localeCompare(b || ''))
            .forEach(([module, files]) => {
                console.log(`${module || 'sem módulo'}: ${files.length} arquivos`);
            });

        // Por camada
        console.log('\nArquivos por camada:');
        const layerStats = this.groupBy(this.files, 'layer');
        Object.entries(layerStats)
            .sort(([a], [b]) => (a || '').localeCompare(b || ''))
            .forEach(([layer, files]) => {
                console.log(`${layer || 'sem camada'}: ${files.length} arquivos`);
            });

        // Por tipo
        console.log('\nArquivos por tipo:');
        const typeStats = this.groupBy(this.files, 'type');
        Object.entries(typeStats)
            .sort(([a], [b]) => (a || '').localeCompare(b || ''))
            .forEach(([type, files]) => {
                console.log(`${type}: ${files.length} arquivos`);
            });
    }

    private groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
        return array.reduce((result, item) => {
            const groupKey = String(item[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        }, {} as { [key: string]: T[] });
    }

    private reportIssues() {
        const issues: Issue[] = [];
        
        // Módulos sem testes
        const modulesWithoutTests = Object.entries(this.groupBy(this.files, 'module'))
            .filter(([_, files]) => !files.some(f => f.type === 'test'));
        
        if (modulesWithoutTests.length) {
            issues.push({
                type: 'warning',
                message: `Modules without tests: ${modulesWithoutTests.map(([m]) => m).join(', ')}`
            });
        }

        // Reportar os problemas encontrados
        if (issues.length > 0) {
            console.log('\n⚠️ Potential Issues:');
            issues.forEach(issue => {
                console.log(`\n${issue.message}`);
                if (issue.files) {
                    issue.files.forEach(file => console.log(`  - ${file}`));
                }
            });
        }
    }
}

// Execute scanner
new ProjectScanner().scan().catch(console.error);