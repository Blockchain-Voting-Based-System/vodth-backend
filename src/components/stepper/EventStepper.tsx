import React, { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import CandidatesList from "../../components/candidatesList/CandidateList";

interface EventStepperProps {
  eventId: any;
  candidates: any;
}

const EventStepper: React.FC<EventStepperProps> = ({ eventId, candidates }) => {
  const stepperRef = useRef(null);

  return (
    <div className="card flex justify-content-center">
      <div style={{ width: "100%" }}>
        <Stepper ref={stepperRef}>
          <StepperPanel header="Event Detail"></StepperPanel>
          <StepperPanel header="Candidate">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto  align-items-center font-medium">
                <CandidatesList eventId={eventId} candidates={candidates} />
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="CSV">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto align-items-center font-medium">
                CSV
              </div>
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
};

export default EventStepper;
