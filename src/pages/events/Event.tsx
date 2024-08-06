import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRef } from "react";
import CandidatesList from "../../components/candidatesList/CandidateList";
import EventNewPage from "./EventNewPage";
const Event = () => {
  const stepperRef = useRef(null);

  return (
    <div className="card flex justify-content-center ">
      <div style={{ width: "100%" }}>
        <Stepper ref={stepperRef}>
          <StepperPanel header="Event">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto  align-items-center font-medium">
                <EventNewPage />
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Candidate">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto  align-items-center font-medium">
                <CandidatesList
                  candidates={undefined}
                  eventId={undefined}
                  suiCandidates={undefined}
                />
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="CSV">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                CSV
              </div>
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
};

export default Event;
