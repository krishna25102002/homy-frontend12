import { useEffect, useState } from "react";
import DashboardHeaderTwo from "../../../layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "../../../ui/NiceSelect";
import PropertyTableBody from "./PropertyTableBody";
import axios from "axios";
import { Property } from "./types";
import EditPropertyModal from "./EditPropertyModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PropertyListBody = () => {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/properties/user/${userId}`);
        setProperties(response.data.properties);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to fetch properties. Please try again later.");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const openEditModal = (property: Property) => {
    setEditingProperty(property);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEditingProperty(null);
  };

  const handleEditSubmit = async (updatedProperty: Property) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/properties/${updatedProperty._id}`,
        updatedProperty
      );

      if (response.data.success) {
        setProperties((prevProperties) =>
          prevProperties.map((property) =>
            property._id === updatedProperty._id ? updatedProperty : property
          )
        );
        closeEditModal();
        toast.success("Property Updated Successfully");
      } else {
        console.error("Failed to update property:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/properties/${id}`);

      if (response.data.success) {
        setProperties((prevProperties) => prevProperties.filter((property) => property._id !== id));
        toast.success("Property Deleted Successfully");
      } else {
        console.error("Failed to delete property:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="My Properties" />
        <h2 className="main-title d-block d-lg-none">My Properties</h2>
        <div className="d-sm-flex align-items-center justify-content-between mb-25">
          <div className="fs-16">
            Showing <span className="color-dark fw-500">1–{properties.length}</span> of{" "}
            <span className="color-dark fw-500">{properties.length}</span> results
          </div>
          <div className="d-flex ms-auto xs-mt-30">
            <div className="short-filter d-flex align-items-center ms-sm-auto">
              <div className="fs-16 me-2">Short by:</div>
              <NiceSelect
                className="nice-select"
                options={[
                  { value: "1", text: "Newest" },
                  { value: "2", text: "Best Seller" },
                  { value: "3", text: "Best Match" },
                  { value: "4", text: "Price Low" },
                  { value: "5", text: "Price High" },
                ]}
                defaultCurrent={0}
                onChange={() => {}}
                name=""
                placeholder=""
              />
            </div>
          </div>
        </div>

        <PropertyTableBody properties={properties} onEdit={openEditModal} />

        <EditPropertyModal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          editingProperty={editingProperty}
          onSave={handleEditSubmit}
          onDelete={handleDeleteProperty}
        />
      </div>
    </div>
  );
};

export default PropertyListBody;