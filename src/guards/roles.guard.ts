import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  // Extend JwtAuthGuard
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Panggil JwtAuthGuard terlebih dahulu (untuk autentikasi)
    await super.canActivate(context); // Ini akan memanggil JwtStrategy

    // Sekarang cek role
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    if (!request.user?.role) {
      throw new ForbiddenException('Role tidak ditemukan di payload user');
    }

    return requiredRoles.includes(request.user.role);
  }
}
