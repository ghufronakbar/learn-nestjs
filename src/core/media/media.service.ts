import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as crypto from 'crypto';
import { ENV } from 'src/constants/env';
import { PrismaService } from 'src/infrastucutre/config/database/prisma/prisma.service';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
    constructor(private readonly prisma: PrismaService) { }

    async uploadImage(file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');

        // 1. Generate Hash from Buffer File (SHA-256)
        const hash = crypto
            .createHash('sha256')
            .update(file.buffer)
            .digest('hex');

        // 2. Check Database if Hash already exists (Deduplication Check)
        const existingImage = await this.prisma.image.findUnique({
            where: { hash },
        });

        // 3. BRANCH A: If exists, return old data (Save Cloudinary)
        if (existingImage) {
            return {
                isDuplicate: true,
                ...existingImage,
            };
        }

        // 4. BRANCH B: If not exists, Upload to Cloudinary
        const uploadResult = await this.uploadToCloudinary(file);

        if (!uploadResult) {
            throw new InternalServerErrorException('Failed to upload to Cloudinary');
        }

        // 5. Save to Database
        const newImage = await this.prisma.image.create({
            data: {
                hash: hash,
                url: uploadResult.secure_url,
                key: uploadResult.public_id,
                mimeType: file.mimetype,
                size: file.size,
            },
        });

        return {
            isDuplicate: false,
            ...newImage,
        };
    }

    // Helper: Upload Buffer to Cloudinary via Stream
    private async uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse | undefined> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: ENV.appName,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            const stream = Readable.from(file.buffer);
            stream.pipe(uploadStream);
        });
    }
}