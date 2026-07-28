export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Rtsp-Camera API',
    version: '1.0.0',
    description: 'A Node.js Express API to manage RTSP camera streams dynamically via MediaMTX'
  },
  servers: [
    {
      url: '/',
      description: 'API Server'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Service Health Check',
        description: 'Checks health status of the Express API and the MediaMTX service',
        responses: {
          200: {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    api: { type: 'string', example: 'UP' },
                    mediamtx: { type: 'string', example: 'UP' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/cameras': {
      post: {
        summary: 'Create / Update Camera (Upsert)',
        description: 'Creates a new camera path in MediaMTX, or updates the RTSP URL if the camera already exists',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['cameraName', 'rtspUrl'],
                properties: {
                  cameraName: { type: 'string', example: 'Lane-01' },
                  rtspUrl: { type: 'string', example: 'rtsp://admin:password@192.168.1.100:554/stream' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Camera Updated Successfully (already existed)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    camera: {
                      type: 'object',
                      properties: {
                        cameraName: { type: 'string', example: 'Lane-01' },
                        rtspUrl: { type: 'string', example: 'rtsp://admin:password@192.168.1.100:554/stream' },
                        webrtc: { type: 'string', example: 'http://localhost:8889/Lane-01' },
                        hls: { type: 'string', example: 'http://localhost:8888/Lane-01/index.m3u8' },
                        rtsp: { type: 'string', example: 'rtsp://localhost:8554/Lane-01' }
                      }
                    }
                  }
                }
              }
            }
          },
          201: {
            description: 'Camera Created Successfully (new)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    camera: {
                      type: 'object',
                      properties: {
                        cameraName: { type: 'string', example: 'Lane-01' },
                        rtspUrl: { type: 'string', example: 'rtsp://admin:password@192.168.1.100:554/stream' },
                        webrtc: { type: 'string', example: 'http://localhost:8889/Lane-01' },
                        hls: { type: 'string', example: 'http://localhost:8888/Lane-01/index.m3u8' },
                        rtsp: { type: 'string', example: 'rtsp://localhost:8554/Lane-01' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation Failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Validation failed' }
                  }
                }
              }
            }
          },
          503: {
            description: 'MediaMTX Service Unreachable',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Unable to communicate with MediaMTX' }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        summary: 'List All Cameras',
        description: 'Returns all configured camera paths from MediaMTX',
        responses: {
          200: {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    cameras: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          cameraName: { type: 'string', example: 'Lane-01' },
                          rtspUrl: { type: 'string', example: 'rtsp://admin:password@192.168.1.100:554/stream' },
                          webrtc: { type: 'string', example: 'http://localhost:8889/Lane-01' },
                          hls: { type: 'string', example: 'http://localhost:8888/Lane-01/index.m3u8' },
                          rtsp: { type: 'string', example: 'rtsp://localhost:8554/Lane-01' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/cameras/{cameraName}': {
      get: {
        summary: 'Get Single Camera',
        description: 'Retrieves the configuration of a specific camera path',
        parameters: [
          {
            name: 'cameraName',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'Lane-01'
          }
        ],
        responses: {
          200: {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    camera: {
                      type: 'object',
                      properties: {
                        cameraName: { type: 'string', example: 'Lane-01' },
                        rtspUrl: { type: 'string', example: 'rtsp://admin:password@192.168.1.100:554/stream' },
                        webrtc: { type: 'string', example: 'http://localhost:8889/Lane-01' },
                        hls: { type: 'string', example: 'http://localhost:8888/Lane-01/index.m3u8' },
                        rtsp: { type: 'string', example: 'rtsp://localhost:8554/Lane-01' }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Camera Not Found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Camera not found' }
                  }
                }
              }
            }
          }
        }
      },

      delete: {
        summary: 'Delete Camera',
        description: 'Removes the path configuration from MediaMTX',
        parameters: [
          {
            name: 'cameraName',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'Lane-01'
          }
        ],
        responses: {
          200: {
            description: 'Camera Deleted Successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true }
                  }
                }
              }
            }
          },
          404: {
            description: 'Camera Not Found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Camera not found' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/cameras/{cameraName}/status': {
      get: {
        summary: 'Get Camera Status',
        description: 'Retrieves active telemetry data for a specific camera stream',
        parameters: [
          {
            name: 'cameraName',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'Lane-01'
          }
        ],
        responses: {
          200: {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    cameraExists: { type: 'boolean', example: true },
                    sourceConnected: { type: 'boolean', example: true },
                    streamReady: { type: 'boolean', example: true },
                    connectedReaders: { type: 'integer', example: 1 },
                    protocolsAvailable: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['rtsp', 'hls', 'webrtc']
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Camera Not Found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Camera not found' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
