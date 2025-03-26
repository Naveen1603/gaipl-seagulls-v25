"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Card, CardContent, CardHeader, Button, Stack, Typography, Stepper, Step, StepLabel, CircularProgress, Alert } from "@mui/material";

interface Incident {
  inc_number: string;
  short_summary: string;
  created_date: string;
  status: string;
  app_name: string;
  priority: string;
  resolved_date?: string;
  recommended_solution?: string;
  comments?: string;
  rcasummary?: string;
  resolutiontype?: string;
}

const steps = ["Analyzed", "Recommended", "Approved", "Executed", "Validated", "Resolved"];

export function IncidentDetails(): React.JSX.Element {
  const { id: inc_number } = useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extract the incident number from the URL
  const in_number  = Array.isArray(inc_number) ? inc_number[0] : inc_number;
  console.log(in_number);

  useEffect(() => {
    if (!in_number) return;

    async function fetchIncident() {
      try {
        const response = await fetch(`http://localhost:8080/api/incidents/${in_number}`);
        if (!response.ok) throw new Error("Failed to fetch incident details");

        const data: Incident = await response.json();
        setIncident(data);

        // Determine active step based on status
        const statusIndex = steps.findIndex((step) => step.toLowerCase() === data.status.toLowerCase());
        setActiveStep(statusIndex !== -1 ? statusIndex : 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchIncident();
  }, [inc_number]);

  const handleApprove = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    setIncident((prev) => prev ? { ...prev, status: steps[activeStep + 1] } : null);
  };

  const handleApproveAndRun = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 2, steps.length - 1));
    setIncident((prev) => prev ? { ...prev, status: steps[activeStep + 2] } : null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Loading State */}
      {loading ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : incident ? (
        <>
          {/* Progress Tracker */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Incident Details */}
          <Card sx={{ mt: 3 }}>
            <CardHeader title="Incident Details" />
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{incident.short_summary}</Typography>
                <Typography variant="body1" color="text.secondary">{incident.rcasummary}</Typography>
                <Typography><strong>Incident Number:</strong> {incident.inc_number}</Typography>
                <Typography><strong>Status:</strong> {incident.status}</Typography>
                <Typography><strong>Application:</strong> {incident.app_name}</Typography>
                <Typography><strong>Priority:</strong> {incident.priority}</Typography>
                <Typography><strong>Created At:</strong> {incident.created_date}</Typography>
                {incident.resolved_date && <Typography><strong>Resolved At:</strong> {incident.resolved_date}</Typography>}
                {incident.recommended_solution && <Typography><strong>Recommended Solution:</strong> {incident.recommended_solution}</Typography>}
                {incident.comments && <Typography><strong>Comments:</strong> {incident.comments}</Typography>}
                {incident.resolutiontype && <Typography><strong>Resolution Type:</strong> {incident.resolutiontype}</Typography>}
              </Stack>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleApprove}>
              Approve
            </Button>
            <Button variant="contained" color="secondary" onClick={handleApproveAndRun}>
              Approve & Run
            </Button>
          </Stack>
        </>
      ) : (
        <Typography align="center" color="text.secondary">
          Incident not found.
        </Typography>
      )}
    </Box>
  );
}