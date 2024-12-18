import { Module } from '@nestjs/common'

import { Encrypter } from '@/core/cryptografy/encrypter'
import { HashComparer } from '@/core/cryptografy/hash-comparer'
import { HashGenerator } from '@/core/cryptografy/hash-generator'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule { }