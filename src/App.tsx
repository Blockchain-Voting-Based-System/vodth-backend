import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import EventPage from "./pages/events/EventsPage.tsx";
import NewEventPage from "./pages/events/EventNewPage.tsx";
import EventDetailsPage from "./pages/events/EventEditPage.tsx";
import NewCandidate from "./pages/candidates/CandidateNewPage.tsx";
import CandidatesPage from "./pages/candidates/CandidatesPage.tsx";
import EditCandidatePage from "./pages/candidates/CandidatesEditPage.tsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventPage />} />
        <Route path="events/new" element={<NewEventPage />} />
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        <Route
          path="events/:eventId/candidates"
          element={<CandidatesPage></CandidatesPage>}
        ></Route>
        <Route
          path="events/:eventId/candidates/new"
          element={<NewCandidate />}
        />
        <Route
          path="events/:eventId/candidates/:candidateId/edit"
          element={<EditCandidatePage />}
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
  
}

export default App;
