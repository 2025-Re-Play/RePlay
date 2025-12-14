class AppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

    @classmethod
    def unauthorized(cls, message: str = "인증이 필요합니다."):
        return cls(code="UNAUTHORIZED", message=message, status_code=401)

    @classmethod
    def forbidden(cls, message: str = "권한이 없습니다."):
        return cls(code="FORBIDDEN", message=message, status_code=403)

class NotFoundException(AppException):
    def __init__(self, message="Resource Not Found"):
        super().__init__(message, code="NOT_FOUND", status_code=404)


class ValidationException(AppException):
    def __init__(self, message="Validation Failed"):
        super().__init__(message, code="VALIDATION_ERROR", status_code=422)
