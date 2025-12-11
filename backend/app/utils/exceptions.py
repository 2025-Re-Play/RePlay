class AppException(Exception):
    def __init__(self, message="Application Error", code="APP_ERROR", status_code=400):
        self.message = message
        self.code = code
        self.status_code = status_code


class NotFoundException(AppException):
    def __init__(self, message="Resource Not Found"):
        super().__init__(message, code="NOT_FOUND", status_code=404)


class ValidationException(AppException):
    def __init__(self, message="Validation Failed"):
        super().__init__(message, code="VALIDATION_ERROR", status_code=422)
