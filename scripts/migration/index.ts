import * as fs from 'fs';
import * as path from 'path';

class ControllerImportsFixer {
    private readonly ignoreDirs = ['node_modules', 'dist', '.git', 'coverage', 'build', 'bkp'];
    
    // Mapeamento de controllers para seus módulos corretos
    private readonly controllerMappings: Record<string, string> = {
        // Application
        'authenticate-user.controller': '@/modules/application/infra/http/controllers/authenticate-user.controller',
        'authenticate-business.controller': '@/modules/application/infra/http/controllers/authenticate-business.controller',
        'create-user.controller': '@/modules/application/infra/http/controllers/create-user.controller',
        'edit-user.controller': '@/modules/application/infra/http/controllers/edit-user.controller',
        'fetch-user.controller': '@/modules/application/infra/http/controllers/fetch-user.controller',
        'get-user.controller': '@/modules/application/infra/http/controllers/get-user.controller',
        
        // Transaction
        'create-boleto.controller': '@/modules/transaction/infra/http/controllers/create-boleto.controller',
        'fetch-boleto.controller': '@/modules/transaction/infra/http/controllers/fetch-boleto.controller',
        'create-pix.controller': '@/modules/transaction/infra/http/controllers/create-pix.controller',
        'fetch-pix.controller': '@/modules/transaction/infra/http/controllers/fetch-pix.controller',
        
        // Item
        'create-item.controller': '@/modules/item/infra/http/controllers/create-item.controller',
        'edit-item.controller': '@/modules/item/infra/http/controllers/edit-item.controller',
        'delete-item.controller': '@/modules/item/infra/http/controllers/delete-item.controller',
        'fetch-item.controller': '@/modules/item/infra/http/controllers/fetch-item.controller',

        // Person
        'create-person.controller': '@/modules/person/infra/http/controllers/create-person.controller',
        'edit-person.controller': '@/modules/person/infra/http/controllers/edit-person.controller',
        'delete-person.controller': '@/modules/person/infra/http/controllers/delete-person.controller',
        'fetch-person.controller': '@/modules/person/infra/http/controllers/fetch-person.controller',
        
        // Payment
        'create-payment-pix-key.controller': '@/modules/payment/infra/http/controllers/create-payment-pix-key.controller',
        'create-payment-pix-bank-data.controller': '@/modules/payment/infra/http/controllers/create-payment-pix-bank-data.controller',
        
        // Invoice
        'create-invoice.controller': '@/modules/invoice/infra/http/controllers/create-invoice.controller',
        'fetch-invoice.controller': '@/modules/invoice/infra/http/controllers/fetch-invoice.controller',
        
        // WhatsApp
        'whatsapp.controller': '@/modules/whatsapp/infra/http/controllers/whatsapp.controller',
    };

    async fixImports(rootDir: string = 'src'): Promise<void> {
        console.log('🔍 Iniciando correção dos imports de controllers...\n');

        const files = await this.getAllTypeScriptFiles(rootDir);
        let totalFixed = 0;

        for (const file of files) {
            try {
                const content = await fs.promises.readFile(file, 'utf8');
                const updatedContent = this.updateControllerImports(content);

                if (content !== updatedContent) {
                    // Criar backup
                    const backupDir = path.join(process.cwd(), 'bkp');
                    const relativePath = path.relative(process.cwd(), file);
                    const backupPath = path.join(backupDir, relativePath + '.bak');
                    
                    await fs.promises.mkdir(path.dirname(backupPath), { recursive: true });
                    await fs.promises.writeFile(backupPath, content);

                    // Salvar arquivo atualizado
                    await fs.promises.writeFile(file, updatedContent);
                    console.log(`✅ Atualizado: ${file}`);
                    totalFixed++;
                }
            } catch (error) {
                console.error(`❌ Erro ao processar ${file}:`, error);
            }
        }

        console.log(`\nTotal de arquivos atualizados: ${totalFixed}`);
    }

    private async getAllTypeScriptFiles(dir: string): Promise<string[]> {
        const files: string[] = [];
        
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                if (!this.ignoreDirs.includes(entry.name)) {
                    files.push(...await this.getAllTypeScriptFiles(fullPath));
                }
            } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
                files.push(fullPath);
            }
        }

        return files;
    }

    private updateControllerImports(content: string): string {
        let updatedContent = content;

        // Corrigir imports do padrão @/core/infra/http/controllers
        const coreImportPattern = /@\/core\/infra\/http\/controllers\/([^'"]+)/g;
        updatedContent = updatedContent.replace(coreImportPattern, (match, controllerPath) => {
            const controllerName = path.basename(controllerPath);
            return this.controllerMappings[controllerName] || match;
        });

        // Corrigir outros padrões comuns de imports incorretos
        Object.entries(this.controllerMappings).forEach(([controllerName, newPath]) => {
            const patterns = [
                new RegExp(`from ['"]@/infra/http/controllers/${controllerName}['"]`, 'g'),
                new RegExp(`from ['"]@/controllers/${controllerName}['"]`, 'g'),
                new RegExp(`from ['"]../../controllers/${controllerName}['"]`, 'g'),
                new RegExp(`from ['"]../controllers/${controllerName}['"]`, 'g')
            ];

            patterns.forEach(pattern => {
                updatedContent = updatedContent.replace(pattern, `from '${newPath}'`);
            });
        });

        return updatedContent;
    }

    async verifyRemainingIssues(): Promise<void> {
        console.log('\n🔍 Verificando imports problemáticos remanescentes...');
        
        const files = await this.getAllTypeScriptFiles('src');
        const issues: string[] = [];

        for (const file of files) {
            const content = await fs.promises.readFile(file, 'utf8');
            
            // Procurar por imports problemáticos
            if (content.includes('@/core/infra/http/controllers') || 
                content.includes('@/infra/http/controllers')) {
                issues.push(file);
            }
        }

        if (issues.length > 0) {
            console.log('\n⚠️  Arquivos com possíveis problemas:');
            issues.forEach(file => console.log(`- ${file}`));
        } else {
            console.log('\n✅ Nenhum problema encontrado!');
        }
    }
}

// Executar o script
async function main() {
    const fixer = new ControllerImportsFixer();
    
    try {
        await fixer.fixImports();
        await fixer.verifyRemainingIssues();
        console.log('\n✨ Processo concluído!');
    } catch (error) {
        console.error('\n❌ Erro durante o processo:', error);
        process.exit(1);
    }
}

main();