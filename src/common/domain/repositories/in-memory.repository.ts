import { randomUUID } from "node:crypto";
import { NotFoundError } from "../erros/not-found-erro";
import { RepositoryInterface, SearchInput, SearchOutput } from "./repository.interface";

export type ModelProps = {
    id?: string
    // quando faz isso aqui, estou dizendo que a quantidade de atributos que vai ter nesta classe pode variar
    // ao usar esse colchete, estou dizendo que esse modelo de dados pode conter um ou varios campos
    // desde que a definição do mone desse propriedade desse atributo seja uma string e o valor pode ser qualquer um 
    [key: string]: any
}

export type CreateProps = {
    [key: string]: any
}

// com esse modelo de dados no meu repository, preciso passar qual é o modelo de dados q vai ser manipulado por cada um dos metodos
// atraves do generic, posso dizer que esse model que esta sendo trazido aqui na interface, extende o ModelProps
// o modelo da dados que ser recebido para ser manipulado pelo repository sempre vai ter o id, alem de outras propriedades, que a gente não sabe quais são, mas terão

export abstract class InMemoryRepository<Model extends ModelProps> implements RepositoryInterface<Model, CreateProps > {

    items: Model[] = []
    // irei definir uma propriedade que vai dizer quais campos podem ser usados para a ordenação
    sortableFields: string[] = []

    // o create é so pra cria um objeto em memoria. esse metodo de created nao faz persistencia, então não posso pegar esse parametroe jigar dentro de items
    // o metodo q faz isso é o insert
    create(props: CreateProps): Model {
        const model = {
            id: randomUUID(),
            create_at: new Date(),
            updated_at: new Date(),
            ... props,
        }
        // o (as unknown) é so para dribla o erro de tipagem
        return model as unknown as Model
    }

    // o insert é pra persistir, onde ele pega o modelo q esta sendo recebido, e vai inserir no modelo de dados no items[]
    async insert(model: Model): Promise<Model> {
        // aqui vai inserir no array(items) o model q foi recebido com parametro
        this.items.push(model)
        return model
    }

    // esse metodo não faz nada com a informação a não ser pegar o que foi buscado e retornar
    async findById(id: string): Promise<Model> {
        return this._get(id)
    }

    async update(model: Model): Promise<Model> {
        // vai procurar qual registro q vai atualizar
        await this._get(model.id)
        // aqui estou buscando a posição do restro que foi buscado, onde verifico atraves do id
        const index = this.items.findIndex(item => item.id === model.id)
        // a posição q ele esta no array, e vai jogar a informação q eu estou recebendo por um parametro q eu quero atualizar
        this.items[index] = model
        return model
    }
    async delete(id: string): Promise<void> {
        // vai procurar qual registro q vai atualizar
        await this._get(id)
        // aqui estou buscando a posição do restro que foi buscado, onde verifico atraves do id
        const index = this.items.findIndex(item => item.id === id)
        // isso serve para excluir uma informação de dentro de um array, a posição(index) e a quantidade(1)
        this.items.splice(index, 1)
    }
    
    // o sort é para a gente informar qual campo vai ser usado para ordenar o resultado
    async search(props: SearchInput): Promise<SearchOutput<Model>> {
        const page = props.page ?? 1
        const per_page = props.per_page ?? 15
        const sort = props.sort ?? null
        const sort_dir = props.sort_dir ?? null
        const filter = props.filter ?? null

        // ele vai pegar a lista de dados q é o this.items, com filter q foi passado como parametro
        const filteredItems = await this.applyFilter(this.items, filter)
        // aqui vai ordenar o items filtrados
        const orderedItems = await this.applySort(filteredItems, sort, sort_dir)
        // aqui vai pegar os items ordenados e passar a quantidade de registros por pagina(page e per_page)
        const paginationItems = await this.applyPaginate(orderedItems, page, per_page)

        return {
            // vai retornar os items paginados
            items: paginationItems, 
            // vai pegar o total de items para saber o tamanho do items filtrados
            total: filteredItems.length,
            // pagina atual
            current_page: page,
            // a quantidade registro q tem em uma pagina
            per_page,
            sort,
            sort_dir,
            filter,
        }
    }

    // agora vamos definir os metodos que vão aplicar esses recursos a aplicar filtro, ordenação e paginação, onde cada funcionalidade vai esta em um metodo diferente
    protected abstract applyFilter (
        items: Model[], 
        filter: string | null
    ): Promise<Model[]>

    protected async applySort(
        items: Model[],
        sort: string | null,
        sort_dir: string | null,
        // vai retornar um array de model
    ): Promise<Model[]> {
        // se não for informado qual campo vai ser usado para ordenar para a ordenação da coleção de dados 
        // ou o campo q foi informado não estiver dentro do array do sortableFilds, ou seja, o array que define quais campos podem ser ordenados
        // ai não retornada
        if (!sort || !this.sortableFields.includes(sort)) {
            return items
        }

        // aqui eata sendo criado um arraydo zerosem estar sobescrevendo o array recebido pelo parametro 
        return [ ... items].sort((a, b) => {
            if (a[sort] < b[sort]) {
                return sort_dir === 'asc' ? -1 : 1
            }
            if (a[sort] > b[sort]) {
                return sort_dir === 'asc' ? 1 : -1
            }
            return
        })
    }

    protected async applyPaginate(
        items: Model[],
        page: number,
        per_page: number
    ): Promise<Model[]> {
        const start = (page - 1) * per_page
        const limit = start * per_page
        // vai fatiar o array pegando o primeiro até a quantidade de registros definida aqui(limit) 
        return items.slice(start, limit)
    }
    
    // vai precisar de um metodo q vai ser usado tanto pelo findbyid, update, delete, que é a busca da informação pelo id
    protected async _get(id: string): Promise<Model> {
        // aqui ele vai percorrer cada item
        const model = this.items.find((item) => item.id == id)
        if (!model) {
            throw new NotFoundError(`Model not found using ID ${id}`)
        }
        return model
    }

}
