import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "@/infra/cryptography/cryptografhy.module";

//user
import { AuthenticateUserController } from "./controllers/auth/authenticate-user.controller";
import { AuthenticateBusinessController } from "./controllers/auth/authenticate-business.controller";
import { CreateUserController } from "./controllers/users/create-user.controller";
import { EditUserController } from "./controllers/users/edit-user.controller";
import { DeleteUserController } from "./controllers/users/delete-user.controller";
import { FetchUserController } from "./controllers/users/fetch-user.controller";
import { GetUserController } from "./controllers/users/get-user.controller";
import { GetBusinessController } from "./controllers/users/get-business.controller";

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
import { EmailController } from "./controllers/email/send-mail.controller";
import { SendGridService } from "../email/sendgrid.service";
import { SendEmailUseCase } from "@/domain/email/use-cases/send-email";

//email


@Module({
  imports: [DatabaseModule, CryptographyModule],
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

    //email
    EmailController,

  ],
  providers: [
    //user
    AuthenticateUserUseCase,
    AuthenticateBusinessUseCase,

    CreateUserUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
    FetchUserUseCase,
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

    //email
    SendEmailUseCase,

  ],
})
export class HttpModule { }