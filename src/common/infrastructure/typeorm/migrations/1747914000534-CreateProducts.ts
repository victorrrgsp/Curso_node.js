import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProducts1747914000534 implements MigrationInterface {

    // o migration:run irá rodar esse metodo aqui(up)
    public async up(queryRunner: QueryRunner): Promise<void> {
        // pra ter is unico em cada tabela, é necessario criar uma esteção do uuid-ossp(id unico)
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        // essa parte para criar a tabela de products
        await queryRunner.createTable(
            new Table({
                name: 'products',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        // o isNullable(true) serve para preenchimento opcional
                        // isNullable: false
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'quantity',
                        type: 'int'
                    },
                    {
                        name: 'create_at',
                        type: 'timestamp',
                        // CURRENT_TIMESTAMP evita problemas com fuzo horario
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }
                ]
            })
        )
    }

    // e pra reverter o q foi feito, migration:revert irá rodar esse metodo(down)
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('products')
    }

}
