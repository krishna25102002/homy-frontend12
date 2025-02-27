import React from 'react';
import './PropertyTableBody.css'; // Import the CSS file for styling
import { Property } from './types'; // Import the shared Property interface

interface PropertyTableBodyProps {
  properties: Property[];
  onEdit: (property: Property) => void; // Add onEdit prop
}

const PropertyTableBody: React.FC<PropertyTableBodyProps> = ({ properties, onEdit }) => {
  return (
    <div className="property-cards-container">
      {properties.map((property) => (
        <div key={property._id} className="property-card">
          {/* Property Image */}
          {property.images && property.images.length > 0 ? (
            <img src={property.images[0]} alt={property.title} className="property-image" />
          ) : (
            <div className="property-image-placeholder">Image is on the way...</div>
          )}

          {/* Property Details */}
          <div className="property-details">
            <h3 className="property-title">{property.title}</h3>
            <p className="property-category">Category: {property.category}</p>
            <p className="property-price">Price: ₹{property.price}</p>
            <div className="property-features">
              <p className="property-bedrooms">Bedrooms: {property.bedrooms || "N/A"}</p>
              <p className="property-bathrooms">Bathrooms: {property.bathrooms || "N/A"}</p>
            </div>
            {/* <p className="property-city">City: {property.city}</p> */}

            {/* Edit Button */}
            <button
              className="edit-button"
              onClick={() => onEdit(property)} // Trigger onEdit function
            >
              Edit 
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyTableBody;