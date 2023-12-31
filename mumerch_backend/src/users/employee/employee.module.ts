import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { OrderService } from 'src/models/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginEntity } from 'src/models/login/login.entity';
import { TokenEntity } from 'src/models/token/token.entity';
import { ProductDetailsEntity } from 'src/models/productDetails/productDetails.entity';
import { GigManagerEntity } from 'src/models/gigManager/gigManager.entity';
import { GigEntity } from 'src/models/gig/gig.entity';
import { OrderEntity } from 'src/models/order/order.entity';
import { CategoryEntity } from 'src/models/category/category.entity';
import { UserProfileEntity } from 'src/models/userProfile/userProfile.entity';
import { ColorEntity } from 'src/models/color/color.entity';
import { SizeEntity } from 'src/models/size/size.entity';
import { ProductEntity } from 'src/models/product/product.entity';
import { DesignationEntity } from 'src/models/designation/designation.entity';
import { CustomerEntity } from 'src/models/customer/customer.entity';
import { OrderProductsMapEntity } from 'src/models/orderProductsMap/orderProductsMap.entity';
import { BandEntity } from 'src/models/band/band.entity';
import { BandManagerEntity } from 'src/models/bandManager/bandManager.entity';
import { CommonService } from 'src/common/common.service';
import { CustomerService } from 'src/models/customer/customer.service';
import { ProductDetailsService } from 'src/models/productDetails/productDetails.service';
import { OrderProductsMapService } from 'src/models/orderProductsMap/orderProductsMap.service';
import { GigService } from 'src/models/gig/gig.service';
import { BandManagerService } from 'src/models/bandManager/bandManager.service';
import { AuthService } from 'src/auth/auth.service';
import { ColorService } from 'src/models/color/color.service';
import { CategoryService } from 'src/models/category/category.service';
import { UserProfileService } from 'src/models/userProfile/userProfile.service';
import { SizeService } from 'src/models/size/size.service';
import { LoginService } from 'src/models/login/login.service';
import { ProductService } from 'src/models/product/product.service';
import { DesignationService } from 'src/models/designation/designation.service';
import { BandService } from 'src/models/band/band.service';

@Module({
  imports: [TypeOrmModule.forFeature([ LoginEntity, UserProfileEntity, SizeEntity, ColorEntity, ProductEntity, DesignationEntity,CustomerEntity, OrderProductsMapEntity, BandEntity, BandManagerEntity, CategoryEntity, OrderEntity, GigEntity, GigManagerEntity, ProductDetailsEntity, TokenEntity ])],
  controllers: [EmployeeController],
  providers: [ UserProfileService, SizeService, LoginService, ProductService, DesignationService, BandService, CategoryService, ColorService, CustomerService, AuthService, OrderService, BandManagerService, GigService, OrderProductsMapService, ProductDetailsService, CustomerService, CommonService ],
})
export class EmployeeModule {}