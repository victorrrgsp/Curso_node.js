// usa o interface quando quer definir algo que faz parte da modelagemda aplicação(regra de negocio),
// pois está definindo uma intergace que modela um produto,
// agora para criar uma estrutura que vau definir quais informações um parametro possui, ai utilizo o type 
export interface ProductModel {
    id: string
    name: string
    price: number
    quantity: number 
    created_at: Date
    updated_at: Date
}
// modelo de dados com um entidade do typeorm, onde tem o papel de criar o mapeamento de uma entidade em si