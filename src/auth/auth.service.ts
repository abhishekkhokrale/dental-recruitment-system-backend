import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role ?? 'seeker',
    })
    return this.signToken(user.id, user.name, user.email, user.role)
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.validatePassword(dto.email, dto.password)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    return this.signToken(user.id, user.name, user.email, user.role)
  }

  private signToken(sub: string, name: string, email: string, role: string) {
    const payload = { sub, name, email, role }
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: sub, name, email, role },
    }
  }
}
