from starlette.types import ASGIApp, Receive, Scope, Send

class StripPrefixMiddleware:
    """
    ASGI middleware that strips a given prefix from the incoming HTTP path
    before FastAPI route matching.
    """
    def __init__(self, app: ASGIApp, prefix: str):
        self.app = app
        self.prefix = prefix

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            path = scope["path"]
            if path.startswith(self.prefix):
                new_path = path[len(self.prefix):]
                scope["path"] = new_path or "/"
        await self.app(scope, receive, send)