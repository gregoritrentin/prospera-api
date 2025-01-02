import { Module } from '@nestjs/common'
import { Encrypter } from '@/modules/domain/cryptography/encrypter'
import { HashComparer } from '@/modules/domain/cryptography/hash-comparer'
import { HashGenerator } from '@/modules/domain/cryptography/hash-generator'
import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

// Use caminhos relativos
@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}