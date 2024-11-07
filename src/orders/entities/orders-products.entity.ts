import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entities/product.entity";

@Entity({name:"orders_products"})
export class OrdersProducts {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"decimal",scale:2, precision:10})
    product_unit_price:number

    @Column()
    product_quantity:number

    @ManyToOne(()=>Order,(order)=>order.products)
    order:Order

    @ManyToOne(()=>Product,(prod)=>prod.products,{cascade:true})
    product:Product
}