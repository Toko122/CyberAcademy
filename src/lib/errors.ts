export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 503, "CONFIGURATION_ERROR", options);
  }
}

export class ImageUploadError extends AppError {
  constructor(options?: ErrorOptions) {
    super("Image upload failed. Please try again.", 502, "IMAGE_UPLOAD_FAILED", options);
  }
}

export function logServerError(context: string, error: unknown) {
  const details = error instanceof Error
    ? {
        name: error.name,
        message: error.message,
        code: "code" in error ? String(error.code) : undefined,
        cause: error.cause instanceof Error ? error.cause.message : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }
    : { value: String(error) };

  console.error(context, details);
}
