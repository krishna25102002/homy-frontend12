import { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import LoginModal from "../../modals/LoginModal";

const FancyBanner = ({ style }: any) => {
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(""); // State to store the email input
  const [message, setMessage] = useState<string>(""); // State to store the response message

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send the email to the backend
      const response = await axios.post("http://localhost:5000/api/emails", { email });
      console.log("Response from backend:", response.data);

      // Set the message based on the response
      setMessage(response.data.message);

      // Clear the input field after submission
      setEmail("");
    } catch (error) {
      console.error("Error storing email:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="fancy-banner-two position-relative z-1 pt-90 lg-pt-50 pb-90 lg-pb-50">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="title-one text-center text-lg-start md-mb-40 pe-xl-5">
                <h3 className="text-white m0">
                  Start your <span>Journey{style ? "" : <img src="/assets/images/shape/title_shape_06.svg" alt="" className="lazy-img" />}</span> As a Retailer.
                </h3>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-wrapper me-auto ms-auto me-lg-0">
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Email address"
                    className={style ? "rounded-0" : ""}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update the email state
                    required
                  />
                  <button type="submit" className={style ? "rounded-0" : ""}>
                    Get Started
                  </button>
                </form>
                {/* Display the message */}
                {message && (
                  <div className="fs-16 mt-10 text-white">
                    {message}
                  </div>
                )}
                <div className="fs-16 mt-10 text-white">
                  Already a Agent?{" "}
                  <a
                    onClick={() => setLoginModal(true)}
                    style={{ cursor: "pointer" }}
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                  >
                    Sign in.
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
    </>
  );
};

export default FancyBanner;