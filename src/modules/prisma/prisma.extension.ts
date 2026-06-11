/**
 * @file prisma.extension.ts
 * @description Custom Prisma Client extension for automatic data security.
 * @responsibility Intercepts database operations on the Profile model to encrypt/decrypt sensitive fields.
 * @strategy Uses the EncryptionService to handle AES-256-CTR transformations during query execution.
 * @logic Applies encryption on 'create/update' and decryption on 'result' for 'medications' and 'allergies'.
 * @mapping Targets the 'Profile' table to ensure sensitive data protection.
 */

import { PrismaClient, BloodType } from '@prisma/client';
import { EncryptionService } from '../security/services/encryption/encryption.service';

export const extendPrismaClient = (
  prisma: PrismaClient,
  encryptionService: EncryptionService,
) => {
  return prisma.$extends({
    name: 'encryptionExtension',
    query: {
      profile: {
        async create({ args, query }) {
          if (args.data.medications) {
            args.data.medications = encryptionService.encrypt(
              args.data.medications,
            );
          }
          if (args.data.allergies) {
            args.data.allergies = encryptionService.encrypt(
              args.data.allergies,
            );
          }
          if (args.data.bloodType) {
            args.data.bloodType = encryptionService.encrypt(
              args.data.bloodType,
            ) as unknown as BloodType;
          }
          return query(args);
        },
        async update({ args, query }) {
          if (typeof args.data.medications === 'string') {
            args.data.medications = encryptionService.encrypt(
              args.data.medications,
            );
          }
          if (typeof args.data.allergies === 'string') {
            args.data.allergies = encryptionService.encrypt(
              args.data.allergies,
            );
          }
          if (typeof args.data.bloodType === 'string') {
            args.data.bloodType = encryptionService.encrypt(
              args.data.bloodType,
            ) as unknown as BloodType;
          }
          return query(args);
        },
      },
    },
    result: {
      profile: {
        medications: {
          needs: { medications: true },
          compute(profile) {
            return profile.medications
              ? encryptionService.decrypt(profile.medications)
              : null;
          },
        },
        allergies: {
          needs: { allergies: true },
          compute(profile) {
            return profile.allergies
              ? encryptionService.decrypt(profile.allergies)
              : null;
          },
        },
        bloodType: {
          needs: { bloodType: true },
          compute(profile) {
            return profile.bloodType
              ? encryptionService.decrypt(profile.bloodType)
              : null;
          },
        },
      },
    },
  });
};
