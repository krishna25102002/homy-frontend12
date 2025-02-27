import { useState } from "react";
import DashboardHeaderTwo from "../../../../layouts/headers/dashboard/DashboardHeaderTwo";
import axios from "axios";
import API_BASE_URL from "../../../../services/api";

const PasswordChangeBody = () => {
   const [formData, setFormData] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
   });

   const handleChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      if (formData.newPassword !== formData.confirmPassword) {
         alert("New passwords do not match.");
         return;
      }
      try {
         const response = await axios.post(`${API_BASE_URL}/password-change`, formData);
         console.log("Password changed:", response.data);
         alert("Password changed successfully!");
      } catch (error) {
         console.error("Error changing password:", error);
         alert("Failed to change password.");
      }
   };

   return (
      <div className="dashboard-body">
         <div className="position-relative">
            <DashboardHeaderTwo title="Change Password" />
            <div className="bg-white card-box border-20">
               <form onSubmit={handleSubmit}>
                  <div className="row">
                     <div className="col-12">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="oldPassword">Old Password*</label>
                           <input type="password" name="oldPassword" placeholder="Type current password" value={formData.oldPassword} onChange={handleChange} />
                        </div>
                     </div>
                     <div className="col-12">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="newPassword">New Password*</label>
                           <input type="password" name="newPassword" placeholder="Confirm your new password" value={formData.newPassword} onChange={handleChange} />
                        </div>
                     </div>
                     <div className="col-12">
                        <div className="dash-input-wrapper mb-20">
                           <label htmlFor="confirmPassword">Confirm Password*</label>
                           <input type="password" name="confirmPassword" placeholder="Confirm your new password" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                     </div>
                  </div>

                  <div className="button-group d-inline-flex align-items-center">
                     <button type="submit" className="dash-btn-two tran3s">Save & Updated</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default PasswordChangeBody;