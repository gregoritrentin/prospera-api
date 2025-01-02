import { forwardRef, Get, Module } from "@nestjs/common"
import { DatabaseModule } from "@/core/infra/database/database.module"
import { EmailModule } from "@/modules/email/email.module"
import { FileModule } from "@/modules/file/file.module"
import { CryptographyModule } from "@/core/infra/cryptography/cryptografhy.module"
import { BoletoModule } from "@/modules/boleto/boleto.module"
import { PixModule } from "@/modules/pix/pix.module"
import { WhatsAppModule } from "@/modules/whatsapp/whatsapp.module"
import { PaymentsModule } from "@/modules/payments/payments.module"
import { QueueModule } from "@/modules/queue/queue.module"
import { EnvModule } from "../config/env.module"
import { SharedModule } from "@/modules/shared/shared.module"

// Controllers
import { CreateAppController } from "@/modules/application/infra/http/controllers/core/app/create-app.controller"
import { EditAppController } from "@/modules/application/infra/http/controllers/core/app/edit-app-controller"
import { FetchAppController } from "@/modules/application/infra/http/controllers/core/app/fetch-app-controller"
import { DeleteAppController } from "@/modules/application/infra/http/controllers/core/app/delete-app-controller"
import { CreateMarketplaceController } from "@/modules/application/infra//controllers/marketplace/create-marketplace.controller"
import { EditMarketplaceController } from "@/modules/application/infra//controllers/marketplace/edit-marketplace.controller"
import { FetchMarketplaceController } from "@/modules/application/infra/http/controllers/core/marketplace/fetch-marketplace.controler"
import { AuthenticateUserController } from "@/modules/application/infra//controllers/auth/authenticate-user.controller"
import { AuthenticateBusinessController } from "@/modules/application/infra//controllers/auth/authenticate-business.controller"
import { CreateUserController } from "@/modules/application/infra/http/controllers/create-user.controller"
import { EditUserController } from "@/modules/application/infra/http/controllers/edit-user.controller"
import { DeleteUserController } from "@/modules/application/infra/http/controllers/core/user/delete-user.controller"
import { FetchUserController } from "@/modules/application/infra/http/controllers/fetch-user.controller"
import { GetUserController } from "@/modules/application/infra/http/controllers/get-user.controller"
import { SetUserPhotoController } from "@/modules/application/infra/http/controllers/core/user/set-user-photo.controller"
import { SetDefaultBusinessController } from "@/modules/application/infra//controllers/user/set-default-business.controller"
import { FetchTermController } from "@/modules/application/infra//controllers/term/fetch-term.controller"
import { CreateTermController } from "@/modules/application/infra//controllers/term/create-term.controller"
import { DeleteTermController } from "@/modules/application/infra//controllers/term/delete-term.controller"
import { EditTermController } from "@/modules/application/infra//controllers/term/edit-term.controller"
import { CreateUserTermController } from "@/modules/application/infra/http/controllers/core/term/create-user-term.controller"
import { DeleteUserTermController } from "@/modules/application/infra//controllers/term/delete-user-term.controller"
import { FetchUserTermController } from "@/modules/application/infra//controllers/term/fetch-user-term.controller"
import { CreateBusinessController } from "@/modules/application/infra/http/controllers/core/business/create-business.controller"
import { EditBusinessController } from "@/modules/application/infra/http/controllers/core/business/edit-business.controller"
import { DeleteBusinessController } from "@/modules/application/infra/http/controllers/core/business/delete-business.controller"
import { FetchBusinessController } from "@/modules/application/infra/http/controllers/core/business/fetch-business.controller"
import { GetBusinessController } from "@/modules/application/infra/http/controllers/core/user/get-business.controller"
import { CreateBusinessOwnerController } from "@/modules/application/infra/http/controllers/core/business/create-business-owner.controller"
import { EditBusinessOwnerController } from "@/modules/application/infra/http/controllers/core/business/edit-business-owner.controller"
import { FetchBusinessOwnerController } from "@/modules/application/infra/http/controllers/core/business/fetch-business-owner.controller"
import { CreateBusinessAppController } from "@/modules/application/infra/http/controllers/core/business/create-business-app.controller"
import { EditBusinessAppController } from "@/modules/application/infra/http/controllers/core/business/edit-business-app.controller"
import { FetchBusinessAppController } from "@/modules/application/infra/http/controllers/core/business/fetch-business-app.controller"
import { CreateUserBusinessController } from "@/modules/application/infra/http/controllers/core/user/create-user-business.controller"
import { EditUserBusinessController } from "@/modules/application/infra/http/controllers/core/user/edit-user-business.controller"
import { FetchUserBusinessController } from "@/modules/application/infra/http/controllers/core/user/fetch-user-business.controller"
import { CreatePersonController } from "@/modules/person/infra/http/controllers/create-person.controller"
import { EditPersonController } from "@/modules/person/infra/http/controllers/edit-person.controller"
import { DeletePersonController } from "@/modules/person/infra/http/controllers/delete-person.controller"
import { FetchPersonController } from "@/modules/person/infra/http/controllers/fetch-person.controller"
import { GetPersonController } from "@/modules/person/infra/http/controllers/get-person.controller"
import { FetchItemController } from "@/modules/item/infra/http/controllers/fetch-item.controller"
import { CreateItemController } from "@/modules/item/infra/http/controllers/create-item.controller"
import { EditItemController } from "@/modules/item/infra/http/controllers/edit-item.controller"
import { DeleteItemController } from "@/modules/item/infra/http/controllers/delete-item.controller"
import { FetchItemGroupController } from "@/modules/item/infra/http/controllers/item/fetch-item-group.controller"
import { CreateItemGroupController } from "@/modules/item/infra/http/controllers/item/create-item-group.controller"
import { EditItemGroupController } from "@/modules/item/infra/http/controllers/item/edit-group.controller"
import { DeleteItemGroupController } from "@/modules/item/infra/http/controllers/item/delete-item-group.controller"
import { FetchItemTaxationController } from "@/modules/item/infra/http/controllers/item/fetch-item-taxation.controller"
import { EditItemTaxationController } from "@/modules/item/infra/http/controllers/item/edit-taxation.controller"
import { DeleteItemTaxationController } from "@/modules/item/infra/http/controllers/item/delete-item-taxation.controller"
import { CreateItemTaxationController } from "@/modules/item/infra/http/controllers/create-item-taxation.controller"
import { CreateBoletoController } from "@/modules/transaction/infra/http/controllers/create-boleto.controller"
import { PrintBoletoController } from "@/modules/transaction/infra/http/controllers/print-boleto.controller"
import { CancelBoletoController } from "@/modules/transaction/infra/http/controllers/cancel-boleto.controller"
import { FetchBoletoController } from "@/modules/transaction/infra/http/controllers/fetch-boleto.controller"
import { GetBoletoController } from "@/modules/transaction/infra/http/controllers/get-boleto.controller"
import { CreatePixController } from "@/modules/transaction/infra/http/controllers/create-pix.controller"
import { GetPixController } from "@/modules/transaction/infra/http/controllers/get-pix.controller"
import { FetchPixController } from "@/modules/transaction/infra/http/controllers/fetch-pix.controller"
import { CreatePaymentPixKeyController } from "@/modules/payment/infra/http/controllers/create-payment-pix-key.controller"
import { CreatePaymentPixBankDataController } from "@/modules/payment/infra/http/controllers/create-payment-pix-bank-data.controller"
import { GetPaymentPixProofController } from "@/modules/payment/infra/http/controllers/get-payment-pix-proof.controller"
import { CreateSubscriptionController } from "@/modules/subscription/infra/http/controllers/create-subscription.controller"
import { SignUpController } from "@/modules/application/infra//controllers/sign-up.controller"
import { WhatsAppController } from "@/modules/whatsapp/infra/http/controllers/whatsapp.controller"

// Use Cases - Application
import { CreateAppUseCase } from "@/modules/application/domain/use-cases/create-app.use-case"
import { FetchAppUseCase } from "@/modules/application/domain/use-cases/fetch-app.use-case"
import { EditAppUseCase } from "@/modules/application/domain/use-cases/edit-app.use-case"
import { DeleteAppUseCase } from "@/modules/application/domain/use-cases/delete-app.use-case"
import { CreateMarketplaceUseCase } from "@/modules/application/domain/use-cases/create-marketplace.use-case"
import { EditMarketplaceUseCase } from "@/modules/application/domain/use-cases/edit-marketplace.use-case"
import { FetchMarketplaceUseCase } from "@/modules/application/domain/use-cases/fetch-marketplace.use-case"
import { AuthenticateUserUseCase } from "@/modules/application/domain/use-cases/authenticate-user.use-case"
import { AuthenticateBusinessUseCase } from "@/modules/application/domain/use-cases/authenticate-business.use-case"
import { CreateUserUseCase } from '@/modules/application/domain/use-cases/create-user.use-case'
import { EditUserUseCase } from "@/modules/application/domain/use-cases/edit-user.use-case"
import { DeleteUserUseCase } from "@/modules/application/domain/use-cases/delete-user.use-case"
import { FetchUserUseCase } from "@/modules/application/domain/use-cases/fetch-user.use-case"
import { GetUserUseCase } from "@/modules/application/domain/use-cases/get-user.use-case"
import { SetUserPhotoUseCase } from "@/modules/application/domain/use-cases/set-user-photo.use-case"
import { SetDefaultBusinessUseCase } from "@/modules/application/domain/use-cases/set-default-business.use-case"
import { CreateTermUseCase } from "@/modules/application/domain/use-cases/create-term.use-case"
import { DeleteTermUseCase } from "@/modules/application/domain/use-cases/delete-term.use-case"
import { EditTermUseCase } from "@/modules/application/domain/use-cases/edit-term.use-case"
import { FetchTermUseCase } from "@/modules/application/domain/use-cases/fetch-term.use-case"
import { CreateUserTermUseCase } from "@/modules/application/domain/use-cases/create-user-term.use-case"
import { DeleteUserTermUseCase } from "@/modules/application/domain/use-cases/delete-user-term.use-case"
import { FetchUserTermUseCase } from "@/modules/application/domain/use-cases/fetch-user-terms.use-case"
import { CreateBusinessUseCase } from "@/modules/application/domain/use-cases/create-business.use-case"
import { EditBusinessUseCase } from "@/modules/application/domain/use-cases/edit-business.use-case"
import { DeleteBusinessUseCase } from '@/modules/application/domain/use-cases/delele-business.use-case'
import { FetchBusinessUseCase } from "@/modules/application/domain/use-cases/fetch-business.use-case"
import { GetBusinessUseCase } from '@/modules/application/domain/use-cases/get-business.use-case'
import { CreateBusinessOwnerUseCase } from "@/modules/application/domain/use-cases/create-business-owner.use-case"
import { EditBusinessOwnerUseCase } from "@/modules/application/domain/use-cases/edit-business-owner.use-case"
import { FetchBusinessOwnerUseCase } from "@/modules/application/domain/use-cases/fetch-user-owner.use-case"
import { CreateBusinessAppUseCase } from "@/modules/application/domain/use-cases/create-business-app.use-case"
import { EditBusinessAppUseCase } from "@/modules/application/domain/use-cases/edit-business-app.use-case"
import { FetchBusinessAppUseCase } from "@/modules/application/domain/use-cases/fetch-business-apps.use-case"
import { CreateUserBusinessUseCase } from "@/modules/application/domain/use-cases/create-user-business.use-case"
import { EditUserBusinessUseCase } from "@/modules/application/domain/use-cases/edit-user-business.use-case"
import { FetchUserBusinessUseCase } from "@/modules/application/domain/use-cases/fetch-user-business.use-case"

// Use Cases - Person
import { CreatePersonUseCase } from "@/modules/person/domain/use-cases/create-person.use-case"
import { EditPersonUseCase } from "@/modules/person/domain/use-cases/edit-person.use-case"
import { DeletePersonUseCase } from "@/modules/person/domain/use-cases/delete-person.use-case"
import { FetchPersonUseCase } from "@/modules/person/domain/use-cases/fetch-person.use-case"
import { GetPersonUseCase } from "@/modules/person/domain/use-cases/get-person.use-case"

// Use Cases - Item
import { FetchItemUseCase } from "@/modules/item/domain/use-cases/fetch-item.use-case"
import { EditItemUseCase } from "@/modules/item/domain/use-cases/edit-item.use-case"
import { DeleteItemUseCase } from "@/modules/item/domain/use-cases/delete-item.use-case"
import { CreateItemUseCase } from "@/modules/item/domain/use-cases/create-item.use-case"
import { CreateItemGroupUseCase } from "@/modules/item/domain/use-cases/create-item-group.use-case"
import { EditItemGroupUseCase } from "@/modules/item/domain/use-cases/edit-item-group.use-case"
import { DeleteItemGroupUseCase } from "@/modules/item/domain/use-cases/delete-item-group.use-case"
import { FetchItemGroupUseCase } from

import { FetchItemGroupUseCase } from "@/modules/item/domain/use-cases/fetch-item-group.use-case"
import { CreateItemTaxationUseCase } from "@/modules/item/domain/use-cases/create-item-taxation.use-case"
import { EditItemTaxationUseCase } from "@/modules/item/domain/use-cases/edit-item-taxation.use-case"
import { DeleteItemTaxationUseCase } from "@/modules/item/domain/use-cases/delete-item-taxation.use-case"
import { FetchItemTaxationUseCase } from "@/modules/item/domain/use-cases/fech-item-taxation.use-case"

// Use Cases - Transaction
import { CreateBoletoUseCase } from "@/modules/transaction/domain/use-cases/create-boleto.use-case"
import { PrintBoletoUseCase } from "@/modules/transaction/domain/use-cases/print-boleto.use-case"
import { CancelBoletoUseCase } from "@/modules/transaction/domain/use-cases/cancel-boleto.use-case"
import { FetchBoletoUseCase } from "@/modules/transaction/domain/use-cases/fetch-boletos.use-case"
import { GetBoletoUseCase } from "@/modules/transaction/domain/use-cases/get-boleto.use-case"
import { CreatePixUseCase } from "@/modules/transaction/domain/use-cases/create-pix.use-case"
import { FetchPixUseCase } from "@/modules/transaction/domain/use-cases/fetch-pixes.use-case"
import { GetPixUseCase } from "@/modules/transaction/domain/use-cases/get-pix.use-case"

// Use Cases - Payment
import { CreatePaymentPixKeyUseCase } from "@/modules/payment/domain/use-cases/create-payment-pix-key.use-case"
import { CreatePaymentPixBankDataUseCase } from "@/modules/payment/domain/use-cases/create-payment-pix-bank-data.use-case"
import { UpdatePaymentPixUseCase } from "@/modules/payment/domain/use-cases/update-payment-pix.use-case"
import { GetPaymentPixProofUseCase } from "@/modules/payment/domain/use-cases/get-payment-pix-proof.use-case"
import { CancelPaymentPixScheduledUseCase } from "@/modules/payment/domain/use-cases/cancel-payment-pix-scheduled.use-case"

// Use Cases - Others
import { UploadAndCreateFileUseCase } from "@/modules/file/domain/use-cases/upload-and-create-file.use-case"
import { SendAndCreateEmailUseCase } from "@/modules/email/domain/use-cases/send-and-create-email.use-case"
import { ConnectWhatsAppUseCase } from "@/modules/whatsapp/domain/use-cases/connect-whatsapp.use-case"
import { SendWhatsAppUseCase } from "@/modules/whatsapp/domain/use-cases/send-whatsapp.use-case"
import { CreateSubscriptionUseCase } from "@/modules/subscription/domain/use-cases/create-subscription.use-case"
import { CreateNfseUseCase } from "@/modules/dfe/domain/nfse/use-cases/create-nfse.use-case"
import { GetNfseUseCase } from "@/modules/dfe/domain/nfse/use-cases/get-nfse.use-case"

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
    GetPaymentPixProofController,

    //subscription
    CreateSubscriptionController,

    //whatsapp
    WhatsAppController
  ],

  providers: [
    CreatePaymentPixKeyUseCase,
    CreatePaymentPixBankDataUseCase,
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
    GetPaymentPixProofUseCase,

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