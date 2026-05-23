import { AppError } from './AppError.js';

export class BadRequestException extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenException extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundException extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictException extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}