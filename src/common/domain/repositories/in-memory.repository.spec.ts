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
        if (!filter) {
            // vai fazer esse filtro pagar todos os registros em campo name transformado em minusculo(toLowerCase), 
            // e verifica se contem o name em minusculo no filter,
            // onde vai retorna uma coleção pra mim
            return items.filter(
                item => item.name.toLowerCase().includes(filter.toLowerCase()),
            )
        }
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

        it('should update an model', async () => {
            // aqui esta atualizando uma informaçõa pre existente
            const data = await sut.insert(model)
            const modelUpdated = {
                id: data.id,
                name: 'updated name',
                price: 2000, 
                created_at,
                updated_at
            }
            const result = await sut.update(modelUpdated)
            expect(result).toStrictEqual(sut.items[0])
        })
    })

    describe('delete', () => {
        it('should throw error when id not found', async () => {
            // o delete tambem tem como parametro uma string
            await expect(sut.delete('fake_id')).rejects.toThrow(
                new NotFoundError('Model not found using ID fake_id'),
            )
            const id = randomUUID()
            await expect(sut.delete(id)).rejects.toThrow(
                new NotFoundError(`Model not found using ID ${id}`)
            )
        })

        it('should delete an model', async () => {
            const data = await sut.insert(model)
            // ele verifica se o array existe no banco de dados q o tamanho seja igual a 1
            expect(sut.items.length).toBe(1)
            await sut.delete(model.id)
            expect(sut.items.length).toBe(0)
        })
    })
})
