import logo from './logo.svg';
import './App.css';
import Home from './Home.js';
import './index.css';
import "tailwindcss/tailwind.css";
import NavBar from './NavBar.js';
import Footer from './Footer.js';
import AboutUs from "./AboutUs";
import ContactUs from './ContactUs.js';
import AdminHome from './AdminHome.jsx';
import OwnerHome from './OwnerHome.js';
import OwnerProfile from './OwnerProfile.js';
import AddProject from './AddProject.js';
import InvestorHome from './InvestorHome.js';
import AllUsersInfo from './AllUsersInfo.jsx';
import OwnersInfo from './OwnersInfo.jsx';
import InvestorsInfo from './InvestorsInfo.jsx';
/* import AdminSideBAr from './AdminSideBar.js';
 */import InvestorProfile from './InvestorProfile.js';
import SuccessStories from './SuccessStories.js';
import PendingUsers from './PendingUsers.jsx';
import PendingProjectsPredictions from './PendingProjectsPredictions.js';
import PendingProjectsInfo from './PendingProjectsInfo.js';
import PendingInvestments from './PendingInvstments.jsx';
import Categories from './Categories.js';
import ProjectDetails from './ProjectDetails';
import InvestmentForm from './InvestmentForm.js';
import OwnerNotifications from './OwnerNotifications';
import InvestorNotifications from './InvestorNotifications';
/* import AdminNotifications from './AdminNotifications';
 */import OwnerProjects from './OwnerProjects.js';
import InvestorProjects from './InvestorProjects.js';
import Payment from './Payment.jsx';
import SignatureModal from './SignatureModal.jsx';
import LogSystem from './LogSystem.js';
import ChatBox from './ChatBox';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the provider
import TableContent from './TableContent.jsx';
import StripeCard from './StripeCard.jsx';
import Auth from './Auth.jsx';

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Wrap with GoogleOAuthProvider */}
        <Router>
          <header className="App-header">
            <NavBar />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/ContactUs" element={<ContactUs />} />
              <Route path="/OwnerNotifications" element={<OwnerNotifications />} />
              <Route path="/AllUsersInfo" element={<AllUsersInfo />} />
              <Route path="/OwnersInfo" element={<OwnersInfo />} />
              <Route path="/InvestorsInfo" element={<InvestorsInfo />} />
              <Route path="/Categories" element={<Categories />} />
              <Route path="/InvestorNotifications" element={<InvestorNotifications />} />
              <Route path="/LogSystem" element={<LogSystem />} />
              <Route path="/ChatBox" element={<ChatBox />} />
              <Route path="/Payment" element={<Payment />} />

              <Route path="/SignatureModal" element={<SignatureModal />} />


              <Route path="/ProjectDetails" element={<ProjectDetails />} />
              <Route path="/InvestmentForm" element={<InvestmentForm />} />
              <Route path="/OwnerProjects" element={<OwnerProjects />} />
              <Route path="/InvestorProjects" element={<InvestorProjects />} />

              <Route path="/AdminHome" element={<AdminHome />} />
              <Route path="/OwnerHome" element={<OwnerHome />} />
              <Route path="/OwnerProfile" element={<OwnerProfile />} />
              <Route path="/InvestorProfile" element={<InvestorProfile />} />
              <Route path="/SuccessStories" element={<SuccessStories />} />
              <Route path="/PendingUsers" element={<PendingUsers />} />

              <Route path="/PendingProjectsPredictions" element={<PendingProjectsPredictions />} />
              <Route path="/PendingProjectsInfo" element={<PendingProjectsInfo />} />
              <Route path="/PendingInvestments" element={<PendingInvestments />} />
              <Route path="/InvestorHome" element={<InvestorHome />} />
              <Route path="/AddProject" element={<AddProject />} />

              <Route path="/Auth" element={<Auth />} />
              <Route path="/tablecontent" element={<TableContent />} />
              <Route path="/StripeCard" element={<StripeCard />} />

            </Routes>
            <Footer />
          </header>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
