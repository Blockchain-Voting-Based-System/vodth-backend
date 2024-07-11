import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/events/EventsPage.tsx";
import NewEventPage from "./pages/events/EventNewPage.tsx";
import EventDetailsPage from "./pages/events/EventEditPage.tsx";
import NewCandidate from "./pages/candidates/CandidateNewPage.tsx";
import CandidatesPage from "./pages/candidates/CandidatesPage.tsx";
import EditCandidatePage from "./pages/candidates/CandidatesEditPage.tsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import SignIn from "./auth/Login.tsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.tsx"; // Import the ProtectedRoute component

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<ProtectedRoute element={DefaultLayout} />}>
        <Route index element={<ProtectedRoute element={HomePage} />} />
        <Route path="events" element={<ProtectedRoute element={EventPage} />} />
        <Route
          path="events/new"
          element={<ProtectedRoute element={NewEventPage} />}
        />
        <Route
          path="events/:eventId"
          element={<ProtectedRoute element={EventDetailsPage} />}
        />
        <Route
          path="events/:eventId/candidates"
          element={<ProtectedRoute element={CandidatesPage} />}
        />
        <Route
          path="events/:eventId/candidates/new"
          element={<ProtectedRoute element={NewCandidate} />}
        />
        <Route
          path="events/:eventId/candidates/:candidateId/edit"
          element={<ProtectedRoute element={EditCandidatePage} />}
        />
      </Route>
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
