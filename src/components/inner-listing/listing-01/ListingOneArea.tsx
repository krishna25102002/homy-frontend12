import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ListingOneArea.css'; // Import the CSS file
import { useLocation } from 'react-router-dom';

// Set the root element for accessibility (required by react-modal)
Modal.setAppElement('#root');

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please check the console for details.</div>;
    }

    return this.props.children;
  }
}

// Image Carousel Component
const ImageCarousel: React.FC<{ images: string[]; onImageClick: (index: number) => void }> = ({
  images,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Automatic slideshow timer
  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(timer);
    }
  }, [images]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderRadius: '10px' }}>
      {/* Loading or Error State */}
      {(isLoading || error || images.length === 0) && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
          }}
        >
          {images.length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>Image is on the way...</div>
          ) : error ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>Failed to load image</div>
          ) : (
            <div style={{ color: '#666', fontStyle: 'italic' }}>Loading image...</div>
          )}
        </div>
      )}

      {/* Display Image */}
      {images.length > 0 && !error && (
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Property ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isLoading ? 'none' : 'block',
            cursor: 'pointer', // Add cursor pointer
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.error('Failed to load image:', images[currentIndex]);
            setIsLoading(false);
            setError(true);
          }}
          onClick={() => onImageClick(currentIndex)} // Open modal on click
        />
      )}

      {/* Image Indicator */}
      {images.length > 1 && !error && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '14px',
            zIndex: 1,
          }}
        >
          {`${currentIndex + 1}/${images.length}`}
        </div>
      )}
    </div>
  );
};

// Image Modal Component
const ImageModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}> = ({ isOpen, onRequestClose, images, currentIndex, onNext, onPrev }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '90%', // Responsive width
          maxWidth: '800px', // Max width for larger screens
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#fff',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          zIndex: 999,
        },
      }}
    >
      {/* Add a heading */}
      <h2 style={{ marginBottom: '20px', color: '#1d201d', fontSize: '24px' }}>Property Images</h2>

      <div style={{ position: 'relative', width: '100%', height: '60vh' }}> {/* Adjusted height for mobile */}
        {/* Display the current image */}
        <img
          src={images[currentIndex]}
          alt={`Property Image ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />

        {/* Navigation Buttons */}
        <button
          onClick={onPrev}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px',
            zIndex: 1,
          }}
        >
          &lt;
        </button>
        <button
          onClick={onNext}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px',
            zIndex: 1,
          }}
        >
          &gt;
        </button>

        {/* Close Button */}
        <button
          onClick={onRequestClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ×
        </button>

        {/* Image Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '14px',
          }}
        >
          {`${currentIndex + 1}/${images.length}`}
        </div>
      </div>
    </Modal>
  );
};

// New Component for Property Details Modal
const PropertyDetailsModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  property: any;
}> = ({ isOpen, onRequestClose, property }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '90%', // Responsive width
          maxWidth: '800px', // Max width for larger screens
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'left',
          backgroundColor: '#fff',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          overflow: 'hidden', // Ensure content doesn't overflow
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          zIndex: 999,
        },
      }}
    >
      <h2 style={{ marginBottom: '20px', color: '#1d201d', fontSize: '24px', fontWeight:'1000', paddingLeft: '270px' }}>Property Details</h2>
      <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '10px', fontStyle: 'italic' }}>
        {property && (
          <div>
            <p>
              <strong>Category:</strong> {property.category}
            </p>
            <p>
              <strong>Bedrooms:</strong> {property.bedrooms}
            </p>
            <p>
              <strong>Bathrooms:</strong> {property.bathrooms}
            </p>
            <p>
              <strong>Kitchens:</strong> {property.kitchens}
            </p>
            <p>
              <strong>Year Built:</strong> {property.yearBuilt}
            </p>
            <p>
              <strong>Floors:</strong> {property.floors}
            </p>
            <p>
              <strong>Builtup Area:</strong> {property.builtupArea}
            </p>
            <p>
              <strong>Carpet Area:</strong> {property.carpetArea}
            </p>
            <p>
              <strong>Maintenance Amount:</strong> {property.maintenanceAmount}
            </p>
            <p>
              <strong>Facing:</strong> {property.facing}
            </p>
            <p>
              <strong>Project Name:</strong> {property.projectName}
            </p>
            <p>
              <strong>Home Name:</strong> {property.homeName}
            </p>
            <p>
              <strong>Land Type:</strong> {property.landType}
            </p>
            <p>
              <strong>Shop Type:</strong> {property.shopType}
            </p>
            <p>
              <strong>Office Type:</strong> {property.officeType}
            </p>
            <p>
              <strong>Apartment Type:</strong> {property.apartmentType}
            </p>
          </div>
        )}
      </div>
      <button
        onClick={onRequestClose}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1d201d',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
          width: '100%', // Full width button
        }}
      >
        Close
      </button>
    </Modal>
  );
};

// Main Component
const ListingOneArea: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: Infinity });
  const [locations, setLocations] = useState<string[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [contactNumber, setContactNumber] = useState<string>('');
  const [propertyLocation, setPropertyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  const [imageModalIsOpen, setImageModalIsOpen] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const location = useLocation();
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState<boolean>(false);

  // Location listings for each city
  const locationListings = {
    Bangalore: [
      'MG Road (Mahatma Gandhi Road)',
      'Brigade Road',
      'Church Street',
      'Lavelle Road',
      'Residency Road',
      'Cubbon Park',
      'Vittal Mallya Road',
      'Shivajinagar',
      'Commercial Street',
      'Ulsoor',
      'Koramangala',
      'Jayanagar',
      'JP Nagar',
      'Banashankari',
      'Basavanagudi',
      'BTM Layout',
      'HSR Layout',
      'Bannerghatta Road',
      'Electronics City',
      'Sarjapur Road',
      'Yeshwanthpur',
      'Malleswaram',
      'Hebbal',
      'RT Nagar',
      'Seshadripuram',
      'Peenya',
      'Yelahanka',
      'Vidyaranyapura',
      'Jalahalli',
      'Dasarahalli',
      'Indiranagar',
      'Krishnarajapuram (KR Puram)',
      'Whitefield',
      'Marathahalli',
      'CV Raman Nagar',
      'Ramamurthy Nagar',
      'HAL Airport Road',
      'Domlur',
      'Old Airport Road',
      'Varthur',
      'Rajajinagar',
      'Vijayanagar',
      'Basaveshwaranagar',
      'Kengeri',
      'Nagarbhavi',
      'Mysore Road',
      'Magadi Road',
      'Nayandahalli',
      'Nelamangala',
      'Rajarajeshwari Nagar',
      'Electronic City',
      'Bellandur',
      'Sarjapur',
      'Hosur Road',
      'Kanakapura Road',
      'Tumkur Road',
      'Old Madras Road',
      'Devanahalli',
      'Doddaballapur',
      'Anekal',
    ],
    Chennai: [
      'T. Nagar',
      'Mylapore',
      'Nungambakkam',
      'Egmore',
      'Adyar',
      'Besant Nagar',
      'Thiruvanmiyur',
      'Ambattur',
      'Anna Nagar',
      'Tondiarpet',
    ],
    Coimbatore: [
      'Gandhipuram',
      'RS Puram',
      'Town Hall',
      'Peelamedu',
      'Singanallur',
      'Saravanampatti',
      'Thudiyalur',
    ],
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/properties');
        const response = await axios.get('http://13.233.100.222:5000/api/properties');
        if (response.data && Array.isArray(response.data.properties)) {
          setProperties(response.data.properties);
          setFilteredProperties(response.data.properties);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update locations based on selected city
  useEffect(() => {
    if (cityFilter && locationListings[cityFilter as keyof typeof locationListings]) {
      setLocations(locationListings[cityFilter as keyof typeof locationListings]);
    } else {
      setLocations([]);
    }
    setLocationFilter(''); // Reset location filter when city changes
  }, [cityFilter]);

  // Apply filters from DropdownOne
  useEffect(() => {
    if (location.state) {
      const { category, location: locationFromState} = location.state;
      setCategoryFilter(category || '');
      setCityFilter(locationFromState || '');
      // You might need to convert priceRange to min/max if needed
      // setPriceRange({ min: ..., max: ... });
    }
  }, [location.state]);

  // Filter properties based on category, city, location, and price range
  useEffect(() => {
    const filtered = properties.filter((property) => {
      if (!property || typeof property !== 'object') return false;

      const propertyCity = property.city?.toLowerCase().trim() || '';
      const selectedCity = cityFilter.toLowerCase().trim();

      const propertyLocation = property.locationListing?.toLowerCase().trim() || '';
      const selectedLocation = locationFilter.toLowerCase().trim();

      const matchesCity = cityFilter ? propertyCity === selectedCity : true;
      const matchesLocation = locationFilter ? propertyLocation === selectedLocation : true;
      const matchesCategory = categoryFilter ? property.category === categoryFilter : true;
      const matchesPrice = property.price >= priceRange.min && property.price <= priceRange.max;

      return matchesCategory && matchesCity && matchesLocation && matchesPrice;
    });

    setFilteredProperties(filtered);
  }, [categoryFilter, cityFilter, locationFilter, priceRange, properties]);

  // Open modal to display contact number and location
  const openModal = (contactNumber: string, location: { lat: number; lng: number }) => {
    setContactNumber(contactNumber);
    setPropertyLocation(location);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Generate Google Maps link
  const getGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  // Toggle expanded state for a property
  const toggleExpand = (propertyId: string) => {
    setExpandedPropertyId(expandedPropertyId === propertyId ? null : propertyId);
  };

  // Function to open the details modal
  const openDetailsModal = (property: any) => {
    setSelectedProperty(property);
    setDetailsModalIsOpen(true);
  };

  // Function to close the details modal
  const closeDetailsModal = () => {
    setSelectedProperty(null);
    setDetailsModalIsOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="listing-container">
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: '#1d201d',
            color: '#fbfbfb',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '20px',
            marginTop: '100px',
            borderRadius: '10px',
          }}
        >
          <h1 style={{ margin: 0, color: '#fff' }}>Property Listings</h1>
        </div>

        {/* Filter Options */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              cursor: 'pointer',
              flex: '1',
            }}
          >
            <option value="">All Categories</option>
            <option value="For Sale: House and apartments">For Sale: House and apartments</option>
            <option value="For Rent: houses and Apartments">For Rent: houses and Apartments</option>
            <option value="Lands & Plots">Lands & Plots</option>
            <option value="For Rent: Shops and Offices">For Rent: Shops and Offices</option>
            <option value="For Sale: Shops and Offices">For Sale: Shops and Offices</option>
            <option value="PG and Guest Houses">PG and Guest Houses </option>
          </select>
{/* For Sale: House and apartments
For Rent: houses and Apartments
Lands & Plots
For Rent: Shops and Offices
For Sale: Shops and Offices
PG and Guest Houses */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              cursor: 'pointer',
              flex: '1',
            }}
          >
            <option value="">All Cities</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              cursor: 'pointer',
              flex: '1',
            }}
            disabled={!cityFilter} // Disable if no city is selected
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              flex: '1',
            }}
          />
          <input
            type="number"
            placeholder="Max Price"
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || Infinity })}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              flex: '1',
            }}
          />
        </div>

        {/* Property Listings */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', // Responsive grid
            gap: '20px', // Space between cards
            padding: '20px', // Padding around the grid
          }}
        >
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property._id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '30px',
                  padding: '20px',
                  backgroundColor: 'rgb(233 233 233 / 65%)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
              >
                {/* Image Carousel */}
                {property.images && property.images.length > 0 ? (
                  <ImageCarousel
                    images={property.images}
                    onImageClick={(index) => {
                      setSelectedImages(property.images);
                      setSelectedImageIndex(index);
                      setImageModalIsOpen(true);
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ color: '#666', fontStyle: 'italic' }}>Image is on the way...</div>
                  </div>
                )}

                {/* Limited Details */}
                <h4 style={{ marginTop: '20px', color: '#333', textAlign: 'center', width: '5' }}><b>{property.title}</b></h4>
                <p style={{ color: '#666' }}>{property.description}</p>
                <p>
                  <strong>Price:</strong> {property.price}
                </p>
                <p>
                  <strong>City:</strong> {property.city}
                </p>
                <p>
                  <strong>Location:</strong> {property.locationListing}
                </p>

                {/* Show Contact Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card from collapsing
                    openModal(property.ownerContactNumber, property.location);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#1d201d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%',
                  }}
                >
                  Show Contact
                </button>
                {/* View Details Button */}
                <button
                  onClick={() => openDetailsModal(property)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#1d201d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%',
                  }}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                width: '100%',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                margin: '20px 0',
              }}
            >
              <h3 style={{ color: '#6c757d', margin: 0, fontFamily: 'Times' }}>No properties found in the given criteria.</h3>
            </div>
          )}
        </div>

        {/* Contact Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', // Responsive width
              maxWidth: '400px', // Max width for larger screens
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              backgroundColor: '#fff',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              maxHeight: '70vh', // Add scrollable option
              overflowY: 'auto', // Add scrollable option
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              zIndex: 999,
            },
          }}
   >    
          <h2 style={{ marginBottom: '20px', color: '#1d201d', fontSize: '24px' }}>Contact Information</h2>
          {/* <h6>Contact Number</h6> */}
          <p>{contactNumber}</p>
          {propertyLocation && (
            <a
              href={getGoogleMapsLink(propertyLocation.lat, propertyLocation.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-link"
            >
              View Location on Google Maps
            </a>
          )}
          <button
            onClick={closeModal}
            style={ {width: '100%'}}
            className="close-modal-btn"
          >
            Close
          </button>
        </Modal>

        {/* Image Modal */}
        <ImageModal
          isOpen={imageModalIsOpen}
          onRequestClose={() => setImageModalIsOpen(false)}
          images={selectedImages}
          currentIndex={selectedImageIndex}
          onNext={() =>
            setSelectedImageIndex((prevIndex) =>
              prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1
            )
          }
          onPrev={() =>
            setSelectedImageIndex((prevIndex) =>
              prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1
            )
          }
        />
        <PropertyDetailsModal
          isOpen={detailsModalIsOpen}
          onRequestClose={closeDetailsModal}
          property={selectedProperty}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ListingOneArea;
