import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

// Set the root element for accessibility (required by react-modal)
Modal.setAppElement('#root');

const ListingOneArea: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [locationListingFilter, setLocationListingFilter] = useState<string>(''); // New state for location listings
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: Infinity });
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [cities, setCities] = useState<string[]>([]); // State for unique cities

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
        console.log('API Response:', response.data); // Debugging log
        if (response.data && Array.isArray(response.data.properties)) {
          setProperties(response.data.properties);
          setFilteredProperties(response.data.properties);

          // Extract unique cities from properties
          const uniqueCities = Array.from(
            new Set(response.data.properties.map((property: any) => property.city))
          ) as string[];
          setCities(uniqueCities);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (err) {
        console.error('Error fetching data:', err); // Debugging log
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter properties based on category, location, and price range
  useEffect(() => {
    const filtered = properties.filter((property) => {
      if (!property || typeof property !== 'object') return false; // Validate property object

      const propertyCity = property.city?.toLowerCase().trim() || '';
      const selectedCity = locationFilter.toLowerCase().trim();

      const propertyLocationListing = property.locationListing?.toLowerCase().trim() || '';
      const selectedLocationListing = locationListingFilter.toLowerCase().trim();

      const propertyCategory = property.category?.toLowerCase().trim() || '';
      const selectedCategory = categoryFilter.toLowerCase().trim();

      const matchesLocation = locationFilter ? propertyCity === selectedCity : true;
      const matchesLocationListing = locationListingFilter
        ? propertyLocationListing === selectedLocationListing
        : true;
      const matchesCategory = categoryFilter ? propertyCategory === selectedCategory : true;
      const matchesPrice = property.price >= priceRange.min && property.price <= priceRange.max;

      return matchesCategory && matchesLocation && matchesLocationListing && matchesPrice;
    });

    setFilteredProperties(filtered);
  }, [categoryFilter, locationFilter, locationListingFilter, priceRange, properties]);

  // Open modal to display full property details
  const openModal = (property: any) => {
    setSelectedProperty(property);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Get location listings for the selected city
  const getLocationListings = (city: string) => {
    return locationListings[city as keyof typeof locationListings] || [];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
        <h1 style={{ margin: 0, color: '#fff', fontSize: '24px' }}>Property Listings</h1>
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
        {/* Category Filter */}
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
          <option value="Mens PG">Mens PG</option>
          <option value="Womens PG">Womens PG</option>
          <option value="Homes">Homes</option>
        </select>

        {/* City Filter */}
        <select
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setLocationListingFilter(''); // Reset location listing filter when city changes
          }}
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
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Location Listing Filter */}
        <select
          value={locationListingFilter}
          onChange={(e) => setLocationListingFilter(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: 'pointer',
            flex: '1',
          }}
          disabled={!locationFilter} // Disable if no city is selected
        >
          <option value="">All Locations</option>
          {locationFilter &&
            getLocationListings(locationFilter).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
        </select>

        {/* Price Range Filters */}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div
              key={property._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={() => openModal(property)}
            >
              {/* Property Image */}
              {property.images && property.images.length > 0 && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
              )}

              {/* Basic Property Details */}
              <h4 style={{ marginTop: '20px', color: '#333', fontSize: '18px' }}><b>{property.title}</b></h4>
              <p>
                <strong>Price:</strong> ₹{property.price}
              </p>
              <p>
                <strong>City:</strong> {property.city}
              </p>
              <p>
                <strong>Location:</strong> {property.locationListing}
              </p>
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
            <h3 style={{ color: '#6c757d', margin: 0 }}>No properties found in the given criteria.</h3>
          </div>
        )}
      </div>

      {/* Modal for Full Property Details */}
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
            width: '600px', // Rectangular shape
            maxHeight: '80vh', // Limit height and make it scrollable
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            overflowY: 'auto', // Make content scrollable
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {selectedProperty && (
          <>
            <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>{selectedProperty.title}</h2>
            {selectedProperty.images && selectedProperty.images.length > 0 && (
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '10px',
                  }}
                />
              </div>
            )}
            <p><strong>Description:</strong> {selectedProperty.description}</p>
            <p><strong>Category:</strong> {selectedProperty.category}</p>
            <p><strong>Price:</strong> ₹{selectedProperty.price}</p>
            <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
            <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
            <p><strong>City:</strong> {selectedProperty.city}</p>
            <p><strong>Location:</strong> {selectedProperty.locationListing}</p>
            <p><strong>Contact Number:</strong> {selectedProperty.ownerContactNumber}</p>
            <button
              onClick={closeModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1d201d',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ListingOneArea;