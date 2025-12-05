"use strict";
// proxy.conf.ts
Object.defineProperty(exports, "__esModule", { value: true });
const proxyConfig = {
    "/auth": {
        target: "http://localhost:8080",
        secure: false,
        changeOrigin: true,
        logLevel: "debug",
        onProxyReq: (proxyReq, req) => {
            const tenantHeader = req.headers["x-tenant-id"];
            if (tenantHeader) {
                const tenant = Array.isArray(tenantHeader) ? tenantHeader[0] : tenantHeader;
                console.log("Proxy repassando tenant:", tenant);
                proxyReq.setHeader("X-Tenant-ID", tenant);
            }
        }
    }
};
exports.default = proxyConfig;
