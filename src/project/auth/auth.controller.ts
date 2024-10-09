import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import { ProjectService } from './auth.service';

@Controller('project')
export class AuthController {
    constructor(private readonly ProjectService: ProjectService) {}
    @Post("register")
    async register(@Body() payload: RegisterDto) {
      return this.ProjectService.register(payload)
    }
    @Post('login')
    async login(@Body() payload: LoginDto) {
      return this.ProjectService.login(payload);
    }
}
