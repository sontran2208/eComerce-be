import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductAndUploadImg1674912371234
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Xóa ràng buộc khóa ngoại (nếu có)
    await queryRunner.query(`
      ALTER TABLE "uploads-img" DROP CONSTRAINT IF EXISTS "FK_product_uploads";
    `);

    // 2. Xóa cột productId
    await queryRunner.query(`
      ALTER TABLE "uploads-img" DROP COLUMN IF EXISTS "productId";
    `);

    // 3. Thêm lại cột productId
    await queryRunner.query(`
      ALTER TABLE "uploads-img"
      ADD COLUMN "productId" INTEGER;
    `);

    // 4. Thêm lại khóa ngoại cho productId
    await queryRunner.query(`
      ALTER TABLE "uploads-img"
      ADD CONSTRAINT "FK_product_uploads"
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Hoàn tác các thay đổi

    // 1. Xóa khóa ngoại productId
    await queryRunner.query(`
      ALTER TABLE "uploads-img" DROP CONSTRAINT IF EXISTS "FK_product_uploads";
    `);

    // 2. Xóa cột productId
    await queryRunner.query(`
      ALTER TABLE "uploads-img" DROP COLUMN IF EXISTS "productId";
    `);
  }
}
