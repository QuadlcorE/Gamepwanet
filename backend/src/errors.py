from fastapi import Request
from fastapi.responses import JSONResponse


class IGDBError(Exception):
    def __init__(self, status_code: int, detail, query: str = ""):
        self.status_code = status_code
        self.detail = detail
        self.query = query
        super().__init__(f"IGDB {status_code}: {detail}")


async def igdb_error_handler(request: Request, exc: IGDBError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
