import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTblUserOrder21724934326552 implements MigrationInterface {
    name = 'ChangeTblUserOrder21724934326552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shippings" RENAME COLUMN "postCode" TO "postcode"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shippings" RENAME COLUMN "postcode" TO "postCode"`);
    }

}
