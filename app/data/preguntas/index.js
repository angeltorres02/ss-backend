/**
 * Índice de todos los formularios de preguntas
 * Este archivo exporta las preguntas de cada formulario geriátrico
 */

const norton = require("./norton.json");
const gds15 = require("./gds15.json");
const cesd7 = require("./cesd7.json");
const braden = require("./braden.json");
const frail = require("./frail.json");
const barreras = require("./barreras.json");
const maltrato = require("./maltrato.json");
const mna = require("./mna.json");
const oars = require("./oars.json");
const sarc = require("./sarc.json");

const formularios = {
  norton,
  gds15,
  cesd7,
  braden,
  frail,
  barreras,
  maltrato,
  mna,
  oars,
  sarc,
};

module.exports = formularios;
