import {SetMetadata} from '@nestjs/common';

export const AuthorRoles = (...roles: string[]) => SetMetadata('allowedRoles', roles)