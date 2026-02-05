import { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button } from "@mui/material";

import Step1DatosPrograma from "./Step1DatosPrograma";
import Step2SeleccionRutinas from "./Step2SeleccionRutina";
import Step3Revisar from "./Step3Revision";

const steps = ["Datos del Programa", "Seleccionar Rutinas", "Revisar y Finalizar"];

export default function ProgramasForm({ programaId, onSuccess, form, niveles, tipos, loading, handleChange,
  handleSubmit, rutinasSeleccionadas, setRutinasSeleccionadas, dia, isStep1Valid, isStep2Valid}) {
  const [activeStep, setActiveStep] = useState(0);
  const isEditMode = Boolean(programaId);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (activeStep === steps.length - 1) {
      handleSubmit(e);
    } else {
      handleNext();
    }
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Step1DatosPrograma
          form={form} niveles={niveles} tipos={tipos} handleChange={handleChange} dia={dia}
        />
      )}

      {activeStep === 1 && (
        <Step2SeleccionRutinas
          rutinasSeleccionadas={rutinasSeleccionadas}
          setRutinasSeleccionadas={setRutinasSeleccionadas}
        />
      )}

      {activeStep === 2 && (
        <Step3Revisar
          form={form}
          rutinasSeleccionadas={rutinasSeleccionadas}
          dia={dia}
        />
      )}

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Atrás
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={
            (activeStep === 0 && !isStep1Valid()) ||
            (activeStep === 1 && !isStep2Valid()) ||
            loading
          }
        >
          {activeStep < steps.length - 1 ? "Siguiente" : isEditMode ? "Actualizar" : "Finalizar"}
        </Button>
      </Box>
    </Box>
  );
}