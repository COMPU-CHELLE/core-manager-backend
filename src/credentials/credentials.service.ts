import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { BaseService } from 'src/common/base/base.service';
import { RequestContext } from 'src/common/context/request-context';
import { PrismaService } from 'src/prisma/prisma.service';
import { EncryptionService } from 'src/common/crypto/encryption.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { RevealCredentialDto } from './dto/reveal-credential.dto';

const MASK = '••••••••';

@Injectable({ scope: Scope.REQUEST })
export class CredentialsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    context: RequestContext,
  ) {
    super(context);
  }

  /**
   * Nunca devuelve username/password reales: los reemplaza por una máscara.
   * Para ver el valor real hay que pasar por reveal().
   */
  private toSafeDto<T extends { username: string; password: string }>(
    credential: T,
  ) {
    return {
      ...credential,
      username: MASK,
      password: MASK,
    };
  }

  async findAll() {
    const credentials = await this.prisma.credential.findMany({
      where: this.applyTenantFilter(this.excludeDeleted()),
      include: { company: true },
      orderBy: { id: 'desc' },
    });

    return credentials.map((c) => this.toSafeDto(c));
  }

  /**
   * 🗑️ Lista solo las credenciales eliminadas (soft-delete), para la papelera.
   */
  async findDeleted() {
    const credentials = await this.prisma.credential.findMany({
      where: this.applyTenantFilter({ deletedAt: { not: null } }),
      include: { company: true },
      orderBy: { deletedAt: 'desc' },
    });

    return credentials.map((c) => this.toSafeDto(c));
  }

  async findOne(id: number) {
    const credential = await this.prisma.credential.findFirst({
      where: this.excludeDeleted({ id }),
    });

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada');
    }

    this.validateTenantAccess(credential.companyId);
    return this.toSafeDto(credential);
  }

  /**
   * Trae la credencial cruda (cifrada) para uso interno, sin enmascarar.
   */
  private async findOneRaw(id: number) {
    const credential = await this.prisma.credential.findFirst({
      where: this.excludeDeleted({ id }),
    });

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada');
    }

    this.validateTenantAccess(credential.companyId);
    return credential;
  }

  async create(dto: CreateCredentialDto) {
    const companyId = this.resolveCompanyId(dto.companyId);

    if (!companyId) {
      throw new BadRequestException('companyId es requerido');
    }

    const created = await this.prisma.credential.create({
      data: {
        ...dto,
        username: this.encryption.encrypt(dto.username),
        password: this.encryption.encrypt(dto.password),
        companyId,
      },
    });

    return this.toSafeDto(created);
  }

  async update(id: number, dto: UpdateCredentialDto) {
    await this.findOneRaw(id);

    const data: Record<string, any> = { ...dto };
    if (dto.username !== undefined) {
      data.username = this.encryption.encrypt(dto.username);
    }
    if (dto.password !== undefined) {
      data.password = this.encryption.encrypt(dto.password);
    }

    const updated = await this.prisma.credential.update({
      where: { id },
      data,
    });

    return this.toSafeDto(updated);
  }

  /**
   * 🔓 Revela username/password en texto plano y arma la info de acceso
   * según el `accessMode` de la credencial.
   * Requiere reautenticación: el usuario debe volver a ingresar SU propia
   * clave de acceso al sistema (no una clave admin compartida).
   */
  async reveal(id: number, dto: RevealCredentialDto) {
    if (!this.context.userId) {
      throw new UnauthorizedException('Sesión inválida');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: this.context.userId },
    });

    if (!user) {
      throw new UnauthorizedException('Sesión inválida');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Clave incorrecta');
    }

    const credential = await this.findOneRaw(id);
    const username = this.encryption.decrypt(credential.username);
    const password = this.encryption.decrypt(credential.password);

    const base = {
      id: credential.id,
      name: credential.name,
      type: credential.type,
      accessMode: credential.accessMode,
      username,
      password,
    };

    switch (credential.accessMode) {
      case 'basic_auth': {
        if (!credential.url) {
          throw new BadRequestException(
            'Esta credencial no tiene URL configurada para basic_auth',
          );
        }
        let loginUrl: string;
        try {
          const parsed = new URL(credential.url);
          parsed.username = encodeURIComponent(username);
          parsed.password = encodeURIComponent(password);
          loginUrl = parsed.toString();
        } catch {
          throw new BadRequestException('La URL de la credencial no es válida');
        }
        return { ...base, url: loginUrl };
      }

      case 'local_only':
        // Sin URL: es una clave de superusuario/administrador local del equipo.
        return base;

      case 'copy_open':
      default:
        return { ...base, url: credential.url ?? null };
    }
  }

  /**
   * 🗑️ Soft-delete: marca la credencial como eliminada sin borrarla físicamente.
   */
  async remove(id: number) {
    await this.findOneRaw(id);

    return this.prisma.credential.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * 🔥 Borrado físico definitivo. Requiere permiso 'credentials.delete'.
   */
  async hardRemove(id: number) {
    await this.findOneRaw(id);

    return this.prisma.credential.delete({
      where: { id },
    });
  }

  /**
   * ♻️ Restaura una credencial previamente eliminada (soft-delete).
   */
  async restore(id: number) {
    const credential = await this.prisma.credential.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!credential) {
      throw new NotFoundException('Credencial eliminada no encontrada');
    }

    this.validateTenantAccess(credential.companyId);

    const restored = await this.prisma.credential.update({
      where: { id },
      data: { deletedAt: null },
    });

    return this.toSafeDto(restored);
  }
}
