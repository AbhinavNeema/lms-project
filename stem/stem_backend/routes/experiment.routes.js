import express from "express";
import {
  getChemistryExperiments,
  getPhysicsExperiments,
  getExperimentById,
  getComputerExperiments,
  getMathsExperiments
} from "../controllers/experiment.controller.js";

const router = express.Router();

router.get("/chemistry/experiments", getChemistryExperiments);
router.get("/physics/experiments", getPhysicsExperiments);
router.get("/computer/experiments", getComputerExperiments);
router.get("/math/experiments", getMathsExperiments); 
router.get("/:subject/experiments/:id", getExperimentById);

export default router;
