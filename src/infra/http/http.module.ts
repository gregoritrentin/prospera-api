import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module";
import { EmailModule } from "../email/email.module";
import { CryptographyModule } from "@/infra/cryptography/cryptografhy.module";

//user
import { AuthenticateUserController } from "./controllers/auth/authenticate-user.controller";
import { AuthenticateBusinessController } from "./controllers/auth/authenticate-business.controller";
import { CreateUserController } from "./controllers/users/create-user.controller";
import { EditUserController } from "./controllers/users/edit-user.controller";
import { DeleteUserController } from "./controllers/users/delete-user.controller";
import { FetchUserController } from "./controllers/users/fetch-user.controller";
import { GetUserController } from "./controllers/users/get-user.controller";
import { GetBusinessController } from "./controllers/users/get-business.controller"

//business
import { CreateBusinessController } from "./controllers/business/create-business.controller";
import { EditBusinessController } from "./controllers/business/edit-business.controller";
import { DeleteBusinessController } from "./controllers/business/delete-business.controller";
import { FetchBusinessController } from "./controllers/business/fetch-business.controller";

//user-business
import { CreateUserBusinessController } from "./controllers/users/create-user-business.controller";
import { EditUserBusinessController } from "./controllers/users/edit-user-business.controller";
import { FetchUserBusinessController } from "./controllers/users/fetch-user-business.controller";

//marketplace
import { CreateMarketplaceController } from "./controllers/marketplace/create-marketplace.controller";
import { FetchMarketplaceController } from "@/infra/http/controllers/marketplace/fetch-marketplace.controler";

//person
import { CreatePersonController } from "./controllers/person/create-person.controller";
import { EditPersonController } from "./controllers/person/edit-person.controller";
import { DeletePersonController } from "./controllers/person/delete-person.controller";
import { FetchPersonController } from "./controllers/person/fetch-person.controller";

//user
import { AuthenticateUserUseCase } from "@/domain/user/use-cases/authenticate-user";
import { AuthenticateBusinessUseCase } from "@/domain/user/use-cases/authenticate-business";
import { CreateUserUseCase } from '@/domain/user/use-cases/create-user';
import { EditUserUseCase } from "@/domain/user/use-cases/edit-user";
import { DeleteUserUseCase } from "@/domain/user/use-cases/delete-user";
import { FetchUserUseCase } from "@/domain/user/use-cases/fetch-user";
import { GetUserUseCase } from "@/domain/user/use-cases/get-user";
import { GetBusinessUseCase } from '@/domain/user/use-cases/get-business';

//business
import { CreateBusinessUseCase } from "@/domain/business/use-cases/create-business";
import { EditBusinessUseCase } from "@/domain/business/use-cases/edit-business";
import { DeleteBusinessUseCase } from '@/domain/business/use-cases/delele-business';
import { FetchBusinessUseCase } from "@/domain/business/use-cases/fetch-business";
import { CreateMarketplaceUseCase } from "@/domain/business/use-cases/create-marketplace";
import { FetchMarketplaceUseCase } from "@/domain/business/use-cases/fetch-marketplace";

//user-business
import { CreateUserBusinessUseCase } from "@/domain/user/use-cases/create-user-business";
import { EditUserBusinessUseCase } from "@/domain/user/use-cases/edit-user-business";
import { FetchUserBusinessUseCase } from "@/domain/user/use-cases/fetch-user-business";

//person
import { CreatePersonUseCase } from "@/domain/person/use-cases/create-person";
import { EditPersonUseCase } from "@/domain/person/use-cases/edit-person";
import { DeletePersonUseCase } from "@/domain/person/use-cases/delete-person";
import { FetchPersonUseCase } from "@/domain/person/use-cases/fetch-person";

//app
import { CreateAppUseCase } from "@/domain/app/use-cases/create-app";
import { FetchAppUseCase } from "@/domain/app/use-cases/fetch-app";
import { EditAppUseCase } from "@/domain/app/use-cases/edit-app";
import { DeleteAppUseCase } from "@/domain/app/use-cases/delete-app";

import { CreateAppController } from "./controllers/app/create-app.controller";
import { EditAppController } from "./controllers/app/edit-app-controller";
import { FetchAppController } from "./controllers/app/fetch-app-controller";
import { DeleteAppController } from "./controllers/app/delete-app-controller";

//item
import { FetchItemController } from "./controllers/items/fetch-item.controller";
import { CreateItemController } from "./controllers/items/create-item.controller";
import { EditItemController } from "./controllers/items/edit-item.controller";
import { DeleteItemController } from "./controllers/items/delete-item.controller";

import { FetchItemUseCase } from "@/domain/item/use-cases/fetch-item";
import { EditItemUseCase } from "@/domain/item/use-cases/edit-item";
import { DeleteItemUseCase } from "@/domain/item/use-cases/delete-item";
import { CreateItemUseCase } from "@/domain/item/use-cases/create-item";

//item-group
import { FetchItemGroupController } from "@/infra/http/controllers/items/fetch-item-group.controller";
import { CreateItemGroupController } from "@/infra/http/controllers/items/create-item-group.controller";
import { EditItemGroupController } from "@/infra/http/controllers/items/edit-group.controller";
import { DeleteItemGroupController } from "@/infra/http/controllers/items/delete-item-group.controller";

import { CreateItemGroupUseCase } from "@/domain/item/use-cases/create-item-group";
import { EditItemGroupUseCase } from "@/domain/item/use-cases/edit-item-group";
import { DeleteItemGroupUseCase } from "@/domain/item/use-cases/delete-item-group";
import { FetchItemGroupUseCase } from "@/domain/item/use-cases/fetch-item-group";

//item-taxation
import { FetchItemTaxationController } from "@/infra/http/controllers/items/fetch-item-taxation.controller";
import { CreateItemTaxationController } from "@/infra/http/controllers/items/create-item-taxation.controller";
import { EditItemTaxationController } from "@/infra/http/controllers/items/edit-taxation.controller";
import { DeleteItemTaxationController } from "@/infra/http/controllers/items/delete-item-taxation.controller";

import { CreateItemTaxationUseCase } from "@/domain/item/use-cases/create-item-taxation";
import { EditItemTaxationUseCase } from "@/domain/item/use-cases/edit-item-taxation";
import { DeleteItemTaxationUseCase } from "@/domain/item/use-cases/delete-item-taxation";
import { FetchItemTaxationUseCase } from "@/domain/item/use-cases/fech-item-taxation";
import { UploadPhotoController } from "./controllers/users/upload-user-photo.controller";
import { StorageModule } from "../storage/storage.module";

import { UploadAndCreateFileUseCase } from "@/domain/file/use-cases/upload-and-create-file";
import { SendAndCreateEmailUseCase } from "@/domain/email/use-cases/send-and-create-email";
import { SetUserPhotoUseCase } from "@/domain/user/use-cases/set-user-photo";

@Module({
  imports: [DatabaseModule, EmailModule, CryptographyModule, StorageModule],
  controllers: [

    //user
    AuthenticateUserController,
    AuthenticateBusinessController,
    CreateUserController,
    EditUserController,
    DeleteUserController,
    FetchUserController,
    GetUserController,
    GetBusinessController,

    //user-business
    CreateUserBusinessController,
    EditUserBusinessController,
    FetchUserBusinessController,

    //business
    CreateBusinessController,
    EditBusinessController,
    DeleteBusinessController,
    FetchBusinessController,

    //marketplace
    CreateMarketplaceController,
    FetchMarketplaceController,

    //person
    CreatePersonController,
    EditPersonController,
    DeletePersonController,
    FetchPersonController,

    //app
    CreateAppController,
    DeleteAppController,
    FetchAppController,
    EditAppController,

    //item
    CreateItemController,
    EditItemController,
    DeleteItemController,
    FetchItemController,

    //item-group
    CreateItemGroupController,
    EditItemGroupController,
    DeleteItemGroupController,
    FetchItemGroupController,

    //item-taxation
    CreateItemTaxationController,
    EditItemTaxationController,
    DeleteItemTaxationController,
    FetchItemTaxationController,

    //storage
    UploadPhotoController,

  ],
  providers: [

    //user
    AuthenticateUserUseCase,
    AuthenticateBusinessUseCase,

    CreateUserUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
    FetchUserUseCase,
    SetUserPhotoUseCase,
    GetUserUseCase,
    GetBusinessUseCase,

    //business
    CreateBusinessUseCase,
    EditBusinessUseCase,
    DeleteBusinessUseCase,
    FetchBusinessUseCase,

    //user-business
    CreateUserBusinessUseCase,
    EditUserBusinessUseCase,
    FetchUserBusinessUseCase,

    //marketplace
    CreateMarketplaceUseCase,
    FetchMarketplaceUseCase,

    //person
    CreatePersonUseCase,
    EditPersonUseCase,
    DeletePersonUseCase,
    FetchPersonUseCase,

    //app
    CreateAppUseCase,
    DeleteAppUseCase,
    FetchAppUseCase,
    EditAppUseCase,

    //item
    CreateItemUseCase,
    EditItemUseCase,
    DeleteItemUseCase,
    FetchItemUseCase,

    //item-group
    CreateItemGroupUseCase,
    EditItemGroupUseCase,
    DeleteItemGroupUseCase,
    FetchItemGroupUseCase,

    //item-taxation
    CreateItemTaxationUseCase,
    EditItemTaxationUseCase,
    DeleteItemTaxationUseCase,
    FetchItemTaxationUseCase,

    //storage
    UploadAndCreateFileUseCase,
    SendAndCreateEmailUseCase,

  ],
})
export class HttpModule { }