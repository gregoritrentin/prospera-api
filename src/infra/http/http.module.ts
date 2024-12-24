import { forwardRef, Get, Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module";
import { EmailModule } from "../email/email.module";
import { FileModule } from "../file/file.module";
import { CryptographyModule } from "@/infra/cryptography/cryptografhy.module";
import { BoletoModule } from "../boleto/boleto.module";
import { PixModule } from "../pix/pix.module";
import { WhatsAppModule } from "../whatsapp/whatsapp.module";

//app
import { CreateAppUseCase } from "@/domain/application/use-cases/create-app";
import { FetchAppUseCase } from "@/domain/application/use-cases/fetch-app";
import { EditAppUseCase } from "@/domain/application/use-cases/edit-app";
import { DeleteAppUseCase } from "@/domain/application/use-cases/delete-app";

import { CreateAppController } from "@/infra/http/controllers/core/app/create-app.controller";
import { EditAppController } from "@/infra/http/controllers/core/app/edit-app-controller";
import { FetchAppController } from "@/infra/http/controllers/core/app/fetch-app-controller";
import { DeleteAppController } from "@/infra/http/controllers/core/app/delete-app-controller";

//marketplace
import { CreateMarketplaceController } from "./controllers/core/marketplace/create-marketplace.controller";
import { EditMarketplaceController } from "./controllers/core/marketplace/edit-marketplace.controller";
import { FetchMarketplaceController } from "@/infra/http/controllers/core/marketplace/fetch-marketplace.controler";

import { CreateMarketplaceUseCase } from "@/domain/application/use-cases/create-marketplace";
import { EditMarketplaceUseCase } from "@/domain/application/use-cases/edit-marketplace";
import { FetchMarketplaceUseCase } from "@/domain/application/use-cases/fetch-marketplace";

//user 
import { AuthenticateUserController } from "./controllers/core/auth/authenticate-user.controller";
import { AuthenticateBusinessController } from "./controllers/core/auth/authenticate-business.controller";
import { CreateUserController } from "@/infra/http/controllers/core/user/create-user.controller";
import { EditUserController } from "@/infra/http/controllers/core/user/edit-user.controller";
import { DeleteUserController } from "@/infra/http/controllers/core/user/delete-user.controller";
import { FetchUserController } from "@/infra/http/controllers/core/user/fetch-user.controller";
import { GetUserController } from "@/infra/http/controllers/core/user/get-user.controller";
import { SetUserPhotoController } from "@/infra/http/controllers/core/user/set-user-photo.controller";

import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import { AuthenticateBusinessUseCase } from "@/domain/application/use-cases/authenticate-business";
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user';
import { EditUserUseCase } from "@/domain/application/use-cases/edit-user";
import { DeleteUserUseCase } from "@/domain/application/use-cases/delete-user";
import { FetchUserUseCase } from "@/domain/application/use-cases/fetch-user";
import { GetUserUseCase } from "@/domain/application/use-cases/get-user";
import { SetUserPhotoUseCase } from "@/domain/application/use-cases/set-user-photo";
import { SetDefaultBusinessController } from "./controllers/core/user/set-default-business.controller";

//term
import { FetchTermController } from "./controllers/core/term/fetch-term.controller";
import { CreateTermController } from "./controllers/core/term/create-term.controller";
import { DeleteTermController } from "./controllers/core/term/delete-term.controller";
import { EditTermController } from "./controllers/core/term/edit-term.controller";

import { CreateTermUseCase } from "@/domain/application/use-cases/create-term";
import { DeleteTermUseCase } from "@/domain/application/use-cases/delete-term";
import { EditTermUseCase } from "@/domain/application/use-cases/edit-term";
import { FetchTermUseCase } from "@/domain/application/use-cases/fetch-term";

//user-term
import { CreateUserTermController } from "@/infra/http/controllers/core/term/create-user-term.controller";
import { DeleteUserTermController } from "./controllers/core/term/delete-user-term.controller";
import { FetchUserTermController } from "./controllers/core/term/fetch-user-term.controller";

import { CreateUserTermUseCase } from "@/domain/application/use-cases/create-user-term";
import { DeleteUserTermUseCase } from "@/domain/application/use-cases/delete-user-term";
import { FetchUserTermUseCase } from "@/domain/application/use-cases/fetch-user-terms";

//business
import { CreateBusinessController } from "@/infra/http/controllers/core/business/create-business.controller";
import { EditBusinessController } from "@/infra/http/controllers/core/business/edit-business.controller";
import { DeleteBusinessController } from "@/infra/http/controllers/core/business/delete-business.controller";
import { FetchBusinessController } from "@/infra/http/controllers/core/business/fetch-business.controller";
import { GetBusinessController } from "@/infra/http/controllers/core/user/get-business.controller"

import { CreateBusinessUseCase } from "@/domain/application/use-cases/create-business";
import { EditBusinessUseCase } from "@/domain/application/use-cases/edit-business";
import { DeleteBusinessUseCase } from '@/domain/application/use-cases/delele-business';
import { FetchBusinessUseCase } from "@/domain/application/use-cases/fetch-business";
import { GetBusinessUseCase } from '@/domain/application/use-cases/get-business';

//business-owner
import { CreateBusinessOwnerController } from "@/infra/http/controllers/core/business/create-business-owner.controller";
import { EditBusinessOwnerController } from "@/infra/http/controllers/core/business/edit-business-owner.controller";
import { FetchBusinessOwnerController } from "@/infra/http/controllers/core/business/fetch-business-owner.controller";

import { CreateBusinessOwnerUseCase } from "@/domain/application/use-cases/create-business-owner";
import { EditBusinessOwnerUseCase } from "@/domain/application/use-cases/edit-business-owner";
import { FetchBusinessOwnerUseCase } from "@/domain/application/use-cases/fetch-user-owner";

//business-app
import { CreateBusinessAppController } from "@/infra/http/controllers/core/business/create-business-app.controller";
import { EditBusinessAppController } from "@/infra/http/controllers/core/business/edit-business-app.controller";
import { FetchBusinessAppController } from "@/infra/http/controllers/core/business/fetch-business-app.controller";

import { CreateBusinessAppUseCase } from "@/domain/application/use-cases/create-business-app";
import { EditBusinessAppUseCase } from "@/domain/application/use-cases/edit-business-app";
import { FetchBusinessAppUseCase } from "@/domain/application/use-cases/fetch-business-apps";

//user-business
import { CreateUserBusinessController } from "@/infra/http/controllers/core/user/create-user-business.controller";
import { EditUserBusinessController } from "@/infra/http/controllers/core/user/edit-user-business.controller";
import { FetchUserBusinessController } from "@/infra/http/controllers/core/user/fetch-user-business.controller";

import { CreateUserBusinessUseCase } from "@/domain/application/use-cases/create-user-business";
import { EditUserBusinessUseCase } from "@/domain/application/use-cases/edit-user-business";
import { FetchUserBusinessUseCase } from "@/domain/application/use-cases/fetch-user-business";

//person
import { CreatePersonController } from "./controllers/person/create-person.controller";
import { EditPersonController } from "./controllers/person/edit-person.controller";
import { DeletePersonController } from "./controllers/person/delete-person.controller";
import { FetchPersonController } from "./controllers/person/fetch-person.controller";

import { CreatePersonUseCase } from "@/domain/person/use-cases/create-person";
import { EditPersonUseCase } from "@/domain/person/use-cases/edit-person";
import { DeletePersonUseCase } from "@/domain/person/use-cases/delete-person";
import { FetchPersonUseCase } from "@/domain/person/use-cases/fetch-person";

//item
import { FetchItemController } from "./controllers/item/fetch-item.controller";
import { CreateItemController } from "./controllers/item/create-item.controller";
import { EditItemController } from "./controllers/item/edit-item.controller";
import { DeleteItemController } from "./controllers/item/delete-item.controller";

import { FetchItemUseCase } from "@/domain/item/use-cases/fetch-item";
import { EditItemUseCase } from "@/domain/item/use-cases/edit-item";
import { DeleteItemUseCase } from "@/domain/item/use-cases/delete-item";
import { CreateItemUseCase } from "@/domain/item/use-cases/create-item";

//item-group
import { FetchItemGroupController } from "@/infra/http/controllers/item/fetch-item-group.controller";
import { CreateItemGroupController } from "@/infra/http/controllers/item/create-item-group.controller";
import { EditItemGroupController } from "@/infra/http/controllers/item/edit-group.controller";
import { DeleteItemGroupController } from "@/infra/http/controllers/item/delete-item-group.controller";

import { CreateItemGroupUseCase } from "@/domain/item/use-cases/create-item-group";
import { EditItemGroupUseCase } from "@/domain/item/use-cases/edit-item-group";
import { DeleteItemGroupUseCase } from "@/domain/item/use-cases/delete-item-group";
import { FetchItemGroupUseCase } from "@/domain/item/use-cases/fetch-item-group";

//item-taxation
import { FetchItemTaxationController } from "@/infra/http/controllers/item/fetch-item-taxation.controller";
import { EditItemTaxationController } from "@/infra/http/controllers/item/edit-taxation.controller";
import { DeleteItemTaxationController } from "@/infra/http/controllers/item/delete-item-taxation.controller";

import { CreateItemTaxationUseCase } from "@/domain/item/use-cases/create-item-taxation";
import { EditItemTaxationUseCase } from "@/domain/item/use-cases/edit-item-taxation";
import { DeleteItemTaxationUseCase } from "@/domain/item/use-cases/delete-item-taxation";
import { FetchItemTaxationUseCase } from "@/domain/item/use-cases/fech-item-taxation";

//transaction-boleto
import { CreateBoletoController } from "@/infra/http/controllers/transaction/create-boleto.controller";
import { CreateBoletoUseCase } from "@/domain/transaction/use-cases/create-boleto";
import { PrintBoletoController } from "@/infra/http/controllers/transaction/print-boleto.controller";
import { PrintBoletoUseCase } from "@/domain/transaction/use-cases/print-boleto";



import { UploadAndCreateFileUseCase } from "@/domain/file/use-cases/upload-and-create-file";
import { SendAndCreateEmailUseCase } from "@/domain/email/use-cases/send-and-create-email";
import { SetDefaultBusinessUseCase } from "@/domain/application/use-cases/set-default-business";
import { SignUpController } from "./controllers/core/sign-up.controller";
import { GetPersonController } from "./controllers/person/get-person.controller";
import { GetPersonUseCase } from "@/domain/person/use-cases/get-person";
import { CancelBoletoController } from "./controllers/transaction/cancel-boleto.controller";
import { CancelBoletoUseCase } from "@/domain/transaction/use-cases/cancel-boleto";
import { FetchBoletoController } from "./controllers/transaction/fetch-boleto.controller";
import { FetchBoletoUseCase } from "@/domain/transaction/use-cases/fetch-boletos";
import { GetBoletoController } from "./controllers/transaction/get-boleto.controller";
import { GetBoletoUseCase } from "@/domain/transaction/use-cases/get-boleto";
import { QueueModule } from "../queues/queue.module";
import { CreatePixController } from "./controllers/transaction/create-pix.controller";
import { CreatePixUseCase } from "@/domain/transaction/use-cases/create-pix";
import { FetchPixUseCase } from "@/domain/transaction/use-cases/fetch-pixes";
import { FetchPixController } from "./controllers/transaction/fetch-pix.controller";
import { GetPixController } from "./controllers/transaction/get-pix.controller";
import { GetPixUseCase } from "@/domain/transaction/use-cases/get-pix";
import { PaymentsModule } from "../payments/payments.module";
import { CreatePaymentPixKeyUseCase } from "@/domain/payment/use-cases/create-payment-pix-key";
import { ConnectWhatsAppUseCase } from "@/domain/whatsapp/use-cases/connect-whatsapp";
import { WhatsAppController } from "./controllers/whatsapp/whatsapp.controller";
import { SendWhatsAppUseCase } from "@/domain/whatsapp/use-cases/send-whatsapp";
//import { UpdatePaymentPixController } from "./controllers/payment/update-payments-pix.controller";
//import { UpdatePaymentPixUseCase } from "@/domain/payment/use-cases/update-payment-pix";
import { GetPaymentPixProofUseCase } from "@/domain/payment/use-cases/get-payment-pix-proof";
import { GetPaymentPixProofController } from "./controllers/payment/get-payment-pix-proof.controller";
//import { CancelScheduledPixPaymentController } from "./controllers/payment/cancel-payment-pix-scheduled.controller";
//import { CancelPaymentPixScheduledUseCase } from "@/domain/payment/use-cases/cancel-payment-pix-scheduled";
import { CreateSubscriptionController } from "./controllers/subscription/create-subscription.controller";
import { CreateSubscriptionUseCase } from "@/domain/subscription/use-cases/create-subscription";
import { CreateNfseUseCase } from "@/domain/dfe/nfse/use-cases/create-nfse";
import { GetNfseUseCase } from "@/domain/dfe/nfse/use-cases/get-nfse";
import { CreateItemTaxationController } from "./controllers/item/create-item-taxation.controller";
import { EnvModule } from "../env/env.module";
import { CreatePaymentPixKeyController } from "./controllers/payment/create-payment-pix-key.controller";
import { CreatePaymentPixBankDataController } from "./controllers/payment/create-payment-pix-bank-data.controller";
import { SharedModule } from "../shared/shared.module";
import { CreatePaymentPixBankDataUseCase } from "@/domain/payment/use-cases/create-payment-pix-bank-data";


@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    BoletoModule,
    PixModule,
    PaymentsModule,
    EmailModule,
    WhatsAppModule,
    CryptographyModule,
    FileModule,
    SharedModule,
    forwardRef(() => QueueModule)

  ],

  controllers: [

    //sign-up
    SignUpController,

    //user
    AuthenticateUserController,
    AuthenticateBusinessController,
    CreateUserController,
    EditUserController,
    DeleteUserController,
    FetchUserController,
    GetUserController,
    GetBusinessController,

    SetDefaultBusinessController,
    SetUserPhotoController,

    //business
    CreateBusinessController,
    EditBusinessController,
    DeleteBusinessController,
    FetchBusinessController,

    //business-owner
    CreateBusinessOwnerController,
    EditBusinessOwnerController,
    FetchBusinessOwnerController,

    //business-app
    CreateBusinessAppController,
    EditBusinessAppController,
    FetchBusinessAppController,

    //user-business
    CreateUserBusinessController,
    EditUserBusinessController,
    FetchUserBusinessController,

    //business-app
    CreateBusinessAppController,
    EditBusinessAppController,
    FetchBusinessAppController,

    //marketplace
    CreateMarketplaceController,
    EditMarketplaceController,
    FetchMarketplaceController,

    //app
    CreateAppController,
    DeleteAppController,
    FetchAppController,
    EditAppController,

    //term
    CreateTermController,
    EditTermController,
    DeleteTermController,
    FetchTermController,

    //user-term
    CreateUserTermController,
    DeleteUserTermController,
    FetchUserTermController,

    //person
    CreatePersonController,
    EditPersonController,
    DeletePersonController,
    FetchPersonController,
    GetPersonController,

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
    EditItemTaxationController,
    DeleteItemTaxationController,
    FetchItemTaxationController,

    //transaction boleto
    CreateBoletoController,
    PrintBoletoController,
    CancelBoletoController,
    FetchBoletoController,
    GetBoletoController,

    //transaction pix
    CreatePixController,
    GetPixController,
    FetchPixController,

    //payments
    CreatePaymentPixKeyController,
    CreatePaymentPixBankDataController,
    //UpdatePaymentPixController,
    GetPaymentPixProofController,
    //CancelScheduledPixPaymentController,

    //subscription
    CreateSubscriptionController,


    //nfse
    CreateUserController,
    FetchUserController,
    GetUserController,

    //whatsapp
    WhatsAppController

  ],
  providers: [


    CreatePaymentPixKeyUseCase,
    CreatePaymentPixBankDataUseCase,  // Adicione aqui
    GetPaymentPixProofUseCase,

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
    SetDefaultBusinessUseCase,

    UploadAndCreateFileUseCase,
    SendAndCreateEmailUseCase,

    //business
    CreateBusinessUseCase,
    EditBusinessUseCase,
    DeleteBusinessUseCase,
    FetchBusinessUseCase,

    //business-owner
    CreateBusinessOwnerUseCase,
    EditBusinessOwnerUseCase,
    FetchBusinessOwnerUseCase,

    //business-app
    CreateBusinessAppUseCase,
    EditBusinessAppUseCase,
    FetchBusinessAppUseCase,

    //user-business
    CreateUserBusinessUseCase,
    EditUserBusinessUseCase,
    FetchUserBusinessUseCase,

    //marketplace
    CreateMarketplaceUseCase,
    EditMarketplaceUseCase,
    FetchMarketplaceUseCase,

    //app
    CreateAppUseCase,
    DeleteAppUseCase,
    FetchAppUseCase,
    EditAppUseCase,

    //term
    CreateTermUseCase,
    EditTermUseCase,
    DeleteTermUseCase,
    FetchTermUseCase,

    //term-user
    CreateUserTermUseCase,
    DeleteUserTermUseCase,
    FetchUserTermUseCase,

    //person
    CreatePersonUseCase,
    EditPersonUseCase,
    DeletePersonUseCase,
    FetchPersonUseCase,
    GetPersonUseCase,

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

    //transaction boleto
    CreateBoletoUseCase,
    PrintBoletoUseCase,
    CancelBoletoUseCase,
    FetchBoletoUseCase,
    GetBoletoUseCase,

    //transaction pix
    CreatePixUseCase,
    FetchPixUseCase,
    GetPixUseCase,

    //payments
    CreatePaymentPixKeyUseCase,
    //CreatePaymentPixBankDataUseCase,
    //UpdatePaymentPixUseCase,
    GetPaymentPixProofUseCase,
    //CancelPaymentPixScheduledUseCase,

    //subscription
    CreateSubscriptionUseCase,

    //nfse
    CreateNfseUseCase,
    FetchUserUseCase,
    GetNfseUseCase,

    //whatsapp
    SendWhatsAppUseCase,
    ConnectWhatsAppUseCase
  ],

})
export class HttpModule { }