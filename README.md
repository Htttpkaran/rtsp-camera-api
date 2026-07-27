# Camera Management Service

A production-ready, high-performance Node.js middleware API built using **Express.js** to manage RTSP camera streams dynamically via the **MediaMTX Control API**.

This service acts as a middleware bridge, enabling dynamic configuration of cameras and tracking stream state in real-time, storing **no database state** on the server.

---

## Folder Structure

The project conforms to the following modular architecture:

```text
camera-service/
│
├── src/
│   ├── config/
│   │   ├── index.js            # Environment validation (dotenv + Joi)
│   │   └── swagger.js          # Swagger API documentation config
│   │
│   ├── utils/
│   │   ├── logger.js           # Winston logger configuration
│   │   └── errors.js           # Centralized custom error classes
│   │
│   ├── services/
│   │   └── MediaMTXService.js  # Axios client wrapper for MediaMTX API
│   │
│   ├── validators/
│   │   └── cameraValidator.js  # Joi validation schemas and middleware
│   │
│   ├── middleware/
│   │   ├── requestLogger.js    # Incoming request & response-time logger
│   │   ├── rateLimiter.js      # Rate limiting (express-rate-limit)
│   │   ├── errorHandler.js     # Centralized error mapping and formatting
│   │   └── notFoundHandler.js  # 404 handler
│   │
│   ├── controllers/
│   │   └── cameraController.js # Controllers for camera operations
│   │
│   ├── routes/
│   │   ├── cameraRoutes.js     # Routes for /api/cameras
│   │   └── healthRoutes.js     # Health checks under /health
│   │
│   ├── app.js                  # App middlewares and router initialization
│   └── server.js               # Entry point to bootstrap the server
│
├── .env                        # Configuration file
├── .env.example                # Example configuration file
├── package-lock.json           # Dependency lock file
├── package.json                # Project manifest and scripts
└── README.md                   # System documentation
```

---

## Environment Variables

Create a `.env` file in the root directory. The service validates these properties on startup:

```env
PORT=5000

# MediaMTX Service Integration Points
MEDIAMTX_API=http://localhost:9997
MEDIAMTX_WEBRTC=http://localhost:8889
MEDIAMTX_HLS=http://localhost:8888
MEDIAMTX_RTSP=rtsp://localhost:8554
```

---

## Installation

1. **Clone/extract** the repository files to your workspace directory.
2. **Install dependencies** using npm:
   ```bash
   npm install
   ```

---

## Running the Project

### Development Mode (with hot-reloading)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## Swagger API Documentation

Interactive API documentation is generated using Swagger UI and is available once the server starts.

* **URL:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

You can use the Swagger UI to inspect paths, query parameters, schemas, and test the endpoints directly from the browser.

---

## MediaMTX Setup

To allow the Node.js server to interface with MediaMTX, you must ensure the Control API is enabled in your `mediamtx.yml` configuration:

```yaml
# Enable the control API
api: yes
apiAddress: 127.0.0.1:9997

# Enable protocols as required
rtsp: yes
rtspAddress: 127.0.0.1:8554

hls: yes
hlsAddress: 127.0.0.1:8888

webrtc: yes
webrtcAddress: 127.0.0.1:8889
```

---

## API Documentation

### 1. Create Camera
* **Endpoint:** `POST /api/cameras`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "cameraName": "Lane-01",
    "rtspUrl": "rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "camera": {
      "cameraName": "Lane-01",
      "rtspUrl": "rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101",
      "webrtc": "http://localhost:8889/Lane-01",
      "hls": "http://localhost:8888/Lane-01/index.m3u8",
      "rtsp": "rtsp://localhost:8554/Lane-01"
    }
  }
  ```

---

### 2. Get All Cameras
* **Endpoint:** `GET /api/cameras`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "cameras": [
      {
        "cameraName": "Lane-01",
        "rtspUrl": "rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101",
        "webrtc": "http://localhost:8889/Lane-01",
        "hls": "http://localhost:8888/Lane-01/index.m3u8",
        "rtsp": "rtsp://localhost:8554/Lane-01"
      }
    ]
  }
  ```

---

### 3. Get Single Camera
* **Endpoint:** `GET /api/cameras/:cameraName`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "camera": {
      "cameraName": "Lane-01",
      "rtspUrl": "rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101",
      "webrtc": "http://localhost:8889/Lane-01",
      "hls": "http://localhost:8888/Lane-01/index.m3u8",
      "rtsp": "rtsp://localhost:8554/Lane-01"
    }
  }
  ```

---

### 4. Update Camera
* **Endpoint:** `PUT /api/cameras/:cameraName`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "rtspUrl": "rtsp://admin:password@192.168.1.200:554/Streaming/Channels/101"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "camera": {
      "cameraName": "Lane-01",
      "rtspUrl": "rtsp://admin:password@192.168.1.200:554/Streaming/Channels/101",
      "webrtc": "http://localhost:8889/Lane-01",
      "hls": "http://localhost:8888/Lane-01/index.m3u8",
      "rtsp": "rtsp://localhost:8554/Lane-01"
    }
  }
  ```

---

### 5. Delete Camera
* **Endpoint:** `DELETE /api/cameras/:cameraName`
* **Success Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```

---

### 6. Camera Status
* **Endpoint:** `GET /api/cameras/:cameraName/status`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "cameraExists": true,
    "sourceConnected": true,
    "streamReady": true,
    "connectedReaders": 1,
    "protocolsAvailable": [
      "rtsp",
      "hls",
      "webrtc"
    ]
  }
  ```

---

### 7. Health Check
* **Endpoint:** `GET /health`
* **Success Response (200 OK):**
  ```json
  {
    "api": "UP",
    "mediamtx": "UP"
  }
  ```

---

## Error Handling

All error responses have consistent structures and status codes:

### Validation Error (400 Bad Request)
Triggers when parameter formats or request bodies fail validation (e.g. invalid spaces in camera name or non-rtsp schemes).
```json
{
  "success": false,
  "message": "Validation failed"
}
```

### Camera Already Exists (409 Conflict)
```json
{
  "success": false,
  "message": "Camera already exists"
}
```

### Camera Not Found (404 Not Found)
```json
{
  "success": false,
  "message": "Camera not found"
}
```

### MediaMTX Unreachable (503 Service Unavailable)
Returned if the backend cannot connect to the configured MediaMTX Control API.
```json
{
  "success": false,
  "message": "Unable to communicate with MediaMTX"
}
```

### Internal Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Troubleshooting Guide

### 1. "Unable to communicate with MediaMTX" (503)
* Verify that MediaMTX is currently running.
* Check your `.env` properties to ensure `MEDIAMTX_API` matches the server API endpoint (default: `http://localhost:9997`).
* Inspect MediaMTX's terminal output or log files to make sure the API is enabled (`api: yes`).

### 2. "Validation failed" (400)
* Ensure `cameraName` contains **no spaces or special characters** except for hyphens (`-`) and underscores (`_`).
* Make sure `cameraName` is under 50 characters in length.
* Ensure `rtspUrl` starts with `rtsp://` and is formatted correctly.

### 3. `sourceConnected` or `streamReady` is `false`
* Check if the camera is online and reachable from the MediaMTX host machine.
* Verify the credentials (username/password) embedded within the `rtspUrl`.
* Open the RTSP URL in a media player (e.g., VLC) to ensure the stream is active.
