import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export const CREDENTIAL_ACCESS_MODES = [
  'basic_auth', // DVR / routers: usuario:clave@host
  'copy_open', // servidores / paneles con formulario / correos
  'local_only', // superusuario local del equipo (sin URL de acceso)
] as const;

export class CreateCredentialDto {
  @IsInt()
  id?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsIn(CREDENTIAL_ACCESS_MODES)
  accessMode?: (typeof CREDENTIAL_ACCESS_MODES)[number];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  companyId?: number;
}
