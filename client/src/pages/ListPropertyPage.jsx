import { useState, useEffect } from 'react';
import { Upload, MapPin, IndianRupee, Home, Bed, Bath, Maximize, Plus, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createProperty, updateProperty } from "../api/propertyApi";

const availableAmenities = ['WiFi', 'AC', 'Kitchen', 'Laundry', 'Parking', 'Gym', 'Water Supply', 'Furnished', 'Electricity', 'CCTV', 'Lift'];
const propertyTypes = ['single occupancy', 'Double sharing', 'Triple sharing', 'Apartment', '1 RK', '1 BHK', '2 BHK', '3BHK', '4BHK', 'Shop', 'Office space'];


export default function ListPropertyPage({ setCurrentPage, pageData }) {
  const { user, addListing } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: '1 BHK',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    amenities: [],
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

useEffect(() => {
  const stored = sessionStorage.getItem("editProperty");

  if (stored) {
    const pageData = JSON.parse(stored);
    setEditId(pageData.id);
    setForm({
      title: pageData.title || '',
      description: pageData.description || '',
      price: pageData.rent || '',
      location: pageData.location || '',
      type: pageData.property_type || '1 BHK',
      bedrooms: pageData.bedrooms || '1',
      bathrooms: pageData.bathrooms || '1',
      area: pageData.area || '',
      amenities: [
        pageData.wifi && 'WiFi',
        pageData.ac && 'AC',
        pageData.kitchen && 'Kitchen',
        pageData.laundry && 'Laundry',
        pageData.parking && 'Parking',
        pageData.gym && 'Gym',
        pageData.water && 'Water Supply',
        pageData.furnished && 'Furnished',
        pageData.electricity && 'Electricity',
        pageData.cctv && 'CCTV',
        pageData.lift && 'Lift',
      ].filter(Boolean),
      images: []
    });
  } else {
    setEditId(null);
  }
}, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-7 h-7 text-warm-400" />
          </div>
          <h2 className="font-serif text-2xl text-warm-900 mb-2">Sign in required</h2>
          <p className="text-warm-500 mb-6">You need to be signed in to list a property</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2.5 bg-warm-800 text-warm-50 rounded-xl text-sm font-medium hover:bg-warm-700 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className="px-6 py-2.5 border border-warm-200 text-warm-700 rounded-xl text-sm font-medium hover:border-warm-300 transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-sage-600" />
          </div>
          <h2 className="font-serif text-2xl text-warm-900 mb-2">Property listed!</h2>
          <p className="text-warm-500 mb-6">Your property has been successfully listed and is now visible to potential tenants.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                sessionStorage.removeItem("editProperty");
                setEditId(null);
                setSubmitted(false);
                setForm({
                  title: '',
                  description: '',
                  price: '',
                  location: '',
                  type: '1 BHK',
                  bedrooms: '1',
                  bathrooms: '1',
                  area: '',
                  amenities: [],
                  images: []
                });
              }}
              className="px-6 py-2.5 border border-warm-200 text-warm-700 rounded-xl text-sm font-medium hover:border-warm-300 transition-colors"
            >
              List another
            </button>
            <button
              onClick={() => setCurrentPage('explore')}
              className="px-6 py-2.5 bg-warm-800 text-warm-50 rounded-xl text-sm font-medium hover:bg-warm-700 transition-colors"
            >
              View listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.area || Number(form.area) <= 0) errs.area = 'Valid area is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("rent", Number(form.price));
      formData.append("location", form.location);
      formData.append("property_type", form.type);
      formData.append("bedrooms", Number(form.bedrooms));
      formData.append("bathrooms", Number(form.bathrooms));
      formData.append("area", Number(form.area));

      // amenities mapping
      formData.append("wifi", form.amenities.includes("WiFi"));
      formData.append("ac", form.amenities.includes("AC"));
      formData.append("kitchen", form.amenities.includes("Kitchen"));
      formData.append("laundry", form.amenities.includes("Laundry"));
      formData.append("parking", form.amenities.includes("Parking"));
      formData.append("gym", form.amenities.includes("Gym"));
      formData.append("water", form.amenities.includes("Water Supply"));
      formData.append("furnished", form.amenities.includes("Furnished"));
      formData.append("electricity", form.amenities.includes("Electricity"));
      formData.append("cctv", form.amenities.includes("CCTV"));
      formData.append("lift", form.amenities.includes("Lift"));

      // images
      form.images.forEach((img) => {
        formData.append("images", img);
      });

      // Debug log for editId
      console.log("EDIT ID:", editId);

      if (editId) {
        await updateProperty(editId, formData);  
        sessionStorage.removeItem("editProperty");
      } else {
        await createProperty(formData);    
      }

      setSubmitted(true);

    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-warm-900 mb-2">List your <span className="text-[#c74c3c]">room</span></h1>
          <p className="text-warm-500">Fill in the details to list your room for potential tenants</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-warm-100">
            <h2 className="font-semibold text-warm-900 mb-5">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Property Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="e.g. Cozy Studio in Downtown"
                  className={`w-full px-4 py-3 bg-warm-50 border rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all ${errors.title ? 'border-blush-400' : 'border-warm-200'}`}
                />
                {errors.title && <p className="text-xs text-blush-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="Describe your property, its features, and the neighborhood..."
                  rows={4}
                  className={`w-full px-4 py-3 bg-warm-50 border rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all resize-none ${errors.description ? 'border-blush-400' : 'border-warm-200'}`}
                />
                {errors.description && <p className="text-xs text-blush-600 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Monthly Rent (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => updateForm('price', e.target.value)}
                      placeholder="₹850"
                      className={`w-full pl-10 pr-4 py-3 bg-warm-50 border rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all ${errors.price ? 'border-blush-400' : 'border-warm-200'}`}
                    />
                  </div>
                  {errors.price && <p className="text-xs text-blush-600 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => updateForm('location', e.target.value)}
                      placeholder="Pune, Maharashtra"
                      className={`w-full pl-10 pr-4 py-3 bg-warm-50 border rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all ${errors.location ? 'border-blush-400' : 'border-warm-200'}`}
                    />
                  </div>
                  {errors.location && <p className="text-xs text-blush-600 mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-6 border border-warm-100">
            <h2 className="font-semibold text-warm-900 mb-5">Property Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateForm('type', type)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.type === type
                        ? 'bg-warm-800 text-warm-50'
                        : 'bg-warm-50 text-warm-600 border border-warm-200 hover:border-warm-300'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Bedrooms</label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                    <select
                      value={form.bedrooms}
                      onChange={(e) => updateForm('bedrooms', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-700 appearance-none focus:outline-none focus:ring-2 focus:ring-warm-300"
                    >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Bathrooms</label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                    <select
                      value={form.bathrooms}
                      onChange={(e) => updateForm('bathrooms', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-700 appearance-none focus:outline-none focus:ring-2 focus:ring-warm-300"
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Area (sqft)</label>
                  <div className="relative">
                    <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                    <input
                      type="number"
                      value={form.area}
                      onChange={(e) => updateForm('area', e.target.value)}
                      placeholder="450"
                      className={`w-full pl-10 pr-4 py-3 bg-warm-50 border rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all ${errors.area ? 'border-blush-400' : 'border-warm-200'}`}
                    />
                  </div>
                  {errors.area && <p className="text-xs text-blush-600 mt-1">{errors.area}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Image Selection */}
          <div className="bg-white rounded-2xl p-6 border border-warm-100">
            <h2 className="font-semibold text-warm-900">Property Photo</h2>
            <p className="text-sm text-warm-500 mb-4">Choose a photo for your listing</p>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex flex-col items-center justify-center w-40 h-24 border-2 border-dashed border-warm-300 rounded-xl cursor-pointer bg-warm-50 hover:bg-warm-100 transition">
                <Upload className="w-6 h-6 text-warm-400 mb-2" />
                <span className="text-xs text-warm-500">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
                  }}
                />
              </label>

              {form.images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {form.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-24 h-24 object-cover rounded-lg border border-warm-200"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-6 border border-warm-100">
            <h2 className="font-semibold text-warm-900 mb-5">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.amenities.includes(amenity)
                    ? 'bg-sage-100 text-sage-700 border border-sage-300'
                    : 'bg-warm-50 text-warm-500 border border-warm-200 hover:border-warm-300'
                    }`}
                >
                  {form.amenities.includes(amenity) ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("editProperty");
                setEditId(null);
                setCurrentPage('home');
              }}
              className="px-6 py-3 border border-warm-200 text-warm-700 rounded-xl text-sm font-medium hover:border-warm-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#c74c3c] text-warm-50 rounded-xl text-sm font-medium hover:bg-warm-700 transition-colors"
            >
              {editId ? "Update Property" : "List Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}