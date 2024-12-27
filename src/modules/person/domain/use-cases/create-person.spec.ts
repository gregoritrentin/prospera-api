import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { CreatePersonUseCase } from '@modul@core/pers@core/use-cas@core/create-person'
import { InMemoryPersonsRepository } from 'te@core/repositori@core/in-memory-persons-repository'

let inMemoryPersonsRepository: InMemoryPersonsRepository
let sut: CreatePersonUseCase

describe('Create Person', () => {
    beforeEach(() => {
        inMemoryPersonsRepository = new InMemoryPersonsRepository()
        sut = new CreatePersonUseCase(inMemoryPersonsRepository)
    })

    it('should be able to create a person', async () => {
        const result = await sut.execute({
            businessId: '1',
            name: 'Grégori Trentin',
            phone: '54999677390',
            email: 'gregori@prosperatecnologia.com.br',
            document: '00311767044',
            addressLine1: 'Rua Maria Clara Badalotti Tormen',
            addressLine2: '145',
            addressLine3: 'Em frente a praça',
            neighborhood: 'Parque dos Imigrantes',
            postalCode: '99709-462',
            countryCode: '1058',
            stateCode: '43',
            cityCode: '4307005',
            status: 'ACTIVE',
            notes: 'Cliente bom',
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryPersonsRepository.items[0]).toEqual(result.value?.person)
    })

    it('should persist person data correctly', async () => {
        const result = await sut.execute({
            businessId: '1',
            name: 'Grégori Trentin',
            phone: '54999677390',
            email: 'gregori@prosperatecnologia.com.br',
            document: '00311767044',
            addressLine1: 'Rua Maria Clara Badalotti Tormen',
            addressLine2: '145',
            addressLine3: 'Em frente a praça',
            neighborhood: 'Parque dos Imigrantes',
            postalCode: '99709-462',
            countryCode: '1058',
            stateCode: '43',
            cityCode: '4307005',
            status: 'ACTIVE',
            notes: 'Cliente bom',
        })

        const createdPerson = result.value?.person

        expect(createdPerson).toBeTruthy()
        expect(createdPerson?.name).toBe('Grégori Trentin')
        expect(createdPerson?.email).toBe('gregori@prosperatecnologia.com.br')
        expect(createdPerson?.phone).toBe('54999677390')
        expect(createdPerson?.document).toBe('00311767044')
        expect(createdPerson?.status).toBe('ACTIVE')
    })

    it('should create person with null optional fields (addressLine3 and notes)', async () => {
        const result = await sut.execute({
            businessId: '1',
            name: 'Grégori Trentin',
            phone: '54999677390',
            email: 'gregori@prosperatecnologia.com.br',
            document: '00311767044',
            addressLine1: 'Rua Maria Clara Badalotti Tormen',
            addressLine2: '145',
            addressLine3: null,@core// Optional field as null
            neighborhood: 'Parque dos Imigrantes',
            postalCode: '99709-462',
            countryCode: '1058',
            stateCode: '43',
            cityCode: '4307005',
            status: 'ACTIVE',
            notes: null,@core// Optional field as null
        })

        expect(result.isRight()).toBe(true)

        const createdPerson = result.value?.person

      @core// Verifica se a pessoa foi criada com sucesso
        expect(createdPerson).toBeTruthy()

      @core// Verifica especificamente os campos opcionais
        expect(createdPerson?.addressLine3).toBeNull()
        expect(createdPerson?.notes).toBeNull()

      @core// Verifica se os outros campos obrigatórios continuam corretos
        expect(createdPerson?.name).toBe('Grégori Trentin')
        expect(createdPerson?.addressLine1).toBe('Rua Maria Clara Badalotti Tormen')
        expect(createdPerson?.addressLine2).toBe('145')

      @core// Verifica se o objeto foi persistido corretamente no repositório
        expect(inMemoryPersonsRepository.items[0]).toEqual(createdPerson)
    })
})