
import { CreateAppUseCase } from '@/domain/application/use-cases/create-app'
import { InMemoryAppsRepository } from 'test/repositories/in-memory-app-repository'
                                                                                 
let inMemoryAppsRepository: InMemoryAppsRepository
let sut: CreateAppUseCase

describe('Create App', () => {
    beforeEach(() => {
        inMemoryAppsRepository = new InMemoryAppsRepository()
        sut = new CreateAppUseCase(inMemoryAppsRepository)
    })

    it('should be able to create a app', async () => {
        const result = await sut.execute({
           
            name: 'Nota Fiscal Eletronica',
            description: 'Gregori Trentin app',
            price: 100,
            quantity: 1,
            type: 'APP',
            status: 'ACTIVE',
      
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryAppsRepository.items[0]).toEqual(result.value?.app)
    })

    it('should persist app data correctly', async () => {
        const result = await sut.execute({
            name: 'Gregori Trentin',
            description: 'Gregori Trentin app',
            price: 100,
            quantity: 1,
            type: 'APP',
            status: 'ACTIVE'
        })

        const createdApp = result.value?.app

        expect(createdApp).toBeTruthy()
        expect(createdApp?.name).toBe('Gregori Trentin')
        expect(createdApp?.description).toBe('Gregori Trentin app')
        expect(createdApp?.price).toBe(100)
        expect(createdApp?.quantity).toBe(1)
        expect(createdApp?.type).toBe('APP')
        expect(createdApp?.status).toBe('ACTIVE')
    })


})