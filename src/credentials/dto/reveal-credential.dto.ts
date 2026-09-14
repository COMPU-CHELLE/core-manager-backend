import { IsString, MinLength } from 'class-validator';

export class RevealCredentialDto {
  /**
   * La contraseña del propio usuario autenticado (reautenticación),
   * NO la contraseña de la credencial que se quiere ver.
   */
  @IsString()
  @MinLength(1)
  password: string;
}
