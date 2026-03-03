import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", project: "CL-Agent-Lex" });
  });

  // RUT Validation Endpoint
  app.post("/api/validate-rut", (req, res) => {
    const { rut } = req.body;
    if (!rut) return res.status(400).json({ error: "RUT is required" });
    
    const isValid = validateRut(rut);
    res.json({ isValid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function validateRut(rut: string): boolean {
  if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;
  const [num, dv] = rut.split("-");
  let res = 0;
  let mul = 2;
  for (let i = num.length - 1; i >= 0; i--) {
    res += parseInt(num[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const dvr = 11 - (res % 11);
  const dvStr = dvr === 11 ? "0" : dvr === 10 ? "K" : dvr.toString();
  return dvStr.toUpperCase() === dv.toUpperCase();
}

startServer();
