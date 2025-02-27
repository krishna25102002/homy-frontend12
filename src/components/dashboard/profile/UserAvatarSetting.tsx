import NiceSelect from "../../../ui/NiceSelect";
import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../services/api";

interface UserAvatarSettingProps {
   onSave: () => void;
}

const UserAvatarSetting = ({ onSave }: UserAvatarSettingProps) => {
   const [formData, setFormData] = useState({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      phoneNumber: "",
      website: "",
      about: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
   });

   const [errorMessage, setErrorMessage] = useState("");
   const [cities, setCities] = useState<string[]>([]);

   const indianStates = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
      "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
      "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
   ];

   const indianCities = {
      "Karnataka": ["Bangalore", "Mysore", "Hubli"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
      // Add more states and cities as needed
   };

   const selectStateHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      setFormData({ ...formData, state: value });
      setCities(indianCities[value as keyof typeof indianCities] || []);
   };

   const selectCityHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      setFormData({ ...formData, city: value });
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async () => {
      onSave(); // Trigger the confirmation dialog

      // Validate mandatory fields
      if (!formData.username || !formData.firstName || !formData.lastName || !formData.phoneNumber) {
         setErrorMessage("Username, First Name, Last Name, and Phone Number are mandatory.");
         return; // Stop further execution if mandatory fields are missing
      }

      // Check if the phone number already exists
      // try {
      //    const checkResponse = await axios.get(`http://localhost:5000/api/profiles?phoneNumber=${formData.phoneNumber}`);
      //    if (checkResponse.data.length > 0) {
      //       setErrorMessage("Profile with this phone number already exists.");
      //       return; // Stop further execution if the phone number exists
      //    }
      // } catch (error) {
      //    console.error("Error checking profile data:", error);
      //    setErrorMessage("An error occurred while checking the profile data.");
      //    return;
      // }

      // If the phone number does not exist, proceed to save the data
      try {
         const response = await axios.post(`${API_BASE_URL}/profiles`, formData);
         console.log("Profile data saved:", response.data);
         setErrorMessage(""); // Clear any previous error message
      } catch (error) {
         console.error("Error saving profile data:", error);
         setErrorMessage("An error occurred while saving the profile data.");
      }
   };

   return (
      <div className="row">
         <div className="col-12">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="username">Username*</label>
               <input
                  type="text"
                  name="username"
                  placeholder="JonyRio"
                  value={formData.username}
                  onChange={handleChange}
                  required
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="firstName">First Name*</label>
               <input
                  type="text"
                  name="firstName"
                  placeholder="Mr Johny"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="lastName">Last Name*</label>
               <input
                  type="text"
                  name="lastName"
                  placeholder="Riolek"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="email">Email</label>
               <input
                  type="email"
                  name="email"
                  placeholder="companyinc@mail.com"
                  value={formData.email}
                  onChange={handleChange}
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="position">Position</label>
               <NiceSelect
                  className="nice-select"
                  options={[
                     { value: "Agent", text: "Agent" },
                     { value: "Agency", text: "Agency" },
                  ]}
                  defaultCurrent={0}
                  onChange={selectStateHandler}
                  name="position"
                  placeholder=""
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="phoneNumber">Phone Number*</label>
               <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+880 01723801729"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="website">Website</label>
               <input
                  type="text"
                  name="website"
                  placeholder="http://somename.com"
                  value={formData.website}
                  onChange={handleChange}
               />
            </div>
         </div>
         <div className="col-12">
            <div className="dash-input-wrapper">
               <label htmlFor="about">About</label>
               <textarea
                  className="size-lg"
                  name="about"
                  placeholder="I am working for the last 4 years as a web designer, graphics designer and well as UI/UX designer............."
                  value={formData.about}
                  onChange={handleChange}
               ></textarea>
               <div className="alert-text">Brief description for your profile. URLs are hyperlinked.</div>
            </div>
         </div>
         <div className="col-12">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="address">Address*</label>
               <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="state">State*</label>
               <NiceSelect
                  className="nice-select"
                  options={indianStates.map(state => ({ value: state, text: state }))}
                  defaultCurrent={0}
                  onChange={selectStateHandler}
                  name="state"
                  placeholder="Select State"
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="city">City*</label>
               <NiceSelect
                  className="nice-select"
                  options={cities.map(city => ({ value: city, text: city }))}
                  defaultCurrent={0}
                  onChange={selectCityHandler}
                  name="city"
                  placeholder="Select City"
               />
            </div>
         </div>
         <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="zipCode">Zip Code*</label>
               <input
                  type="text"
                  name="zipCode"
                  placeholder="Enter your zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
               />
            </div>
         </div>
         {errorMessage && (
            <div className="col-12">
               <div className="alert alert-danger" role="alert">
                  {errorMessage}
               </div>
            </div>
         )}
         <button onClick={handleSubmit} className="dash-btn-two tran3s me-3">
            Save
         </button>
      </div>
   );
};

export default UserAvatarSetting;