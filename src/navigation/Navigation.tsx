import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ScrollToTop from '../components/common/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import Home from '../pages/Home';
import HomeTwo from '../pages/HomeTwo';
import HomeThree from '../pages/HomeThree';
import HomeFour from '../pages/HomeFour';
import HomeFive from '../pages/HomeFive';
import HomeSix from '../pages/HomeSix';
import HomeSeven from '../pages/HomeSeven';
import AboutUsOne from '../pages/AboutUsOne';
import AboutUsTwo from '../pages/AboutUsTwo';
import Agency from '../pages/Agency';
// import AgencyDetails from '../pages/AgencyDetails';
// import Agent from '../pages/Agent';
// import AgentDetails from '../pages/AgentDetails';
import ProjectOne from '../pages/ProjectOne';
import ProjectTwo from '../pages/ProjectTwo';
import ProjectThree from '../pages/ProjectThree';
import ProjectFour from '../pages/ProjectFour';
import ProjectDetails from '../pages/ProjectDetails';
import ServiceOne from '../pages/ServiceOne';
import ServiceTwo from '../pages/ServiceTwo';
import ServiceDetails from '../pages/ServiceDetails';
import ListingOne from '../pages/ListingOne';
import Compare from '../pages/Compare';
import PricingOne from '../pages/PricingOne';
import PricingTwo from '../pages/PricingTwo';
import Contact from '../pages/Contact';
import Faq from '../pages/Faq';
import NotFound from '../pages/NotFound';
import BlogOne from '../pages/BlogOne';
import BlogTwo from '../pages/BlogTwo';
import BlogThree from '../pages/BlogThree';
import BlogDetails from '../pages/BlogDetails';
import DynamicBlogDeatils from '../pages/DynamicBlogDeatils';
import DashboardIndex from '../pages/DashboardIndex';
// import DashboardMessage from '../pages/DashboardMessage';
import DashboardProfile from '../pages/DashboardProfile';
import DashboardAccountSettings from '../pages/DashboardAccountSettings';
// import DashboardMembership from '../pages/DashboardMembership';
import DashboardPropertiesList from '../pages/DashboardPropertiesList';
// import DashboardPasswordChange from '../pages/DashboardPasswordChange';
import DashboardAddProperty from '../pages/DashboardAddProperty';
// import DashboardFavourites from '../pages/DashboardFavourites';
// import DashboardSavedSearch from '../pages/DashboardSavedSearch';
// import DashboardReview from '../pages/DashboardReview';
import FilteredProperty from '../components/search-dropdown/home-dropdown/FilteredProperty';

const AppNavigation = () => {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/filtered-properties" element={<FilteredProperty/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/home-two" element={<HomeTwo />} />
        <Route path="/home-three" element={<HomeThree />} />
        <Route path="/home-four" element={<HomeFour />} />
        <Route path="/home-five" element={<HomeFive />} />
        <Route path="/home-six" element={<HomeSix />} />
        <Route path="/home-seven" element={<HomeSeven />} />
        <Route path="/about_us_01" element={<AboutUsOne />} />
        <Route path="/about_us_02" element={<AboutUsTwo />} />
        <Route path="/agency" element={<Agency />} />
        {/* <Route path="/agency_details" element={<AgencyDetails />} /> */}
        {/* <Route path="/agent" element={<Agent />} /> */}
        {/* <Route path="/agent_details" element={<AgentDetails />} /> */}
        <Route path="/project_01" element={<ProjectOne />} />
        <Route path="/project_02" element={<ProjectTwo />} />
        <Route path="/project_03" element={<ProjectThree />} />
        <Route path="/project_04" element={<ProjectFour />} />
        <Route path="/project_details_01" element={<ProjectDetails />} />
        <Route path="/service_01" element={<ServiceOne />} />
        <Route path="/service_02" element={<ServiceTwo />} />
        <Route path="/service_details" element={<ServiceDetails />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/pricing_01" element={<PricingOne />} />
        <Route path="/pricing_02" element={<PricingTwo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/listing_01" element={<ListingOne />} />
        <Route path="/blog_01" element={<BlogOne />} />
        <Route path="/blog_02" element={<BlogTwo />} />
        <Route path="/blog_03" element={<BlogThree />} />
        <Route path="/blog_details" element={<BlogDetails />} />
        <Route path="/blog_details/:id" element={<DynamicBlogDeatils />} />
        <Route path="/dashboard/dashboard-index" element={<DashboardIndex />} />
        {/* <Route path="/dashboard/message" element={<DashboardMessage />} /> */}
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/account-settings" element={<DashboardAccountSettings />} />
        {/* <Route path="/dashboard/account-settings/password-change" element={<DashboardPasswordChange />} /> */}
        {/* <Route path="/dashboard/membership" element={<DashboardMembership />} /> */}
        <Route path="/dashboard/properties-list" element={<DashboardPropertiesList />} />
        <Route path="/dashboard/add-property" element={<DashboardAddProperty />} />
        {/* <Route path="/dashboard/favourites" element={<DashboardFavourites />} /> */}
        {/* <Route path="/dashboard/saved-search" element={<DashboardSavedSearch />} /> */}
        {/* <Route path="/dashboard/review" element={<DashboardReview />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppNavigation;
