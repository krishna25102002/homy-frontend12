import React, { useState } from "react";
import Modal from "react-modal";
import { Property } from "./types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import "react-toastify/dist/ReactToastify.css";

interface EditPropertyModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  editingProperty: Property | null;
  onSave: (property: Property) => void;
  onDelete: (id: string) => void;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  onRequestClose,
  editingProperty,
  onSave,
  onDelete,
}) => {
  const [property, setProperty] = useState<Property | null>(editingProperty);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setProperty(editingProperty);
  }, [editingProperty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      onSave(property);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      if (property) {
        onDelete(property._id);
        onRequestClose();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const s3 = new S3Client({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY, //Accessing the secret key here
      },
    }); 

    const uploadedImageUrls: string[] = [];
    setLoading(true);

    for (const file of files) {
      const params = {
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: `properties/${Date.now()}-${file.name}`,
        Body: file,
        ContentType: file.type,
      };

      try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const url = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${
          import.meta.env.VITE_AWS_REGION
        }.amazonaws.com/${params.Key}`;
        uploadedImageUrls.push(url);
        console.log("Uploaded image URL:", url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
      }
    }

    setProperty((prevState) => ({
      ...prevState!,
      images: [...prevState!.images, ...uploadedImageUrls],
    }));

    setLoading(false);
  };

  if (!property) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          maxHeight: "95vh",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "30px",
          textAlign: "center",
          zIndex: 2001,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2000,
        },
      }}
    >
      <h6 style={{ color: '#6c757d', margin: 0, fontFamily: 'Times'}}>Edit Property</h6>
      <form onSubmit={handleSubmit} className="edit-property-form">
        
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={property.title}
            onChange={(e) =>
              setProperty({ ...property, title: e.target.value })
            }
          />
        </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                        value={property.description}
                        onChange={(e) =>
                          setProperty({ ...property, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
              <label>Category:</label>
              <select
                value={property.category}
                onChange={(e) =>
                  setProperty({ ...property, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                <option value="For Sale: House and apartments">For Sale: House and apartments</option>
                <option value="For Rent: houses and Apartments">For Rent: houses and Apartments</option>
                <option value="Lands & Plots">Lands & Plots</option>
                <option value="For Rent: Shops and Offices">For Rent: Shops and Offices</option>
                <option value="For Sale: Shops and Offices">For Sale: Shops and Offices</option>
                <option value="PG and Guest Houses">PG and Guest Houses</option>
              </select>
            </div>

        <div className="form-group">
          <label>Listed In:</label>
          <input
            type="text"
            value={property.listedIn}
            onChange={(e) =>
              setProperty({ ...property, listedIn: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={property.price}
            onChange={(e) =>
              setProperty({ ...property, price: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="form-group">
          <label>Size:</label>
          <input
            type="text"
            value={property.size}
            onChange={(e) => setProperty({ ...property, size: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Bedrooms:</label>
          <input
            type="number"
            value={property.bedrooms}
            onChange={(e) =>
              setProperty({ ...property, bedrooms: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="form-group">
          <label>Bathrooms:</label>
          <input
            type="number"
            value={property.bathrooms}
            onChange={(e) =>
              setProperty({ ...property, bathrooms: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="form-group">
          <label>Kitchens:</label>
          <input
            type="number"
            value={property.kitchens}
            onChange={(e) =>
              setProperty({ ...property, kitchens: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="form-group">
          <label>Year Built:</label>
          <input
            type="text"
            value={property.yearBuilt}
            onChange={(e) =>
              setProperty({ ...property, yearBuilt: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Floors:</label>
          <input
            type="number"
            value={property.floors}
            onChange={(e) =>
              setProperty({ ...property, floors: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="form-group">
          <label>Amenities:</label>
          <input
            type="text"
            value={property.amenities.join(", ")}
            onChange={(e) =>
              setProperty({
                ...property,
                amenities: e.target.value.split(", "),
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={property.address}
            onChange={(e) =>
              setProperty({ ...property, address: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Owner Contact Number:</label>
          <input
            type="text"
            value={property.ownerContactNumber}
            onChange={(e) =>
              setProperty({ ...property, ownerContactNumber: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
          {loading && <p>Uploading images, please wait...</p>}
          <div className="image-preview">
            {property.images.map((image, index) => (
              <div key={index} className="image-container">
                <img
                  src={image}
                  alt={`Uploaded Image ${index + 1}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="delete-image-button"
                  style={{ backgroundColor: "#fdf9f9", color: "white" }}
                  onClick={() => {
                    setProperty((prev) => ({
                      ...prev!,
                      images: prev!.images.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="save-button">
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="save-button"
          style={{ backgroundColor: "#e14c4c", color: "white" }}
        >
          Delete Property
        </button>
        <button
          type="button"
          onClick={onRequestClose}
          className="save-button"
          style={{ backgroundColor: "#c2b0b0", color: "white" }}
        >
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default EditPropertyModal;