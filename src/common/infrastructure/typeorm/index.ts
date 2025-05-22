import { DataSource } from "typeorm";
import { env } from "../env";

export const dataSource = new DataSource({
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    schema: env.DB_SCHEMA,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASS,
    entities: ['**/entities/**/*.ts'],
    migrations: ['**/migrations/**/*.ts'],
    // por padrao o banco de dados é criado a partir de migrações, e preciso da CLI para rodar esse banco de dados
    // e se o synchronize for true, ele vai pegar o conteúdo das entidades e 
    // vai criar as tabelas de acordo com q estever nas entidades automaticanmente,
    // e isso é perigo, principalmente em produção, por que vc altera um arquivo na entidade, 
    // ele apaga a tabela e recria com base no novo conteúdo do arquivo
    synchronize: false,
    // serve para não resgistrar comando sql na terminal do servidor, pode ser util na parte de teste, mas em produção não
    logging: false,
})