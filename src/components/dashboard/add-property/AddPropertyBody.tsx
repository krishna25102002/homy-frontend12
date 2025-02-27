import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import './AddProperty.css';

declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

interface ImportMetaEnv {
    readonly VITE_AWS_REGION: string;
    readonly VITE_AWS_ACCESS_KEY_ID: string;
    readonly VITE_AWS_SECRET_ACCESS_KEY: string;
    readonly VITE_AWS_BUCKET_NAME: string;
}


interface PropertyFormData {
    title: string;
    description: string;
    category: string;
    listedIn: string;
    price: number | '';
    size: string;
    bedrooms: number | '';
    bathrooms: number | '';
    kitchens: number | '';
    yearBuilt: string;
    floors: number | '';
    address: string;
    location: { lat: number; lng: number };
    amenities: string[];
    images: string[];
    video: string;
    city: string;
    locationListing: string;
    ownerContactNumber: string;
    builtupArea: string;
    carpetArea: string;
    maintenanceAmount: number | '';
    totalFloors: number | '';
    carParking: { cars: number | ''; bikes: number | ''; cycles: number | '' };
    facing: string;
    projectName: string;
    homeName: string;
    landType: string;
    shopType: string;
    officeType: string;
    apartmentType: string;
}

const AddProperty: React.FC = () => {
    const [formData, setFormData] = useState<PropertyFormData>({
        title: '',
        description: '',
        category: '',
        listedIn: '',
        price: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        kitchens: '',
        yearBuilt: '',
        floors: '',
        address: '',
        location: { lat: 12.9716, lng: 77.5946 },
        amenities: [],
        images: [],
        video: '',
        city: '',
        locationListing: '',
        ownerContactNumber: '',
        builtupArea: '',
        carpetArea: '',
        maintenanceAmount: '',
        totalFloors: '',
        carParking: { cars: '', bikes: '', cycles: '' },
        facing: '',
        projectName: '',
        homeName: '',
        landType: '',
        shopType: '',
        officeType: '',
        apartmentType: '',
    });

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
// 
// For Sale: House and apartments
// For Rent: houses and Apartments
// Lands & Plots
// For Rent: Shops and Offices
// For Sale: Shops and Offices
// PG and Guest Houses

    const categories = ['For Sale: House and apartments', 'For Rent: houses and Apartments', 'Lands & Plots','For Rent: Shops and Offices', 'For Sale: Shops and Offices', 'PG and Guest Houses'];
    const listings = ['Rent', 'Sale'];
    const amenitiesList = ['Pool', 'Gym', 'Garage', 'Garden'];
    const cities = ['Bangalore', 'Chennai', 'Coimbatore'];
    const facings = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];
    const landTypes = ['Residential', 'Commercial', 'Agricultural'];
    const shopTypes = ['Retail', 'Wholesale', 'Showroom'];
    const apartmentTypes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Penthouse'];

    
    // Location listings for each city
    const locationListings = {
        Bangalore: {
            'Central Bangalore': [
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
            ],
            'South Bangalore': [
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
            ],
            'North Bangalore': [
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
            ],
            'East Bangalore': [
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
            ],
            'West Bangalore': [
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
            ],
            'Outer Areas and Suburbs': [
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
        },
        Chennai: {
            'Central Chennai': ['T. Nagar', 'Mylapore', 'Nungambakkam', 'Egmore'],
            'South Chennai': ['Adyar', 'Besant Nagar', 'Thiruvanmiyur'],
            'North Chennai': ['Ambattur', 'Anna Nagar', 'Tondiarpet'],
        },
        Coimbatore: {
            'Central Coimbatore': ['Gandhipuram', 'RS Puram', 'Town Hall'],
            'South Coimbatore': ['Peelamedu', 'Singanallur'],
            'North Coimbatore': ['Saravanampatti', 'Thudiyalur'],
        },
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCarParkingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            carParking: {
                ...formData.carParking,
                [name]: value,
            },
        });
    };

    const handleCheckboxChange = (amenity: string) => {
        setFormData((prevState) => ({
            ...prevState,
            amenities: prevState.amenities.includes(amenity)
                ? prevState.amenities.filter((item) => item !== amenity)
                : [...prevState.amenities, amenity],
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const region = import.meta.env.VITE_AWS_REGION;
        const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
        const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;

        if (!region || !accessKeyId || !bucketName) {
            throw new Error('AWS credentials are not properly set in the environment variables.');
        }

        const s3 = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY, //Accessing the secret key here
            },
        });

        const uploadedImageUrls: string[] = [];
        setLoading(true);

        for (const file of files) {
            const params = {
                Bucket: bucketName,
                Key: `properties/${Date.now()}-${file.name}`,
                Body: file,
                ContentType: file.type,
            };

            try {
                const command = new PutObjectCommand(params);
                await s3.send(command);
                const url = `https://${bucketName}.s3.${region}.amazonaws.com/${params.Key}`;
                uploadedImageUrls.push(url);
                console.log('Uploaded image URL:', url);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image.');
            }
        }

        setFormData((prevState) => ({
            ...prevState,
            images: [...prevState.images, ...uploadedImageUrls],
        }));

        setLoading(false);
    };

    // const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.files || e.target.files.length === 0) return;

    //     const file = e.target.files[0];
    //     const region = import.meta.env.VITE_AWS_REGION;
    //     const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
    //     const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
    //     const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;

    //     if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    //         throw new Error('AWS credentials are not properly set in the environment variables.');
    //     }

    //     const s3 = new S3Client({
    //         region,
    //         credentials: {
    //             accessKeyId,
    //             secretAccessKey,
    //         },
    //     });

    //     setLoading(true);

    //     const params = {
    //         Bucket: bucketName,
    //         Key: `properties/videos/${Date.now()}-${file.name}`,
    //         Body: file,
    //         ContentType: file.type,
    //     };

    //     try {
    //         const command = new PutObjectCommand(params);
    //         await s3.send(command);
    //         const url = `https://${bucketName}.s3.${region}.amazonaws.com/${params.Key}`;
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             video: url,
    //         }));
    //         console.log('Uploaded video URL:', url);
    //     } catch (error) {
    //         console.error('Error uploading video:', error);
    //         alert('Failed to upload video.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = { ...formData, userId: localStorage.getItem('userId') };

        try {
            const response = await axios.post('http://localhost:5000/api/properties', formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setIsModalOpen(true);
                console.log('Property added:', response.data);
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('Error submitting property:', error);
            alert('Failed to submit property.');
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    setFormData((prevState) => ({
                        ...prevState,
                        location: { lat: latitude, lng: longitude },
                    }));

                    if (map) {
                        map.setCenter({ lat: latitude, lng: longitude });
                        map.setZoom(15);

                        if (marker) {
                            marker.setMap(null);
                        }
                        const newMarker = new google.maps.Marker({
                            position: { lat: latitude, lng: longitude },
                            map: map,
                            title: 'Current Location',
                        });
                        setMarker(newMarker);
                    }
                },
                (error) => {
                    console.error('Error getting current location:', error);
                    alert('Failed to get current location.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        const initializeMap = () => {
            try {
                if (mapRef.current && !map && window.google && window.google.maps) {
                    const googleMap = new window.google.maps.Map(mapRef.current, {
                        center: { lat: 12.9716, lng: 77.5946 },
                        zoom: 17,
                    });

                    setMap(googleMap);

                    googleMap.addListener('click', (event: google.maps.MapMouseEvent) => {
                        if (event.latLng) {
                            const lat = event.latLng.lat();
                            const lng = event.latLng.lng();

                            setFormData((prevState) => ({
                                ...prevState,
                                location: { lat, lng },
                            }));

                            if (marker) {
                                marker.setMap(null);
                            }

                            const newMarker = new window.google.maps.Marker({
                                position: { lat, lng },
                                map: googleMap,
                                title: 'Selected Location',
                            });

                            setMarker(newMarker);

                            console.log('Selected Location:', { lat, lng });
                        }
                    });
                }
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        };

        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            // If not loaded, set a timeout to retry after a short delay
            const intervalId = setInterval(() => {
                if (window.google && window.google.maps) {
                    initializeMap();
                    clearInterval(intervalId);
                }
            }, 50); // Check every 100ms
        }

    }, [map, marker]);

    return (
        <>
            <form onSubmit={handleSubmit} className="add-property-form">
                <h1 className="form-title">Add Property</h1>

                {/* Form fields */}
                <div className="form-section">
                    <label>Title*</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Category*</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <label>Listed In</label>
                    <select name="listedIn" value={formData.listedIn} onChange={handleChange}>
                        <option value="">Select Listing Type</option>
                        {listings.map((list) => (
                            <option key={list} value={list}>
                                {list}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <label>Price*</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Size (m²)</label>
                    <input type="text" name="size" value={formData.size} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Bedrooms</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Builtup Area (sqft)</label>
                    <input type="text" name="builtupArea" value={formData.builtupArea} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Carpet Area (sqft)</label>
                    <input type="text" name="carpetArea" value={formData.carpetArea} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Maintenance Amount (Monthly)</label>
                    <input type="number" name="maintenanceAmount" value={formData.maintenanceAmount} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Total Floors</label>
                    <input type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Parking Details</label>
                    <div>
                        <label>Cars</label>
                        <input type="number" name="cars" value={formData.carParking.cars} onChange={handleCarParkingChange} />
                        <label>Bikes</label>
                        <input type="number" name="bikes" value={formData.carParking.bikes} onChange={handleCarParkingChange} />
                        <label>Cycles</label>
                        <input type="number" name="cycles" value={formData.carParking.cycles} onChange={handleCarParkingChange} />
                    </div>
                </div>

                <div className="form-section">
                    <label>Facing</label>
                    <select name="facing" value={formData.facing} onChange={handleChange}>
                        <option value="">Select Facing</option>
                        {facings.map((facing) => (
                            <option key={facing} value={facing}>
                                {facing}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <label>Project Name</label>
                    <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Home Name</label>
                    <input type="text" name="homeName" value={formData.homeName} onChange={handleChange} />
                </div>

                {formData.category === 'Lands and Plots' && (
                    <div className="form-section">
                        <label>Land Type</label>
                        <select name="landType" value={formData.landType} onChange={handleChange}>
                            <option value="">Select Land Type</option>
                            {landTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {formData.category === 'Shops and Offices' && (
                    <div className="form-section">
                        <label>Shop Type</label>
                        <select name="shopType" value={formData.shopType} onChange={handleChange}>
                            <option value="">Select Shop Type</option>
                            {shopTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {formData.category === 'Apartments' && (
                    <div className="form-section">
                        <label>Apartment Type</label>
                        <select name="apartmentType" value={formData.apartmentType} onChange={handleChange}>
                            <option value="">Select Apartment Type</option>
                            {apartmentTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-section">
                    <label>Bathrooms</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Kitchens</label>
                    <input type="number" name="kitchens" value={formData.kitchens} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Year Built</label>
                    <input type="text" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Floors</label>
                    <input type="number" name="floors" value={formData.floors} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Address*</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <label>Location*</label>
                    {/* <div ref={mapRef} style={{ width: '100%', height: '300px', marginTop: '10px' }}></div> */}
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        style={{ marginTop: '10px', padding: '10px', cursor: 'pointer' }}
                    >
                        Use Current Location
                    </button>
                    {currentLocation && (
                        <p style={{ marginTop: '10px' }}>
                            Current Location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                        </p>
                    )}
                </div>

                <div className="form-section">
                    <label>City*</label>
                    <select name="city" value={formData.city} onChange={handleChange}>
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <label>Location Listing*</label>
                    <select name="locationListing" value={formData.locationListing} onChange={handleChange}>
                        <option value="">Select Location</option>
                        {formData.city &&
                            Object.entries(locationListings[formData.city as keyof typeof locationListings]).map(
                                ([region, locations]) => (
                                    <optgroup label={region} key={region}>
                                        {locations.map((location) => (
                                            <option key={location} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </optgroup>
                                )
                            )}
                    </select>
                </div>

                <div className="form-section">
                    <label>Owner Contact Number*</label>
                    <input
                        type="text"
                        name="ownerContactNumber"
                        value={formData.ownerContactNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-section">
                    <label>Amenities</label>
                    <div className="checkbox-group">
                        {amenitiesList.map((amenity) => (
                            <label key={amenity}>
                                <input
                                    type="checkbox"
                                    checked={formData.amenities.includes(amenity)}
                                    onChange={() => handleCheckboxChange(amenity)}
                                />
                                {amenity}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <label>Images*</label>
                    <input type="file" multiple onChange={handleImageUpload} />
                    {loading && <p>Uploading images, please wait...</p>}
                    <div className="image-preview">
                        {formData.images.map((url, index) => (
                            <img key={index} src={url} alt="Property" className="image-thumbnail" />
                        ))}
                    </div>
                </div>

                {/* <div className="form-section">
                    <label>Video</label>
                    <input type="file" accept="video/*" onChange={handleVideoUpload} />
                    {loading && <p>Uploading video, please wait...</p>}
                    {formData.video && (
                        <video controls className="video-preview">
                            <source src={formData.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div> */}

                <button type="submit" className="submit-btn" disabled={loading}>
                    Submit
                </button>
            </form>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Congratulations!</h2>
                        <p>Your property is now on the feed.</p>
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddProperty;