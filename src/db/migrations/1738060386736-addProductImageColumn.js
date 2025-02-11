"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductAndUploadImg1674912371234 = void 0;
class UpdateProductAndUploadImg1674912371234 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
      ALTER TABLE "uploads-img" DROP CONSTRAINT IF EXISTS "FK_product_uploads";
    `);
            yield queryRunner.query(`
      ALTER TABLE "uploads-img" DROP COLUMN IF EXISTS "productId";
    `);
            yield queryRunner.query(`
      ALTER TABLE "uploads-img"
      ADD COLUMN "productId" INTEGER;
    `);
            yield queryRunner.query(`
      ALTER TABLE "uploads-img"
      ADD CONSTRAINT "FK_product_uploads"
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
      ALTER TABLE "uploads-img" DROP CONSTRAINT IF EXISTS "FK_product_uploads";
    `);
            yield queryRunner.query(`
      ALTER TABLE "uploads-img" DROP COLUMN IF EXISTS "productId";
    `);
        });
    }
}
exports.UpdateProductAndUploadImg1674912371234 = UpdateProductAndUploadImg1674912371234;
//# sourceMappingURL=1738060386736-addProductImageColumn.js.map