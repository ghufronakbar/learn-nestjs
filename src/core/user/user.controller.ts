import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../(auth)/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FilterParams } from 'src/common/interfaces/filter.interface';
import { QueryParams } from 'src/common/decorators/query-params.decorator';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ResponseMessage('Success get all user')
  async getAllUser(@QueryParams(['name', 'email']) queryParams: FilterParams) {
    return this.userService.getAllUser(queryParams);
  }
}
