import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import './Register.css'

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "vendor", // default vendor
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
      await API.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-register">
      <div className="reg-1">
        <div className="img-log">
          <img className="img-register" src="image-reg.jfif" alt="register" />
        </div>
      </div>

      <div className="reg-1">
        <h1>Register</h1>

        {/* Error Message */}
        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form className="reg-form" onSubmit={handleSubmit}>
          <input
            className="input-reg"
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="input-reg"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="input-reg"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            className="btn-reg"
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "12px !important", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "blue" }}>
            Login karo
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;