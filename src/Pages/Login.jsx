import './Login.css'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";
import API from "../api/axios";

function Login() {

const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(loginStart());

  try {
    const { data } = await API.post("/auth/login", formData);
    dispatch(loginSuccess({ token: data.token, user: data.user }));

    try {
      await API.get("/vendors/profile");
      navigate("/dashboard");
    } catch {
      navigate("/profile-setup"); 
    }

  } catch (err) {
    dispatch(loginFailure(err.response?.data?.message || "Login failed"));
  }
};

  return (
   <div className="main-login">
      <div className="log-1">
        <div className="img-log">
          <img className="img-login" src="image-reg2.jfif" alt="login" />
        </div>
      </div>

      <div className="log-1">
        <h1>Login</h1>

      
        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <form className="reg-form" onSubmit={handleSubmit}>
          

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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "12px !important", fontSize: "14px" }}>
          Not registered?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  
  )
}

export default Login