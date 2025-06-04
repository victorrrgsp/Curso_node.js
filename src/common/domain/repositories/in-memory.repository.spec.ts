// é uma classe concreta q extend da class abstrata InMemoryRepository
import { randomUUID } from "crypto"
import { InMemoryRepository } from "./in-memory.repository"
import { NotFoundError } from "../erros/not-found-erro"

// stub é um termo usado para dublês q sao as propriedades
type StubModelProps = {
    id: string,
    name: string,
    price: number,
    created_at: Date,
    updated_at: Date
}

// aqui vai estender a class de InMemoryRepository
class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
    constructor() {
        super()
        this.sortableFields = ['name'] 
    }
    // é um metodo abstrato q vem da class InMemoryRepository
    protected async applyFilter(items: StubModelProps[], filter: string | null): Promise<StubModelProps[]> {
        if (!filter) return items;

        // Vai filtrar todos os registros cujo 'name', em minúsculo, contém o filtro (também em minúsculo)
        return items.filter(
            item => item.name.toLowerCase().includes(filter.toLowerCase()),
        );
    }
}

// essa é a estrutura do teste
describe('InMemoryRepository unit tests', () => {
    let sut: StubInMemoryRepository
    let model: StubModelProps
    let props: any
    let created_at: Date
    let updated_at: Date

    beforeEach(() => {
        // antes de cada teste, eu crio uma instacia da classe Stub
        //  cada teste cria uma nova instacia do repositorio, 
        // ai o array de items é zerado
        sut = new StubInMemoryRepository()
        // defino os valores de created_at e updated_at
        created_at = new Date()
        updated_at = new Date()
        props = {
            name: 'test name',
            price: 10
        }
        model = {
            id: randomUUID(),
            created_at,
            updated_at,
            ...props
        }
    })

    describe('create', () => {
        it('should create new model', () => {
            const result = sut.create(props)
            expect(result.name).toStrictEqual('test name')
        })
    })
        

    describe('insert', () => {
        it('should inserts new model', async () => {
            const result = await sut.insert(model)
            expect(result).toStrictEqual(sut.items[0])
        })
    })

    describe('findById', () => {
        it('should throw error when id not found', async () => {
            await expect(sut.findById('fake_id')).rejects.toThrow(
                new NotFoundError('Model not found using ID fake_id'),
            )
            const id = randomUUID()
            await expect(sut.findById(id)).rejects.toThrow(
                new NotFoundError(`Model not found using ID ${id}`)
            )
        })

        // vai procurar um model pelo id e vai disparar um erro quando não encontrar o id
        it('should find a model by id', async () => {
            const data = await sut.insert(model)
            const result = await sut.findById(model.id)
            expect(result).toStrictEqual(data)
        })
    })
    
    
    describe('update', () => {
        it('should throw error when id not found', async () => {
            // o update recebe um model como parametro 
            await expect(sut.update(model)).rejects.toThrow(
                new NotFoundError(`Model not found using ID ${model.id}`)
            )
        })

        // aqui ele verifica se o model foi inserido no array de items
        it('should update an model', async () => {
            // aqui ele chama o metodo insert passando o model
            const data = await sut.insert(model)
            // aqui ele verifica se o array existe no banco de dados e o tamanho é igual a 1
            const modelUpdated = {
                id: data.id,
                name: 'updated name',
                price: 2000, 
                created_at,
                updated_at
            }
            // aqui ele chama o metodo update passando o model atualizado
            const result = await sut.update(modelUpdated)
            // aqui ele verifica se o model foi atualizado corretamente
            expect(result).toStrictEqual(sut.items[0])
        })
    })

    describe('delete', () => {
        // aqui ele verifica se o id passado como parametro não existe, e dispara um erro
        it('should throw error when id not found', async () => {
            // aqui ele chama o metodo delete passando um id que não existe,
            // e espera que seja disparado um erro do tipo NotFoundError
            await expect(sut.delete('fake_id')).rejects.toThrow(
                new NotFoundError('Model not found using ID fake_id'),
            )
            // aqui ele chama o metodo delete passando um id que não existe,
            const id = randomUUID()
            // e espera que seja disparado um erro do tipo NotFoundError
            // com a mensagem de erro personalizada
            await expect(sut.delete(id)).rejects.toThrow(
                new NotFoundError(`Model not found using ID ${id}`)
            )
        })

        // aqui ele verifica se o model foi inserido no array de items
        it('should delete an model', async () => {
            // aqui ele chama o metodo insert passando o model
            const data = await sut.insert(model)
            // ele verifica se o array existe no banco de dados q o tamanho seja igual a 1
            expect(sut.items.length).toBe(1)
            // aqui ele chama o metodo delete passando o id do model
            await sut.delete(model.id)
            // aqui ele verifica se o array esta vazio
            expect(sut.items.length).toBe(0)
        })
    })

    describe('applyFilter', () => {
        // aqui estou criando um teste para verificar se o metodo applyFilter esta filtrando os items corretamente
        it('should no filter items when filter parameter is null', async () => {
            // aqui estou criando um array de items, onde o primeiro e o segundo item tem o nome 'test' e 'TEST'
            const items = [ model ]
            // aqui estou criando um spy para o metodo filter do array de items 
            const spyFilterMethod = jest.spyOn(items, 'filter' as any)
            // aqui estou chamando o metodo applyFilter passando o array de items e o filtro null
            const result = await sut['applyFilter'](items, null)
            // aqui estou verificando se o metodo filter foi chamado e se o resultado é igual ao array de items
            expect(spyFilterMethod).not.toHaveBeenCalled()
            // aqui estou verificando se o resultado é igual ao array de items
            expect(result).toStrictEqual(items)
        })
        // aqui estou criando um teste para verificar se o metodo applyFilter esta filtrando os items corretamente
        it('should filter the data using filter parameter', async () => {
            // aqui estou criando uma data para ser usada como created_at e updated_at
            const items = [ 
                { id: randomUUID(), name: 'test', price: 10, created_at, updated_at },
                { id: randomUUID(), name: 'TEST', price: 20, created_at, updated_at },
                { id: randomUUID(), name: 'fake', price: 30, created_at, updated_at },
            ]
            // aqui estou criando um array de items, onde o primeiro e o segundo item tem o nome 'test' e 'TEST'
            const spyFilterMethod = jest.spyOn(items, 'filter' as any)
            // aqui estou chamando o metodo applyFilter passando o array de items e o filtro 'TEST'
            let result = await sut['applyFilter'](items, 'TEST')
            // aqui estou verificando se o metodo filter foi chamado uma vez e se o resultado é igual aos dois primeiros items
            expect(spyFilterMethod).toHaveBeenCalledTimes(1)
            expect(result).toStrictEqual([items[0], items[1]])

            // aqui estou chamando o metodo applyFilter passando o array de items e o filtro 'test'
            result = await sut['applyFilter'](items, 'test')
            // aqui estou verificando se o metodo filter foi chamado mais uma vez e se o resultado é igual aos dois primeiros items
            expect(spyFilterMethod).toHaveBeenCalledTimes(2)
            expect(result).toStrictEqual([items[0], items[1]])

            // aqui estou chamando o metodo applyFilter passando o array de items e o filtro 'fake'
            result = await sut['applyFilter'](items, 'no-filter')
            // aqui estou verificando se o metodo filter foi chamado mais uma vez e se o resultado é um array vazio
            expect(spyFilterMethod).toHaveBeenCalledTimes(3)
            expect(result).toHaveLength(0)
        })
    })

    describe('applySort', () => {
        it('should sort items', async () => {
            const items = [ 
                { id: randomUUID(), name: 'b', price: 10, created_at, updated_at },
                { id: randomUUID(), name: 'a', price: 20, created_at, updated_at },
                { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
            ]
            let result = await sut['applySort'](items, 'name', 'desc')
            expect(result).toStrictEqual([items[2], items[0], items[1]])

            result = await sut['applySort'](items, 'name', 'asc')
            expect(result).toStrictEqual([items[1], items[0], items[2]])
        })
    })

    describe('applyPaginate', () => {
        it('should paginate items', async () => {
            const items = [ 
                { id: randomUUID(), name: 'a', price: 10, created_at, updated_at },
                { id: randomUUID(), name: 'b', price: 20, created_at, updated_at },
                { id: randomUUID(), name: 'c', price: 30, created_at, updated_at },
                { id: randomUUID(), name: 'd', price: 20, created_at, updated_at },
                { id: randomUUID(), name: 'e', price: 30, created_at, updated_at },
            ]
            let result = await sut['applyPaginate'](items, 1, 2)
            expect(result).toStrictEqual([items[0], items[1]])

            result = await sut['applyPaginate'](items, 2, 2)
            expect(result).toStrictEqual([items[2], items[3]])

            result = await sut['applyPaginate'](items, 2, 3)
            expect(result).toStrictEqual([items[3], items[4]])
        })
    })
})
