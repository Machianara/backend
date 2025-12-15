/**
 * Swagger Configuration for Machinara Ticketing API
 * This file contains the OpenAPI/Swagger specification for the entire API
 */

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Machinara API",
    description: "API untuk prediksi kerusakan mesin dengan AI dan sistem manajemen tiket maintenance mesin yang rusak.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://backend-dev-service.up.railway.app",
      description: "Production Server"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Token untuk autentikasi"
      }
    },
    schemas: {
      // User Schemas
      User: {
        type: "object",
        required: ["id", "name", "phone", "role"],
        properties: {
          id: {
            type: "integer",
            example: 1,
            description: "User ID"
          },
          name: {
            type: "string",
            example: "Budi Santoso",
            description: "Nama pengguna"
          },
          phone: {
            type: "string",
            example: "08123456789",
            description: "Nomor telepon pengguna"
          },
          biography: {
            type: "string",
            example: "Teknisi mesin berpengalaman",
            description: "Biografi pengguna (hanya untuk role user)"
          },
          role: {
            type: "string",
            enum: ["admin", "user"],
            example: "user",
            description: "Role pengguna"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Waktu pembuatan akun"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Waktu update terakhir"
          }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["phone", "password"],
        properties: {
          phone: {
            type: "string",
            example: "08123456789",
            description: "Nomor telepon"
          },
          password: {
            type: "string",
            example: "password123",
            description: "Password"
          }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Login berhasil"
          },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "JWT Token"
          },
          user: {
            $ref: "#/components/schemas/User"
          }
        }
      },
      CreateAccountRequest: {
        type: "object",
        required: ["name", "phone", "password"],
        properties: {
          name: {
            type: "string",
            example: "Budi Santoso",
            description: "Nama pengguna"
          },
          phone: {
            type: "string",
            example: "08123456789",
            description: "Nomor telepon"
          },
          password: {
            type: "string",
            example: "password123",
            description: "Password minimal 6 karakter"
          }
        }
      },
      UpdateProfileRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Budi Santoso Updated",
            description: "Nama pengguna (opsional)"
          },
          biography: {
            type: "string",
            example: "Teknisi senior",
            description: "Biografi (opsional)"
          },
          password: {
            type: "string",
            example: "newpassword123",
            description: "Password baru (opsional)"
          }
        }
      },
      UpdateUserByAdminRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "Budi Santoso",
            description: "Nama pengguna (opsional)"
          },
          biography: {
            type: "string",
            example: "Teknisi baru",
            description: "Biografi (opsional)"
          }
        }
      },
      // Ticket Schemas
      Ticket: {
        type: "object",
        required: ["id", "machine_name", "date", "issue", "status"],
        properties: {
          id: {
            type: "integer",
            example: 1,
            description: "Ticket ID"
          },
          machine_name: {
            type: "string",
            example: "Mesin Produksi A",
            description: "Nama mesin"
          },
          date: {
            type: "string",
            format: "date",
            example: "2024-12-15",
            description: "Tanggal tiket dibuat"
          },
          issue: {
            type: "string",
            example: "Mesin menghasilkan suara aneh",
            description: "Deskripsi masalah"
          },
          status: {
            type: "string",
            enum: ["open", "in-progress", "resolved", "closed"],
            example: "open",
            description: "Status tiket"
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            example: "medium",
            description: "Prioritas tiket"
          },
          auto_generated: {
            type: "boolean",
            example: false,
            description: "Apakah tiket dibuat secara otomatis oleh AI"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Waktu pembuatan tiket"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Waktu update terakhir"
          }
        }
      },
      CreateTicketRequest: {
        type: "object",
        required: ["machine_name", "date", "issue"],
        properties: {
          machine_name: {
            type: "string",
            example: "Mesin Produksi A",
            description: "Nama mesin"
          },
          date: {
            type: "string",
            format: "date",
            example: "2024-12-15",
            description: "Tanggal tiket"
          },
          issue: {
            type: "string",
            example: "Mesin menghasilkan suara aneh",
            description: "Deskripsi masalah"
          }
        }
      },
      UpdateTicketRequest: {
        type: "object",
        properties: {
          machine_name: {
            type: "string",
            description: "Nama mesin (opsional)"
          },
          date: {
            type: "string",
            format: "date",
            description: "Tanggal (opsional)"
          },
          issue: {
            type: "string",
            description: "Deskripsi masalah (opsional)"
          },
          status: {
            type: "string",
            enum: ["open", "in-progress", "resolved", "closed"],
            description: "Status tiket (opsional)"
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Prioritas tiket (opsional)"
          }
        }
      },
      AutoTicketRequest: {
        type: "object",
        required: ["machine_name", "issue"],
        properties: {
          machine_name: {
            type: "string",
            example: "Mesin Produksi B",
            description: "Nama mesin/Product ID"
          },
          issue: {
            type: "string",
            example: "Anomali terdeteksi pada sensor",
            description: "Deskripsi masalah dari AI"
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            example: "high",
            description: "Prioritas dari AI (opsional, default: medium)"
          }
        }
      },
      AutoTicketResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
            description: "Status kesuksesan pembuatan tiket"
          },
          ticket_id: {
            type: "integer",
            example: 1,
            description: "ID tiket yang dibuat"
          },
          machine_name: {
            type: "string",
            example: "Mesin Produksi B",
            description: "Nama mesin"
          },
          status: {
            type: "string",
            example: "open",
            description: "Status tiket"
          },
          priority: {
            type: "string",
            example: "high",
            description: "Prioritas tiket"
          }
        }
      },
      ManualInputRequest: {
        type: "object",
        required: ["machine_name"],
        properties: {
          machine_name: {
            type: "string",
            example: "Mesin A",
            description: "Nama mesin / Product ID"
          },
          product_type: {
            type: "string",
            example: "Turbine",
            description: "Tipe produk (opsional)"
          },
          rotational_speed: {
            type: "number",
            example: 1500,
            description: "Kecepatan rotasi (RPM)"
          },
          temperature: {
            type: "number",
            example: 45.5,
            description: "Suhu mesin (°C)"
          },
          vibration: {
            type: "number",
            example: 2.3,
            description: "Tingkat vibrasi (mm/s)"
          },
          pressure: {
            type: "number",
            example: 100,
            description: "Tekanan (bar)"
          }
        }
      },
      ManualInputResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
            description: "Status proses"
          },
          product_id: {
            type: "string",
            example: "Mesin A",
            description: "ID produk"
          },
          report_data: {
            type: "object",
            properties: {
              mesin: {
                type: "object",
                description: "Detail data mesin"
              },
              prediksi: {
                type: "object",
                properties: {
                  status_label: {
                    type: "string",
                    example: "NORMAL",
                    description: "Label status prediksi"
                  },
                  current_risk: {
                    type: "string",
                    example: "Low",
                    description: "Level risiko saat ini"
                  },
                  ai_confidence: {
                    type: "string",
                    example: "95.5%",
                    description: "Confidence level AI"
                  },
                  pesan_fisik: {
                    type: "string",
                    description: "Pesan fisik dari metrik"
                  }
                }
              },
              analisis: {
                type: "object",
                properties: {
                  ai_analysis: {
                    type: "string",
                    description: "Analisis dari AI"
                  },
                  radar_chart: {
                    type: "string",
                    format: "base64",
                    description: "Radar chart dalam format base64 (opsional)"
                  }
                }
              }
            }
          }
        }
      },
      // Error Responses
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Error message"
          },
          error: {
            type: "string",
            example: "Error description"
          }
        }
      },
      UnauthorizedResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Token tidak ditemukan"
          }
        }
      },
      ForbiddenResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Anda tidak memiliki akses admin"
          }
        }
      },
      NotFoundResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Ticket not found"
          }
        }
      },
      SuccessResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Operation successful"
          }
        }
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login",
        description: "Login dengan nomor HP dan password untuk mendapatkan JWT token",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login berhasil",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse"
                }
              }
            }
          },
          400: {
            description: "Data tidak lengkap",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Nomor HP dan password wajib diisi"
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Login gagal - nomor HP atau password salah",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          }
        }
      }
    },
    "/auth/create-account": {
      post: {
        tags: ["Authentication"],
        summary: "Buat Akun Baru",
        description: "Membuat akun user baru (hanya admin yang bisa)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateAccountRequest"
              }
            }
          }
        },
        responses: {
          201: {
            description: "Akun berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Akun berhasil dibuat"
                    },
                    user: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Validasi gagal atau user sudah ada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          403: {
            description: "Hanya admin yang bisa membuat akun",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ForbiddenResponse"
                }
              }
            }
          }
        }
      }
    },
    "/auth/users": {
      get: {
        tags: ["Authentication"],
        summary: "Daftar Semua User",
        description: "Mendapatkan daftar semua user (hanya admin)",
        responses: {
          200: {
            description: "Daftar user berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Daftar user berhasil diambil"
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/User"
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          403: {
            description: "Hanya admin yang bisa mengakses",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ForbiddenResponse"
                }
              }
            }
          }
        }
      }
    },
    "/auth/users/{userId}": {
      put: {
        tags: ["Authentication"],
        summary: "Update User oleh Admin",
        description: "Admin mengupdate data user (name dan biography)",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            description: "ID user yang akan diupdate",
            schema: {
              type: "integer"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateUserByAdminRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Data user berhasil diupdate",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Data user berhasil diupdate"
                    },
                    user: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          403: {
            description: "Hanya admin yang bisa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ForbiddenResponse"
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Authentication"],
        summary: "Hapus User",
        description: "Admin menghapus user dari sistem",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            description: "ID user yang akan dihapus",
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "User berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User berhasil dihapus"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "User ID tidak ditemukan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          403: {
            description: "Hanya admin yang bisa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ForbiddenResponse"
                }
              }
            }
          }
        }
      }
    },
    "/auth/profile": {
      put: {
        tags: ["Authentication"],
        summary: "Update Profil User",
        description: "User mengupdate profil mereka sendiri (name, biography, password)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateProfileRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Profil berhasil diupdate",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Profil berhasil diupdate"
                    },
                    user: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          403: {
            description: "Hanya user biasa yang bisa mengakses",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ForbiddenResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/tickets": {
      post: {
        tags: ["Tickets"],
        summary: "Buat Tiket Baru",
        description: "Membuat tiket baru untuk pelaporan masalah mesin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTicketRequest"
              }
            }
          }
        },
        responses: {
          201: {
            description: "Tiket berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Ticket created"
                    },
                    ticket: {
                      $ref: "#/components/schemas/Ticket"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          500: {
            description: "Gagal membuat tiket",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      get: {
        tags: ["Tickets"],
        summary: "Daftar Semua Tiket",
        description: "Mendapatkan daftar semua tiket yang telah dibuat, diurutkan dari terbaru",
        responses: {
          200: {
            description: "Daftar tiket berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Ticket"
                  }
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          500: {
            description: "Gagal mengambil daftar tiket",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/tickets/{id}": {
      get: {
        tags: ["Tickets"],
        summary: "Detail Tiket",
        description: "Mendapatkan detail tiket berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID tiket",
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "Detail tiket berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Ticket"
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          404: {
            description: "Tiket tidak ditemukan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse"
                }
              }
            }
          },
          500: {
            description: "Gagal mengambil detail tiket",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["Tickets"],
        summary: "Update Tiket",
        description: "Mengupdate informasi tiket (status, priority, issue, dll)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID tiket",
            schema: {
              type: "integer"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTicketRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Tiket berhasil diupdate",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Ticket updated"
                    },
                    ticket: {
                      $ref: "#/components/schemas/Ticket"
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          404: {
            description: "Tiket tidak ditemukan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse"
                }
              }
            }
          },
          500: {
            description: "Gagal mengupdate tiket",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Tickets"],
        summary: "Hapus Tiket",
        description: "Menghapus tiket dari sistem",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID tiket",
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "Tiket berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Ticket deleted"
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          404: {
            description: "Tiket tidak ditemukan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse"
                }
              }
            }
          },
          500: {
            description: "Gagal menghapus tiket",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/auto-tickets": {
      post: {
        tags: ["Auto Tickets"],
        summary: "Buat Tiket Otomatis",
        description: "Membuat tiket otomatis dari sistem AI/ML (digunakan oleh Python service)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AutoTicketRequest"
              }
            }
          }
        },
        responses: {
          201: {
            description: "Tiket otomatis berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AutoTicketResponse"
                }
              }
            }
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "machine_name and issue are required"
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          500: {
            description: "Gagal membuat tiket otomatis",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false
                    },
                    error: {
                      type: "string",
                      example: "Failed to create auto ticket"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/manual-input": {
      post: {
        tags: ["Prediction & Analysis"],
        summary: "Input Data Manual",
        description: "Mengirimkan data sensor mesin secara manual untuk prediksi dan analisis AI",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ManualInputRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Prediksi dan analisis berhasil diproses",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ManualInputResponse"
                }
              }
            }
          },
          400: {
            description: "Validasi input gagal",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Input validation failed"
                    },
                    message: {
                      type: "string",
                      example: "machine_name (Product ID) or sensor data is required."
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Token tidak valid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedResponse"
                }
              }
            }
          },
          500: {
            description: "Gagal memproses data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "ML Service Error"
                    },
                    message: {
                      type: "string",
                      example: "Gagal memproses prediksi dari layanan ML."
                    },
                    status_code_from_ml: {
                      type: "integer",
                      example: 500
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
  tags: [
    {
      name: "Authentication",
      description: "Endpoint untuk autentikasi dan manajemen user"
    },
    {
      name: "Tickets",
      description: "Endpoint untuk CRUD tiket manual"
    },
    {
      name: "Auto Tickets",
      description: "Endpoint untuk tiket otomatis dari AI/ML"
    },
    {
      name: "Prediction & Analysis",
      description: "Endpoint untuk input data sensor dan prediksi AI"
    }
  ]
};
