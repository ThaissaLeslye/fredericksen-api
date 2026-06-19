import { plainToInstance } from 'class-transformer';
import {
  IsBase64,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsBase64()
  @Length(44, 44, {
    message:
      'A ENCRYPTION_KEY deve ser um Base64 válido de exatamente 44 caracteres (32 bytes).',
  })
  ENCRYPTION_KEY!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsNotEmpty()
  JWT_EXPIRES_IN!: number;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  GOOGLE_CALLBACK_URL!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  FREDERICKSEN_WEB_URL!: string;
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
