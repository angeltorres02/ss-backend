// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para recibir la petición y redirigir según el tipo
// Ejemplo de URL: GET /norton/[encryptedData]
app.get("/:tipo/:encryptedData", (req, res) => {
  try {
    const { tipo, encryptedData } = req.params;

    if (!encryptedData) {
      return res.status(400).json({ error: "encryptedData missing" });
    }

    // Decodificar la cadena para obtener el valor original
    const decodedData = decodeURIComponent(encryptedData);

    if (!process.env.SECRET_KEY) {
      return res.status(500).json({ error: "Secret key not defined" });
    }

    // Intentar desencriptar la cadena
    const bytes = CryptoJS.AES.decrypt(decodedData, process.env.SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      // Si toString() retorna cadena vacía, la desencriptación falló
      return res
        .status(400)
        .json({ error: "Decryption failed. Possibly malformed data." });
    }

    const decryptedData = JSON.parse(decryptedText);

    // Continúa con la lógica de redirección
    const baseUrl = "http://localhost:3000";
    let redirectPath = "/formulario/not-found";
    if (tipo === "norton") {
      redirectPath = "/formulario/norton";
    } else if (tipo === "mna") {
      redirectPath = "/formulario/mna";
    } else if (tipo === "sarc") {
      redirectPath = "/formulario/sarc";
    }

    const redirectUrl = `${baseUrl}${redirectPath}?ed=${encodeURIComponent(
      encryptedData
    )}&tipo=${tipo}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error en redirección:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server corriendo en http://localhost:${PORT}`);
});

// En el mismo server.js (o en otro archivo de rutas)
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const prisma = new PrismaClient();

app.post("/formulario/add", async (req, res) => {
  try {
    // Se espera que el cuerpo incluya: pacienteId, medicoId, tipo y respuestas
    const { pacienteId, medicoId, tipo, respuestas } = req.body;
    if (!pacienteId || !medicoId || !tipo || !respuestas) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const nuevoFormulario = await prisma.formulario.create({
      data: {
        pacienteId,
        medicoId,
        tipo,
        respuestas, // Contendrá las respuestas completas del formulario
      },
    });

    return res.status(201).json({ formularioId: nuevoFormulario.id });
  } catch (error) {
    console.error("Error al crear formulario:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});
