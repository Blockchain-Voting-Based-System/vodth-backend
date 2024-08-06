import {
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CandidatesList from "../../components/candidatesList/CandidateList";
import CsvUploader from "../../components/csv/CsvUploader";
import { eventStorage, firestore } from "../../firebase";
import { EventFormType } from "../../utils/formType";
import { getCandidateObjects } from "../../utils/getSuiCandidate";
const EventDetailsPage = () => {
  const stepperRef = useRef(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { eventId } = useParams();
  const [image, setImage] = useState<File>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [candidates, setCandidates] = useState<DocumentData>([]);
  const [suiCandidates, setSuiCandidates] = useState<any>([]);
  const [formState, setFormState] = useState<EventFormType>({
    name: "",
    type: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    suiEventId: "",
    status,
  });

  async function getEvent(param: any) {
    const docRef = doc(firestore, "events", param);
    const event = await getDoc(docRef);
    if (event.exists()) {
      const eventForm: EventFormType = {
        name: event.data().name,
        type: event.data().type,
        description: event.data().description,
        startDate: event.data().startDate,
        endDate: event.data().endDate,
        suiEventId: event.data().suiEventId,
        status: event.data().status,
      };
      setImagePreviewUrl(event.data().imageUrl);
      setFormState(eventForm);
    }
  }

  async function getCandidates(eventId: any) {
    const candidates: any = [];
    const candidatesCollection = collection(firestore, "candidates");
    const q = query(candidatesCollection, where("eventId", "==", eventId));
    const suiCandidateId: Array<string> = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map(async (doc) => {
      candidates.push({ id: doc.id, ...doc.data() });
      suiCandidateId.push(doc.data().suiCandidateId);
    });
    await getCandidateObjects(suiCandidateId).then((result) => {
      setSuiCandidates(result);
      setCandidates(candidates);
    });
  }

  useEffect(() => {
    getEvent(eventId);
    getCandidates(eventId);
  }, []);

  const handleInputChange = (event: any) => {
    setFormState({
      ...formState,
      [event.target.id]: event.target.value,
    });
  };

  const handleRadioChange = (event: any) => {
    setFormState({
      ...formState,
      type: event.target.id,
    });
  };
  const handleImageChange = (event: any) => {
    let image = event.target.files[0];
    let imagePreviewUrl = URL.createObjectURL(image);

    setImage(image);

    setImagePreviewUrl(imagePreviewUrl);
  };

  const uploadImage = async () => {
    let result = {
      status: true,
      imageUrl: "",
    };
    if (image != null) {
      const imageName = image.name;
      const ImageRef = ref(eventStorage, `events/${imageName}`);
      await uploadBytes(ImageRef, image)
        .then(async () => {
          const imageUrl = await getDownloadURL(ImageRef);
          result.status = true;
          result.imageUrl = imageUrl;
        })
        .catch((e) => {
          result.status = false;
          console.log(e);
        });
    }
    if (image == null && imagePreviewUrl) {
      result.status = true;
      result.imageUrl = imagePreviewUrl;
    }
    return result;
  };

  const updateEvent = async (e: any) => {
    e.preventDefault();
    setDisabled(true);
    if (eventId) {
      const imageUpload = await uploadImage();
      if (imageUpload.status == true) {
        const startDateTime = new Date(formState.startDate);
        const now = new Date();
        const status =
          startDateTime > now
            ? (formState.status = "pending")
            : (formState.status = "active");

        const event = {
          ...formState,
          imageUrl: imageUpload.imageUrl,
          status: status,
          updatedAt: Timestamp.now(),
        };
        const docRef = doc(firestore, "events", eventId);
        await updateDoc(docRef, event)
          .then(() => {
            alert("Event updated successfully");
          })
          .catch(() => {
            alert("Event update failed");
          });
      }
    }
    setDisabled(false);
  };
  return (
    <section className="bg-gray-100">
      <div className="mx-auto py-6 px-1 sm:px-2 lg:px-4">
        <div className="rounded-lg bg-white shadow-lg">
          <div className="card flex justify-content-center p-8">
            <div style={{ width: "100%" }}>
              <Stepper ref={stepperRef}>
                <StepperPanel header="Event Detail">
                  <div className="flex flex-column h-12rem">
                    <div className="flex-auto  align-items-center font-medium">
                      <div className="text-2xl font-semibold my-4 ml-8 inline-block">
                        Event Detail
                      </div>
                      <form className="grid grid-cols-7 space-x-4 px-8 pt-4 pb-8">
                        <div className="col-span-4">
                          <div className="p-2 my-2">Event Name</div>
                          <label className="sr-only" htmlFor="name">
                            Name
                          </label>
                          <input
                            required
                            className="w-full border rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Name"
                            type="text"
                            id="name"
                            value={formState.name}
                            onChange={handleInputChange}
                          />

                          <div className="p-2 my-2">Event Description</div>
                          <label className="sr-only" htmlFor="description">
                            Description
                          </label>

                          <textarea
                            required
                            className="w-full border rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Description"
                            rows={8}
                            id="description"
                            value={formState.description}
                            onChange={handleInputChange}
                          ></textarea>

                          <div className="p-2 my-2">Event Duration</div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="sr-only" htmlFor="startDate">
                                Start Date
                              </label>
                              <input
                                required
                                className="w-full border rounded-lg border-gray-200 p-3 text-sm"
                                type="datetime-local"
                                id="startDate"
                                value={formState.startDate.toString()}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div>
                              <label className="sr-only" htmlFor="endDate">
                                End Date
                              </label>
                              <input
                                required
                                className="w-full border rounded-lg border-gray-200 p-3 text-sm"
                                type="datetime-local"
                                id="endDate"
                                value={formState.endDate.toString()}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className=" flex my-2 p-2 space-x-4">
                            <p>Poll Banner</p>
                            {imagePreviewUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  fileInputRef.current?.click();
                                }}
                                className="text-blue-500"
                              >
                                Change
                              </button>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center justify-center">
                              <div
                                className={`border-2 border-dashed border-gray-40 text-center bg-white rounded-lg max-w-md w-full cursor-pointer ${!imagePreviewUrl && "p-24"}`}
                                style={{ height: "292px" }}
                              >
                                {imagePreviewUrl ? (
                                  <img
                                    className="w-full rounded-lg"
                                    style={{
                                      maxHeight: "400px",
                                      height: "100%",
                                    }}
                                    src={imagePreviewUrl}
                                    alt=""
                                  />
                                ) : (
                                  <div>
                                    <p className="text-lg mb-2">
                                      <strong>Add & Drop</strong> or{" "}
                                      <span className="text-blue-500">
                                        Browse
                                      </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      We currently support JPG, JPEG, PNG and
                                      make sure your file size is not more than
                                      500kb
                                    </p>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  className="hidden"
                                  onChange={handleImageChange}
                                  accept=".jpg, .jpeg, .png"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="my-2 p-2">Poll Type</div>
                          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="private"
                                className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                                tabIndex={0}
                              >
                                <input
                                  required
                                  className="sr-only"
                                  id="private"
                                  type="radio"
                                  tabIndex={-1}
                                  name="type"
                                  checked={
                                    !!formState.type &&
                                    formState.type === "private"
                                  }
                                  value={formState.type}
                                  onChange={handleRadioChange}
                                />

                                <span className="text-sm"> Private </span>
                              </label>
                            </div>
                            <div>
                              <label
                                htmlFor="public"
                                className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                                tabIndex={0}
                              >
                                <input
                                  required
                                  className="sr-only"
                                  id="public"
                                  type="radio"
                                  tabIndex={1}
                                  name="type"
                                  value={formState.type}
                                  checked={
                                    !!formState.type &&
                                    formState.type === "public"
                                  }
                                  onChange={handleRadioChange}
                                />

                                <span className="text-sm"> Public </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-4 mt-10"></div>
                        <div className="col-span-3 mt-10 flex justify-end space-x-8">
                          <Link
                            to="/"
                            className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto"
                          >
                            Cancel
                          </Link>
                          <button
                            onClick={updateEvent}
                            type="submit"
                            disabled={disabled}
                            className="inline-block w-full rounded-lg bg-green-600 px-5 py-3 font-medium text-white sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Event
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </StepperPanel>
                <StepperPanel header="Candidate">
                  <div className="flex flex-column h-12rem">
                    <div className="flex-auto  align-items-center font-medium">
                      <CandidatesList
                        eventId={eventId}
                        candidates={candidates}
                        suiCandidates={suiCandidates}
                      />
                    </div>
                  </div>
                </StepperPanel>
                <StepperPanel header="CSV">
                  <div className="flex flex-column h-12rem">
                    <div className="p-12 flex-auto align-items-center font-medium">
                    <h1 className=" text-3xl mb-10">Upload the eligible voter email as a CSV file</h1>
                      <CsvUploader
                        eventName={formState.name}
                        eventRef={eventId}
                      />
                    </div>
                  </div>
                </StepperPanel>
              </Stepper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
