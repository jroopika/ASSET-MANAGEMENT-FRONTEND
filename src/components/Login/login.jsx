import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../../services/api";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const [flipped, setFlipped] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const allowedDomain = "kmit.in";

  useEffect(() => {
    // Clear localStorage and reset form states
    localStorage.clear();
    setEmail("");
    setPassword("");
    setSignupUsername("");
    setSignupEmail("");
    setSignupPassword("");
    setError("");
    setFlipped(false);

    // Reset body classes
    document.body.className = "";
    document.body.classList.add(styles["login-body"]);

    // Ensure URL is /login
    navigate("/login", { replace: true });

    // Add popstate listener to prevent back navigation
    const handlePopState = () => {
      navigate("/login", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    // Push multiple /login entries to block back navigation
    window.history.pushState(null, null, "/login");
    window.history.pushState(null, null, "/login");

    // Clean up on unmount
    return () => {
      document.body.classList.remove(styles["login-body"]);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Check for existing authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      switch (role) {
        case "admin":
          navigate("/dashboard", { replace: true });
          break;
        case "hod":
          navigate("/hod", { replace: true });
          break;
        case "user":
          navigate("/userDashboard", { replace: true });
          break;
        default:
          navigate("/userDashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleFlip = () => {
    setFlipped(!flipped);
    setError("");
    setEmail("");
    setPassword("");
    setSignupUsername("");
    setSignupEmail("");
    setSignupPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailDomain = email.split("@")[1];
    if (emailDomain !== allowedDomain) {
      setError("❌ Only college members can log in!");
      return;
    }

    try {
      const { token, role, user } = await loginUser(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      switch (role) {
        case "admin":
          navigate("/dashboard", { replace: true });
          break;
        case "hod":
          navigate("/hod", { replace: true });
          break;
        case "user":
          navigate("/userDashboard", { replace: true });
          break;
        default:
          navigate("/userDashboard", { replace: true });
      }
    } catch (err) {
      setError(`❌ ${err.response?.data?.message || "Login failed"}`);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const emailDomain = signupEmail.split("@")[1];
    if (emailDomain !== allowedDomain) {
      setError("❌ Only college members can sign up!");
      return;
    }

    try {
      const { token, role } = await signupUser(signupUsername, signupEmail, signupPassword);

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      switch (role) {
        case "admin":
          navigate("/dashboard", { replace: true });
          break;
        case "hod":
          navigate("/hod", { replace: true });
          break;
        case "user":
          navigate("/userDashboard", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(`❌ ${err.response?.data?.message || "Signup failed"}`);
    }
  };

  return (
    <div className={styles["login-wrapper"]}>
      <div className={styles["background"]}>
        <div className={styles["circle"]}></div>
        <div className={styles["circle"]}></div>
        <div className={styles["circle"]}></div>
      </div>

      <div className={`${styles["login-container"]} ${flipped ? styles["flip"] : ""}`}>
        <div className={styles["login-card"]}>
          <h2 className={styles["title"]}>Login</h2>
          {error && <p className={styles["error-message"]}>{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles["login-button"]} type="submit">
              Login
            </button>
          </form>
          <span className={styles["signup-link"]} onClick={handleFlip}>
            Don't have an account? Sign up here
          </span>
        </div>

        <div className={styles["signup-card"]}>
          <h2 className={styles["title"]}>Sign Up</h2>
          {error && <p className={styles["error-message"]}>{error}</p>}
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              required
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button className={styles["login-button"]} type="submit">
              Sign Up
            </button>
          </form>
          <span className={styles["signup-link"]} onClick={handleFlip}>
            Already have an account? Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;