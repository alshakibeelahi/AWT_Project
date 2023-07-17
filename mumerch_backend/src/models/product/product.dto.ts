import { LoginEntity } from "../login/login.entity";
import { OrderProductsMapEntity } from "../orderProductsMap/orderProductsMap.entity";
import { CategoryEntity } from "../category/category.entity";
import { BandEntity } from "../band/band.entity";
import { ProductDetailsEntity } from "../productDetails/productDetails.entity";
import { ProductRegistrationDetailsDTO } from "../productDetails/productDetails.dto";
import { IsNotEmpty, IsPositive, IsString, Matches, Max, Min } from "class-validator";

export class ProductDTO {
  id: string;
  @IsNotEmpty({ message: "Name must have a value" })
  @IsString({ message: "Name must have a string" })
  @Matches(/^[A-Z][a-zA-Z ]+$/, { message: "Enter a proper name" })
  name:string
  @IsNotEmpty({ message: "Order price must have a value" })
  @IsPositive()
  price:number
  @IsNotEmpty({ message: "Order price must have a value" })
  @Min(1)
  @Max(100)
  revenuePercentage:number
  login:LoginEntity
  @IsNotEmpty({ message: "Category must have a value" })
  category:CategoryEntity
  @IsNotEmpty({ message: "Band must have a value" })
  band:BandEntity
  @IsNotEmpty({ message: "Product details must have some value" })
  productDetails:ProductDetailsEntity[]
}
export class ProductRegistrationDTO {
  id: string;
  @IsNotEmpty({ message: "Name must have a value" })
  @IsString({ message: "Name must have a string" })
  @Matches(/^[A-Z][a-zA-Z ]+$/, { message: "Enter a proper name" })
  name:string
  @IsNotEmpty({ message: "Order price must have a value" })
  @IsPositive()
  price:number
  @IsNotEmpty({ message: "Order price must have a value" })
  @Min(1)
  @Max(100)
  revenuePercentage:number
  login:LoginEntity
  @IsNotEmpty({ message: "Category must have a value" })
  category:CategoryEntity
  @IsNotEmpty({ message: "Band must have a value" })
  band:BandEntity
  @IsNotEmpty({ message: "Product details must have some value" })
  productDetails:ProductRegistrationDetailsDTO[]
}