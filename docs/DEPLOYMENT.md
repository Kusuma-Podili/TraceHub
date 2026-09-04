# TraceHub Production Deployment Guide

## 1. Quick Launch with Docker Compose

```bash
docker-compose up -d --build
```

Access the web interface at:
`http://localhost:8000`

## 2. Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8000` | Application HTTP listen port |
| `SECRET_KEY` | (Auto-generated) | JWT token signing key |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` | Session lifetime (8 hours) |
| `DATABASE_URL` | `sqlite:///./data/sdlc_management.db` | Database connection string |

## 3. Reverse Proxy with Nginx (Recommended)

```nginx
server {
    listen 80;
    server_name tracehub.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
