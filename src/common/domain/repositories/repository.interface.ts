// tipagem de parametro ou de retorno. ultiliza o type
export type SearchInput = {
    page?: number
    per_page?: number
    sort?: string | null
    sort_dir?: string | null
    filter?: string | null 
}

export type SearchOutput<Model> = {
    items: Model[]
    per_page: number
    total: number 
    current_page: number 
    sort: string | null
    sort_dir: string | null
    filter: string | null 
}

// uso a interfce para definir as interfaces do modelo de negocio, modelo de dados. algo que está relacionada a camada de dominio
export interface RepositoryInterface<Model, CreateProps> {
    // e esse metodo(create) ele não faz incersão no banco de dados, 
    // ele é pra criar um objeto, uma instacia de um modelo de dados
    // Exp: quando eu crio um modelo de tipo user, eu estou criando em memoria, um objeto, uma instacia,
    // agora, para eu persistir esses dados que estão em memoria, que estão em instacia pra persistir no banco de dados
    // ai é outro metodo(INSERT)
    create(props: CreateProps): Model
    insert(model: Model): Promise<Model>
    // quando for fazer um findbyid irei buscar por id, uma informação qua esta armazenada em array, não esta em um banco de dados, ouseja, em memoria.
    findById(id: string): Promise<Model | null>
    update(model: Model): Promise<Model>
    delete(id: string): Promise<void>
    // aqui vamos definir quais parametro a gente vai estar recebendo e o que vai ser retornado
    // nesse curso vai ser implementado a paginção, ordenação e filtro, para toda listagem de dados q for retornado
    // então esse metodo search vai precisa considerar isso 
    search(props: SearchInput): Promise<SearchOutput<Model>>
}

// memory ele vai trabalhar com um array, nãi vai ter persistecia de dados num banco de dados
// a gente criar um array para ser o repositorio das infromações e quando eu executar um insert, por exemplo
// vai esta insereindo uma informação naquele array que é o repositorio de dados
