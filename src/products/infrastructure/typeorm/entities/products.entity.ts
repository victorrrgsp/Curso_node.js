import { ProductModel } from "@/products/domain/models/products.model";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// modelo de dados com um entidade do typeorm, onde tem o papel de criar o mapeamento de uma entidade em si
@Entity('products')
export class Product implements ProductModel{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column('decimal')
    price: number;

    @Column('int')
    quantity: number;

    @CreateDateColumn({name:'created_at'})
    created_at: Date;

    @UpdateDateColumn({name:'updated_at'})
    updated_at: Date;
    
}