import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeaderTwo from "../../../layouts/headers/dashboard/DashboardHeaderTwo";
import axios from "axios";
import API_BASE_URL from "../../../services/api";

const AccountSettingBody = () => {
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
   });

   const handleChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      try {
         const response = await axios.post(`${API_BASE_URL}/account-settings`, formData);
         console.log("Account settings saved:", response.data);
         alert("Account settings saved successfully!");
      } catch (error) {
         console.error("Error saving account settings:", error);
         alert("Failed to save account settings.");
      }
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Account Settings" />
            <h2 className="main-title d-block d-lg-none">Account Settings</h2>
            <div className="bg-white card-box border-20">
               <h4 className="dash-title-three">Edit & Update</h4>
               <form onSubmit={handleSubmit}>
                  <div className="row">
                     <div className="col-lg-6">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="firstName">First Name</label>
                           <input type="text" name="firstName" placeholder="Rashed" value={formData.firstName} onChange={handleChange} />
                        </div>
                     </div>
                     <div className="col-lg-6">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="lastName">Last Name</label>
                           <input type="text" name="lastName" placeholder="Kabir" value={formData.lastName} onChange={handleChange} />
                        </div>
                     </div>
                     <div className="col-12">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="email">Email</label>
                           <input type="email" name="email" placeholder="rshakbair365@gmail.com" value={formData.email} onChange={handleChange} />
                        </div>
                     </div>
                     <div className="col-12">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="phoneNumber">Phone Number</label>
                           <input type="tel" name="phoneNumber" placeholder="+810 321 889 021" value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                     </div>
                     <div className="col-12">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="password">Password</label>
                           <input type="password" name="password" value={formData.password} onChange={handleChange} />
                           <div className="info-text d-sm-flex align-items-center justify-content-between mt-5">
                              <p className="m0">Want to change the password?
                                 <Link to="/dashboard/account-settings/password-change">Click here</Link></p>
                              <Link to="/dashboard/account-settings/password-change" className="chng-pass">Change Password</Link>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="button-group d-inline-flex align-items-center mt-30">
                     <button type="submit" className="dash-btn-two tran3s me-3">Save</button>
                     <Link to="#" className="dash-cancel-btn tran3s">Cancel</Link>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default AccountSettingBody;