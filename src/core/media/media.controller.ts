import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { AuthGuard } from '../(auth)/auth/auth.guard';

@Controller('media')
@UseGuards(AuthGuard)
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ResponseMessage('Image uploaded successfully')
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.mediaService.uploadImage(file);
    }
}