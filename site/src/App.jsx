import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Education from './pages/Education.jsx';
import Course from './pages/Course.jsx';
import SvedenLayout from './pages/SvedenLayout.jsx';
import SvedenIndex from './pages/SvedenIndex.jsx';
import SvedenSection from './pages/SvedenSection.jsx';
import Contacts from './pages/Contacts.jsx';
import Legal from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="education" element={<Education />} />
        <Route path="education/:slug" element={<Course />} />
        <Route path="sveden" element={<SvedenLayout />}>
          <Route index element={<SvedenIndex />} />
          <Route path=":slug" element={<SvedenSection />} />
        </Route>
        <Route path="contacts" element={<Contacts />} />
        <Route path="privacy" element={<Legal page="privacy" />} />
        <Route path="consent" element={<Legal page="consent" />} />
        <Route path="cookies" element={<Legal page="cookies" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
