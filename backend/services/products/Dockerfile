FROM python:3.11-slim-bookworm AS builder
WORKDIR /app
COPY pyproject.toml uv.lock* ./
RUN pip install --no-cache-dir uv uvicorn[standard] \
 && uv sync --locked
COPY . ./

FROM builder AS runtime
WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]
