import { plainToInstance } from 'class-transformer';
import { IsBase64, IsString, Length, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsBase64()
  @Length(44, 44, {
    message:
      'A ENCRYPTION_KEY deve ser um Base64 válido de exatamente 44 caracteres (32 bytes).',
  })
  ENCRYPTION_KEY!: string;
}

export function validate(config: Record<string, string>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Configuração de ambiente inválida: ${errors.toString()}`);
  }

  return validatedConfig;
}
