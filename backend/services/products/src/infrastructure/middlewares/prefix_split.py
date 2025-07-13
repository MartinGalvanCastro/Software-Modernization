from starlette.types import ASGIApp, Receive, Scope, Send

class StripPrefixMiddleware:
    """
    Strips a given prefix from the path EXCEPT for docs & openapi endpoints.
    """
    def __init__(self, app: ASGIApp, prefix: str):
        self.app = app
        self.prefix = prefix
        # the paths that we want to preserve under the prefix
        self._skip = {
            f"{prefix}/docs",
            f"{prefix}/openapi.json",
            f"{prefix}/redoc",
        }

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            path = scope["path"]
            # only strip prefix if it's not one of the skip paths
            if path.startswith(self.prefix) and not any(path.startswith(s) for s in self._skip):
                new_path = path[len(self.prefix):]
                scope["path"] = new_path or "/"
        await self.app(scope, receive, send)
