// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = process.env.PORT || 3001;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Endpoint para recibir la petición y redirigir según el tipo

app.get("/:tipo/:encryptedData", (req, res) => {
  try {
    const { tipo, encryptedData } = req.params;

    if (!encryptedData) {
      return res.status(400).json({ error: "encryptedData missing" });
    }

    const decodedData = decodeURIComponent(encryptedData);

    if (!process.env.SECRET_KEY) {
      return res.status(500).json({ error: "Secret key not defined" });
    }

    const bytes = CryptoJS.AES.decrypt(decodedData, process.env.SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      return res
        .status(400)
        .json({ error: "Decryption failed. Possibly malformed data." });
    }

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

//* Endpoint para agregar un formulario

app.post("/formulario/add", async (req, res) => {
  try {
    const { pacienteId, medicoId, tipo, respuestas } = req.body;
    if (!pacienteId || !medicoId || !tipo || !respuestas) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const nuevoFormulario = await prisma.formulario.create({
      data: {
        pacienteId,
        medicoId,
        tipo,
        respuestas,
      },
    });

    return res.status(201).json({ formularioId: nuevoFormulario.id });
  } catch (error) {
    console.error("Error al crear formulario:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

//* Endpoint para obtener un formulario por ID

app.get("/formulario/get/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "No hay id" });
    }

    const responses = await prisma.formulario.findFirst({
      where: { id: id },
    });
    console.log(responses, id);

    if (!responses) {
      return res.status(404).json({
        error: "No existe un formulario con esa ID",
      });
    }

    return res.json(responses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

//* Endpoint para obtener todos los formularios del paciente del mismo tipo

app.get("/formulario/get/:pacienteId/:tipo", async (req, res) => {
  try {
    const { pacienteId, tipo } = req.params;

    if (!pacienteId || !tipo) {
      return res
        .status(400)
        .json({ error: "La id del paciente y el tipo son necesarios" });
    }

    const allResponses = await prisma.formulario.findMany({
      where: { pacienteId: pacienteId, tipo: tipo },
    });

    if (!allResponses) {
      res
        .status(404)
        .json({
          error: "No se encontró ninguna coincidencia con los datos enviados",
        });
    }

    return allResponses;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server corriendo en http://localhost:${PORT}`);
});
