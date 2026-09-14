import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * 🔐 Cifrado simétrico AES-256-GCM para datos sensibles en reposo
 * (credenciales de dominios/servidores/DVR/routers, etc.).
 *
 * La clave se toma de la variable de entorno ENCRYPTION_KEY:
 * - Si tiene 64 caracteres hex, se usa directamente como los 32 bytes de la clave.
 * - En cualquier otro caso, se deriva con scrypt (permite usar una passphrase).
 *
 * Formato de salida: "<iv_base64>:<authTag_base64>:<ciphertext_base64>"
 * GCM incluye autenticación: si el dato fue alterado, decrypt() lanza error.
 */
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    const secret = process.env.ENCRYPTION_KEY;

    if (!secret) {
      throw new InternalServerErrorException(
        'ENCRYPTION_KEY no está definida en el entorno (.env)',
      );
    }

    this.key =
      secret.length === 64
        ? Buffer.from(secret, 'hex')
        : crypto.scryptSync(secret, 'sysmanager-credentials', 32);
  }

  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  decrypt(payload: string): string {
    const [ivB64, tagB64, dataB64] = payload.split(':');

    if (!ivB64 || !tagB64 || !dataB64) {
      throw new InternalServerErrorException(
        'Formato de dato cifrado inválido',
      );
    }

    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  /**
   * Enmascara un valor cifrado para mostrarlo en listados sin revelarlo.
   */
  mask(): string {
    return '••••••••';
  }
}
