import { BusinessOwner } from '@/domain/application/entities/business-owner';
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateBusinessOwnerUseCase } from '@/domain/application/use-cases/create-business-owner'
import { InMemoryBusinessOwnerRepository } from 'test/repositories/in-memory-business-owner'

let inMemoryBusinessOwnerRepository: InMemoryBusinessOwnerRepository
let sut: CreateBusinessOwnerUseCase

describe('Create Business Owner', () => {
    beforeEach(() => {
        inMemoryBusinessOwnerRepository = new InMemoryBusinessOwnerRepository
        sut = new CreateBusinessOwnerUseCase(inMemoryBusinessOwnerRepository)
    })

    it('should be able to create a business owner', async () => { 
        const result = await sut.execute({ 
            businessId:'123e4567-e89b-12d3-a456-426614174000',
            name: 'Gregori Trentin',
            email: 'gregori.trentin@br.com',
            phone: '54999677390',
            document: '1234.5.67-8901',
            addressLine1: 'Arvore',
            addressLine2: '145',
            addressLine3: 'jd. das 145',
            neighborhood: 'São Paulo',
            postalCode: '12345-678',
            countryCode: 'BR',
            stateCode: '25447 ',
            cityCode: '165',
            birthDate: new Date(1984-10-10),
            status: 'PENDING',
            ownerType: 'owner',
    
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryBusinessOwnerRepository.items[0]).toEqual(result.value?.businessOwner)
    })

    it('should persist business owner data correctly', async () => {
        const result = await sut.execute({
            businessId:'123e4567-e89b-12d3-a456-426614174000',
            name: 'Gregori Trentin',
            email: 'gregori.trentin@br.com',
            phone: '54999677390',
            document: '1234.5.67-8901',
            addressLine1: 'Arvore',
            addressLine2: '145',
            addressLine3: 'jd. das 145',
            neighborhood: 'São Paulo',
            postalCode: '12345-678',
            countryCode: 'BR',
            stateCode: '25447 ',
            cityCode: '165',
            birthDate: new Date(1984-10-10),
            status: 'PENDING',
            ownerType: 'owner',
        
    })

    const createdBusinessOwner = result.value?.businessOwner

        expect(createdBusinessOwner).toBeTruthy()
        expect(createdBusinessOwner?.name).toBe('Gregori Trentin')
        expect(createdBusinessOwner?.email).toBe('gregori.trentin@br.com')
        expect(createdBusinessOwner?.phone).toBe('54999677390')
        expect(createdBusinessOwner?.document).toBe('1234.5.67-8901')
        expect(createdBusinessOwner?.status).toBe('PENDING')

    })


    it('should persist business owner data correctly with null optional fields', async () => {
        const result = await sut.execute({
            businessId:'123e4567-e89b-12d3-a456-426614174000',
            name: 'Gregori Trentin',
            email: 'gregori.trentin@br.com',
            phone: '54999677390',
            document: '1234.5.67-8901',
            addressLine1: 'Arvore',
            addressLine2: '145',
            addressLine3: null,
            neighborhood: 'São Paulo',
            postalCode: '12345-678',
            countryCode: 'BR',
            stateCode: '25447 ',
            cityCode: '165',
            birthDate: new Date(1984-10-10),
            status: 'PENDING',
            ownerType: 'owner',
        
    })

expect(result.isRight()).toBe(true)
const createdBusinessOwner = result.value?.businessOwner

   // Verifica se a pessoa foi criada com sucesso
        expect(createdBusinessOwner).toBeTruthy()

        // Verifica especificamente os campos opcionais
        expect(createdBusinessOwner?.addressLine3).toBeNull()

        // Verifica se os outros campos obrigatórios continuam corretos
        expect(createdBusinessOwner?.name).toBe('Gregori Trentin')
        expect(createdBusinessOwner?.addressLine1).toBe('Arvore')
        expect(createdBusinessOwner?.addressLine2).toBe('145')

        // Verifica se o objeto foi persistido corretamente no repositório
        expect(inMemoryBusinessOwnerRepository.items[0]).toEqual(createdBusinessOwner)

})

})