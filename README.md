# CarBoy

---

A MERN application for logging vehicle use.

## How to Build

From this directory run:

```
docker build -t cb-client ./client/
docker build -t cb-server ./server/
```

If needed, copy the images to a server using `docker save` and `docker load`.

The application can then be run using the included `docker-compose.yml` file. Be sure to set your URL in `SERVER_URL.js`.
