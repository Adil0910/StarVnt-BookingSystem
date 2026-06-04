import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function ProfileSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    phone: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await API.post("/vendors/profile", formData);
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.response?.data?.message || "Profile setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-register">
      <div className="reg-1">
        <div className="img-log">
          <img className="img-register" src="image-reg.jfif" alt="setup" />
        </div>
      </div>

      <div className="reg-1">
        <h1>Setup Profile</h1>

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form className="reg-form" onSubmit={handleSubmit}>
          <input
            className="input-reg"
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            required
          />

          {/* Category Dropdown */}
          <select
            className="input-reg"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Photography">Photography</option>
            <option value="Catering">Catering</option>
            <option value="Decoration">Decoration</option>
            <option value="Music">Music</option>
            <option value="Venue">Venue</option>
            <option value="Other">Other</option>
          </select>

          <input
            className="input-reg"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            className="input-reg"
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <input
            className="input-reg"
            type="text"
            name="description"
            placeholder="Business Description"
            value={formData.description}
            onChange={handleChange}
          />

          <button
            className="btn-reg"
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;