// scripts/migration/scan.ts
import * as fs from 'fs';
import * as path from 'path';

interface FileEntry {
    path: string;
    category: string;
    type: string;
    context: string | null;  // Alterado de undefined para string | null
}

class ProjectScanner {
    private files: FileEntry[] = [];
    private readonly ignoreDirs = ['node_modules', 'dist', 'coverage', 'src_backup'];

    async scan() {
        console.log('🔍 Iniciando escaneamento do projeto...\n');

        this.scanDirectory('src');
        this.analyzeFiles();

        console.log('\n✅ Escaneamento concluído!');
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
        let category = 'unknown';
        let type = 'unknown';
        let context: string | null = null;

        // Database related files
        if (normalizedPath.includes('mapper')) {
            category = 'database';
            type = 'mapper';
        } else if (normalizedPath.includes('repository')) {
            category = 'database';
            type = 'repository';
        }

        // Queue related files
        else if (normalizedPath.includes('queues/consumers')) {
            category = 'queue';
            type = 'consumer';
        } else if (normalizedPath.includes('queues/producers')) {
            category = 'queue';
            type = 'producer';
        }

        // Service related files
        else if (normalizedPath.includes('services')) {
            category = 'service';
            type = normalizedPath.includes('third-party') ? 'third-party' : 'service';
        }

        // Provider related files
        else if (normalizedPath.includes('providers')) {
            category = 'provider';
            type = 'provider';
        }

        // Domain related files
        else if (normalizedPath.includes('domain')) {
            category = 'domain';
            if (normalizedPath.includes('entities')) type = 'entity';
            else if (normalizedPath.includes('use-cases')) type = 'use-case';
            else if (normalizedPath.includes('repositories')) type = 'repository-interface';
            else type = 'domain';
        }

        // Extract context from path
        const contextMatch = normalizedPath.match(/src\/(?:domain|infra)\/([^/]+)/);
        if (contextMatch) {
            context = contextMatch[1];
        }

        this.files.push({
            path: normalizedPath,
            category,
            type,
            context
        });
    }

    private analyzeFiles() {
        console.log('📊 Análise de arquivos:\n');

        // Group by category
        const groupedByCategory = this.groupBy(this.files, 'category');
        
        for (const [category, files] of Object.entries(groupedByCategory)) {
            console.log(`\n${category.toUpperCase()}:`);
            
            // Group by type within category
            const groupedByType = this.groupBy(files, 'type');
            
            for (const [type, typeFiles] of Object.entries(groupedByType)) {
                console.log(`\n  ${type}:`);
                
                // Group by context if available
                const groupedByContext = this.groupBy(typeFiles, 'context');
                
                for (const [context, contextFiles] of Object.entries(groupedByContext)) {
                    if (context === 'null') {
                        contextFiles.forEach(file => {
                            console.log(`    - ${file.path}`);
                        });
                    } else {
                        console.log(`    ${context}:`);
                        contextFiles.forEach(file => {
                            console.log(`      - ${file.path}`);
                        });
                    }
                }
            }
        }

        // Print summary
        console.log('\n📈 Sumário:');
        console.log(`Total de arquivos: ${this.files.length}`);
        
        const categoryCounts = this.groupBy(this.files, 'category');
        Object.entries(categoryCounts).forEach(([category, files]) => {
            console.log(`${category}: ${files.length} arquivos`);
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
}

// Execute scanner
new ProjectScanner().scan().catch(console.error);