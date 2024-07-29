// import CsvUploader from "../../components/csv/CsvUploader";
import { useState, useEffect } from "react";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { eventStorage, firestore } from "../../firebase";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { NewCandidate } from "../../utils/newCandidate";
import { useRef } from "react";

const NewCandidatePage = () => {
  const [disabled, setDisabled] = useState(false);
  const { eventId } = useParams();
  useEffect(() => {
    getEvent(eventId);
  }, []);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [suiEventId, setSuiEventId] = useState();
  const [formState, setFormState] = useState({
    name: "",
    birthday: new Date(),
    bio: "",
    suiCandidateId: "",
    eventId: eventId,
    suiEventId: "",
    status: "",
    sex: "",
    imageUrl: "",
  });
  const [image, setImage] = useState<File>();

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const handleInputChange = (event: any) => {
    setFormState({
      ...formState,
      [event.target.id]: event.target.value,
    });
  };

  const handleSexChange = (event: any) => {
    setFormState({
      ...formState,
      sex: event.target.id,
    });
  };

  const handleStatusChange = (event: any) => {
    setFormState({
      ...formState,
      status: event.target.id,
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
      status: false,
      imageUrl: "",
    };
    if (image != null) {
      const imageName = image.name;
      const ImageRef = ref(eventStorage, `candidates/${imageName}`);
      await uploadBytes(ImageRef, image)
        .then(async () => {
          const imageUrl = await getDownloadURL(ImageRef);
          result.status = true;
          result.imageUrl = imageUrl;
        })
        .catch((e) => {
          console.log(e);
        });
    }
    return result;
  };

  const createCandidate = async (e: any) => {
    e.preventDefault();
    setDisabled(true);
    if (suiEventId == null) {
      alert("Please select an event");
      return;
    }
    const candidateCollections = collection(firestore, "candidates");
    const imageUpload = await uploadImage().catch(() => {
      alert("Error uploading image");
    });
    if (imageUpload?.status == true) {
      const suiCandidate = await NewCandidate(suiEventId).catch((e) => {
        alert("Error creating Candidate");
        console.log(e);
      });
      if (suiCandidate?.success == true) {
        const candidate = {
          ...formState,
          imageUrl: imageUpload.imageUrl,
          suiCandidateId: suiCandidate?.suiCandidateId,
          eventId: eventId,
          suiEventId: suiEventId,
        };
        await addDoc(candidateCollections, candidate)
          .then((candidate) => {
            alert("Candidate created successfully");
            window.location.href = `/events/${eventId}/candidates/${candidate.id}/edit`;
          })
          .catch(() => {
            alert("Error creating event");
          });
      }
    }
    setDisabled(false);
  };

  async function getEvent(param: any) {
    const docRef = doc(firestore, "events", param);
    const event = await getDoc(docRef);
    if (event.exists()) {
      setSuiEventId(event.data().suiEventId);
    }
  }

  return (
    <>
      <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form className="grid grid-cols-5 space-x-4">
              <div className="col-span-3">
                <div>
                  <div className="m-2">Name</div>
                  <input
                    required
                    className="w-full border rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Candidate Name"
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="p-2 mt-2">Biography</div>

                <textarea
                  required
                  className="w-full border rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Candidate Biography"
                  rows={8}
                  id="bio"
                  value={formState.bio}
                  onChange={handleInputChange}
                ></textarea>
                <div className="m-2"> Sex </div>
                <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="Male"
                      className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                      tabIndex={0}
                    >
                      <input
                        required
                        className="sr-only"
                        id="Male"
                        type="radio"
                        tabIndex={-1}
                        name="sex"
                        value={formState.sex}
                        onChange={handleSexChange}
                      />

                      <span className="text-sm"> Male </span>
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="Female"
                      className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                      tabIndex={0}
                    >
                      <input
                        required
                        className="sr-only"
                        id="Female"
                        type="radio"
                        tabIndex={1}
                        name="sex"
                        value={formState.sex}
                        onChange={handleSexChange}
                      />

                      <span className="text-sm"> Female </span>
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="Other"
                      className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                      tabIndex={0}
                    >
                      <input
                        required
                        className="sr-only"
                        id="Other"
                        type="radio"
                        tabIndex={1}
                        name="sex"
                        value={formState.sex}
                        onChange={handleSexChange}
                      />

                      <span className="text-sm"> Other </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-5 space-x-4">
                <div className="col-span-3">
                  <div className=" flex my-2 p-2 space-x-4">
                    <p>Candidate Picture</p>
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
                        className={`border-2 border-dashed border-gray-40 text-center bg-white rounded-lg cursor-pointer ${!imagePreviewUrl && "p-2"}`}
                      >
                        {imagePreviewUrl ? (
                          <img
                            className="w-full rounded-lg"
                            src={imagePreviewUrl}
                            alt="candidate profile picture"
                          />
                        ) : (
                          <div
                            onClick={() => {
                              fileInputRef.current?.click();
                            }}
                          >
                            <p className="text-lg mb-2">
                              <strong>Add & Drop</strong> or{" "}
                              <button
                                type="button"
                                onClick={() => {
                                  fileInputRef.current?.click();
                                }}
                                className="text-blue-500"
                              >
                                Browse
                              </button>
                            </p>
                            <p className="text-sm text-gray-600 p-3">
                              We currently support JPG, JPEG, PNG and make sure
                              your file size is not more than 500kb
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
                </div>
                <div className="col-span-2">
                  <div className="m-2 p-2">Status</div>
                  <div className="grid grid-cols-1 gap-4 text-center">
                    <div>
                      <label
                        htmlFor="Active"
                        className="block cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-green-200 has-[:checked]:bg-green-500 has-[:checked]:text-white"
                        tabIndex={0}
                      >
                        <input
                          required
                          className="sr-only"
                          id="Active"
                          type="radio"
                          tabIndex={-1}
                          name="status"
                          value={formState.status}
                          onChange={handleStatusChange}
                        />

                        <span className="text-sm"> Active </span>
                      </label>
                    </div>
                    <div>
                      <label
                        htmlFor="Suspended"
                        className="block w-full cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-yellow-200 has-[:checked]:bg-yellow-500 has-[:checked]:text-white"
                        tabIndex={0}
                      >
                        <input
                          required
                          className="sr-only"
                          id="Suspended"
                          type="radio"
                          tabIndex={1}
                          name="status"
                          value={formState.status}
                          onChange={handleStatusChange}
                        />

                        <span className="text-sm"> Suspended </span>
                      </label>
                    </div>
                    <div>
                      <label
                        htmlFor="Inactive"
                        className="block w-full cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-red-200 has-[:checked]:bg-red-500 has-[:checked]:text-white"
                        tabIndex={0}
                      >
                        <input
                          required
                          className="sr-only"
                          id="Inactive"
                          type="radio"
                          tabIndex={1}
                          name="status"
                          value={formState.status}
                          onChange={handleStatusChange}
                        />

                        <span className="text-sm"> Inactive </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-span-5">
                  <div className="mb-2 py-2">Birthday</div>
                  <input
                    required
                    className="w-full border rounded-lg border-gray-200 p-3 text-sm"
                    type="date"
                    id="birthday"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end col-span-5 space-x-4">
                <button
                  onClick={() => navigate(`/events/${eventId}/candidates`)}
                  type="button"
                  className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  disabled={disabled}
                  onClick={createCandidate}
                  type="submit"
                  className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewCandidatePage;
