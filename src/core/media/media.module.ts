import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { CloudinaryProvider } from 'src/infrastucutre/cloudinary/cloudinary.provider';
import { PrismaModule } from 'src/infrastucutre/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MediaController],
    providers: [MediaService, CloudinaryProvider],
})
export class MediaModule { }