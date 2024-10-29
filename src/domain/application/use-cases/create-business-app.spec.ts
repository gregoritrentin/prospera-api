import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateBusinessAppUseCase } from '@/domain/application/use-cases/create-business-app'
import { InMemoryBusinessAppRepository } from 'test/repositories/in-memory-business-app'

let inMemoryBusinessAppRepository: InMemoryBusinessAppRepository
let sut: CreateBusinessAppUseCase

describe('Create Business App', () => {
    beforeEach(() => {
        inMemoryBusinessAppRepository = new InMemoryBusinessAppRepository
        sut = new CreateBusinessAppUseCase(inMemoryBusinessAppRepository)
    })

    it('shou0ld be able to create a business app', async () => { 
        const result = await sut.execute({ 
            businessId: '123e4567-e89b-12d3-a456-426614174000',
            appId:'550e8400-e29b-41d4-a716',
            price: 2,
            quantity: 32,
    
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryBusinessAppRepository.items[0]).toEqual(result.value?.businessApp)
    })

    it('should persist business app data correctly', async () => {
        const result = await sut.execute({
            businessId:'123e4567-e89b-12d3-a456-426614174000',
            appId:'550e8400-e29b-41d4-a716',
            price: 2,
            quantity: 32,
        
    })

    const createdBusinessApp = result.value?.businessApp

        expect(createdBusinessApp).toBeTruthy()

        expect(createdBusinessApp?.businessId).toEqual(new UniqueEntityID('123e4567-e89b-12d3-a456-426614174000'))
        expect(createdBusinessApp?.appId).toEqual(new UniqueEntityID('550e8400-e29b-41d4-a716'))
        expect(createdBusinessApp?.price).toBe(2)
        expect(createdBusinessApp?.quantity).toBe(32)

})

})