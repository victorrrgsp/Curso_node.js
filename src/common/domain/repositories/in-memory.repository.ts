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

export abstract class InMemoryRepository<Model extends > implements RepositoryInterface<Model, CreateProps > {

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
    search(props: SearchInput): Promise<SearchOutput<Model>> {
        const page = props.page ?? 1
        const per_page = props.per_page ?? 15
        const sort = props.sort ?? null
        const sort_dir = props.sort_dir ?? null
        const filter = props.filter ?? null
    }

    // agora vamos definir os metodos que vão aplicar esses recursos a aplicar filtro, ordenação e paginação, onde cada funcionalidade vai esta em um metodo diferente
    protected abstract applyFilter (items: Model[], filter: string | null): promise<Model[]>
    
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
