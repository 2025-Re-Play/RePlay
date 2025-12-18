class AppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource Not Found"):
        super().__init__(code="NOT_FOUND", message=message, status_code=404)


class ValidationException(AppException):
    def __init__(self, message: str = "Validation Failed"):
        super().__init__(code="VALIDATION_ERROR", message=message, status_code=422)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "인증이 필요합니다."):
        super().__init__(code="UNAUTHORIZED", message=message, status_code=401)


class ForbiddenException(AppException):
    def __init__(self, message: str = "권한이 없습니다."):
        super().__init__(code="FORBIDDEN", message=message, status_code=403)