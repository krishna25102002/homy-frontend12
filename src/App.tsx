import { HelmetProvider } from 'react-helmet-async';
import AppNavigation from './navigation/Navigation';
import { Provider } from "react-redux";
import store from "./redux/store";
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications


function App() {
  useEffect(() => {
    const checkLoginTime = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(loginTime, 10);
        const fourHours = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

        if (timeDifference > fourHours) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("loginTime");
          window.location.reload(); // Reload the page to reflect the changes
        }
      }
    };

    checkLoginTime();
  }, []);

  return (
    <Provider store={store}>
      <HelmetProvider>
        <div className="main-page-wrapper">
        <ToastContainer />
          <AppNavigation />
        </div>
      </HelmetProvider>
    </Provider>
  );
}

export default App;