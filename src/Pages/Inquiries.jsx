import { useState } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Inquiries.css";

function Inquiries() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    eventType: "",
    eventDate: "",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await API.post("/inquiries", {
        ...formData,
        vendorId,
      });

      if (data.success) {
        setSuccess("Inquiry bhej di gayi! Vendor jald reply karega.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Kuch galat hua, dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inquiry-container">
      <div className="inquiry-card">
        <h1>Inquiry Bhejo</h1>
        <p className="inquiry-subtitle">Apni event details bharo, vendor jald reply karega</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="inquiry-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="clientName" placeholder="Full name"
                value={formData.clientName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="clientEmail" placeholder="email@example.com"
                value={formData.clientEmail} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                <option value="">Select karo</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Corporate">Corporate</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Event Date</label>
              <input type="date" name="eventDate"
                value={formData.eventDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Budget (₹)</label>
            <input type="number" name="budget" placeholder="Approximate budget"
              value={formData.budget} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea name="message" placeholder="Event ke baare mein batao..."
              value={formData.message} onChange={handleChange} rows={4} required />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Bhej raha hai..." : "Inquiry Bhejo"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Inquiries;