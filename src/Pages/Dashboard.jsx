import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Dashboard.css";
import { CopyIcon } from "@animateicons/react/lucide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [vendorId, setVendorId] = useState("");
  const [copied, setCopied] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: "", category: "", phone: "", location: "", profileImage: ""
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

const loadStats = async () => {
  try {
    const { data } = await API.get("/inquiries/dashboard-stats"); // ✅ vendors → inquiries
    if (data.success) setStats(data.stats);
  } catch (err) {
    console.error("Stats error:", err);
  }
};
  const loadInquiries = async () => {
    const { data } = await API.get("/inquiries/vendor");
    if (data.success) setInquiries(data.inquiries);
    setLoading(false);
  };

  const loadVendorProfile = async () => {
    try {
      const { data } = await API.get("/vendors/profile");
      if (data.success) {
        setVendorId(data.vendor._id);
        setProfileData({
          businessName: data.vendor.businessName || "",
          category: data.vendor.category || "",
          phone: data.vendor.phone || "",
          location: data.vendor.location || "",
          profileImage: data.vendor.profileImage || "",
        });
      }
    } catch (err) {
      console.error("Profile load nahi hua", err);
    }
  };

  const updateStatus = async (id, status) => {
    await API.put(`/inquiries/${id}/status`, { status });
    loadStats();
    loadInquiries();
  };

  const copyLink = () => {
    const link = `${window.location.origin}/inquiry/${vendorId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const link = `${window.location.origin}/inquiry/${vendorId}`;
    const msg = `Mujhe inquiry bhejo is link se: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg("");

    try {
      let imageUrl = profileData.profileImage;

      if (imageFile) {
        setImageUploading(true);
        const formData = new FormData();
        formData.append("profileImage", imageFile);
        const uploadRes = await API.post("/vendors/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (uploadRes.data.success) imageUrl = uploadRes.data.imageUrl;
        setImageUploading(false);
      }

      const { data } = await API.put("/vendors/profile", {
        ...profileData,
        profileImage: imageUrl,
      });

      if (data.success) {
        setProfileMsg("✅ Profile update ho gayi!");
        setImageFile(null);
        setImagePreview("");
        loadVendorProfile();
      }
    } catch (err) {
      setProfileMsg("❌ Update nahi hua, dobara try karo.");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => { loadStats(); loadInquiries(); loadVendorProfile(); }, []);

  return (
    <div className="dashboard">

      <div className="dash-navbar">
        <h1 className="dash-title">Dashboard</h1>
        <button className="btn-profile" onClick={() => setShowProfile(true)}>
          {profileData.profileImage
            ? <img src={profileData.profileImage} alt="pfp" className="nav-pfp" />
            : "👤"
          } My Profile
        </button>
      </div>

      {vendorId && (
        <div className="share-card">
          <div className="share-info">
            <span className="share-label">SHARE YOUR INQUIRY LINK TO CLIENTS</span>
          </div>
          <div className="share-btns">
            <button onClick={copyLink} className="btn-copy">
              {copied ? "Copied!" : <CopyIcon />}
            </button>
            <button onClick={shareOnWhatsApp} className="btn-whatsapp">
              <FontAwesomeIcon icon={faWhatsapp} />
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card"><span>Total</span><h2>{stats.total}</h2></div>
        <div className="stat-card pending"><span>Pending</span><h2>{stats.pending}</h2></div>
        <div className="stat-card accepted"><span>Accepted</span><h2>{stats.accepted}</h2></div>
        <div className="stat-card rejected"><span>Rejected</span><h2>{stats.rejected}</h2></div>
      </div>

      <div className="inq-card">
        <h3>Recent Inquiries</h3>
        {loading ? <p>Loading...</p> : inquiries.length === 0 ? <p>No inquiries found</p> : (
          <table>
            <thead><tr><th>Client</th><th>Event</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {inquiries.map(inq => (
                <tr key={inq._id}>
                  <td><b>{inq.clientName}</b><br /><small>{inq.clientEmail}</small></td>
                  <td>{inq.eventType}</td>
                  <td>{inq.eventDate ? new Date(inq.eventDate).toLocaleDateString("en-IN") : "—"}</td>
                  <td><span className={`badge ${inq.status.toLowerCase()}`}>{inq.status}</span></td>
                  <td className="btn-acc-rej">
                    {inq.status === "Pending" && (
                      <>
                        <button onClick={() => updateStatus(inq._id, "Accepted")} className="btn-accept">Accept</button>
                        <button onClick={() => updateStatus(inq._id, "Rejected")} className="btn-reject">Reject</button>
                      </>
                    )}
                    <button onClick={() => setSelectedInquiry(inq)} className="btn-view">view</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Inquiry Details</h2>
            <p><b>Name:</b> {selectedInquiry.clientName}</p>
            <p><b>Email:</b> {selectedInquiry.clientEmail}</p>
            <p><b>Event:</b> {selectedInquiry.eventType}</p>
            <p><b>Date:</b> {selectedInquiry.eventDate ? new Date(selectedInquiry.eventDate).toLocaleDateString("en-IN") : "—"}</p>
            <p><b>Budget:</b> ₹{selectedInquiry.budget}</p>
            <p><b>Message:</b> {selectedInquiry.message}</p>
            <p><b>Status:</b> {selectedInquiry.status}</p>
            <button onClick={() => setSelectedInquiry(null)} className="btn-close">Close</button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modals profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>My Profile</h2>

            {profileMsg && (
              <div className={`alert ${profileMsg.startsWith("✅") ? "alert-success" : "alert-error"}`}>
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="profile-form">

              <div className="form-group img-upload-group">
                <div className="img-upload-preview">
                  {(imagePreview || profileData.profileImage) ? (
                    <img src={imagePreview || profileData.profileImage} alt="Profile" className="img-preview" />
                  ) : (
                    <div className="img-placeholder">👤</div>
                  )}
                </div>
                <label className="img-upload-btn">
                  {imageUploading ? "Uploading..." : "📷 Change Photo"}
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              </div>

              <div className="form-group">
                <label>Business Name</label>
                <input type="text" value={profileData.businessName}
                  onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                  placeholder="Business ka naam" required />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={profileData.category}
                  onChange={(e) => setProfileData({ ...profileData, category: e.target.value })} required>
                  <option value="">Select karo</option>
                  <option value="Photography">Photography</option>
                  <option value="Catering">Catering</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Music">Music</option>
                  <option value="Venue">Venue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Phone number" required />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input type="text" value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="City / Area" required />
              </div>

              <div className="profile-form-btns">
                <button type="submit" className="btn-submit" disabled={profileLoading}>
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn-close" onClick={() => setShowProfile(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;