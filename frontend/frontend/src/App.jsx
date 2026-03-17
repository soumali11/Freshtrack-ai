// Prarabdha Sachan

import { useState, useRef } from "react";
import { motion } from "framer-motion";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);

  // 📂 File select
  const handleFileChange = (file) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  // 🖱 Drag drop
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  };

  // 📷 Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraOn(true);
  };

  // 📸 Capture image
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      handleFileChange(file);
    });
  };

  // 📅 Expiry logic
  const isExpired = (dateStr) => {
    try {
      const [d, m, y] = dateStr.split("/");
      const expiry = new Date(`${y}-${m}-${d}`);
      return expiry < new Date();
    } catch {
      return false;
    }
  };

  // 🚀 Upload
  const handleUpload = async () => {
    if (!file) return alert("Select image first");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8001/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Backend error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>

      <motion.div style={styles.card} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        <h1>🚀 FreshTrack AI</h1>
        <p style={{ color: "#ccc" }}>Scan Expiry Instantly</p>

        {/* Drag Drop */}
        <div
          style={styles.drop}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          Drag & Drop Image
          <br />
          <input
            type="file"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </div>

        {/* Camera */}
        <button onClick={startCamera} style={styles.button}>
          Open Camera
        </button>

        {cameraOn && (
          <>
            <video ref={videoRef} autoPlay style={styles.video} />
            <button onClick={captureImage} style={styles.button}>
              Capture
            </button>
          </>
        )}

        {/* Preview */}
        {preview && <img src={preview} style={styles.image} />}

        {/* Upload */}
        <button onClick={handleUpload} style={styles.button}>
          {loading ? "Scanning..." : "Scan Product"}
        </button>

        {/* Loader */}
        {loading && (
          <motion.div
            style={styles.loader}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}

        {/* Result */}
        {result && (
          <motion.div
            style={{
              ...styles.result,
              background: isExpired(result.expiry_date)
                ? "#ff4d4d"
                : "#2ecc71",
            }}
          >
            <h2>
              {isExpired(result.expiry_date)
                ? "❌ EXPIRED"
                : "✅ SAFE"}
            </h2>

            <h3>{result.expiry_date}</h3>
            <p>{result.extracted_text}</p>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #141e30, #243b55)",
  },

  card: {
    padding: "30px",
    borderRadius: "20px",
    width: "350px",
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    color: "white",
  },

  drop: {
    border: "2px dashed white",
    padding: "15px",
    marginBottom: "10px",
  },

  button: {
    margin: "10px",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#0072ff",
    color: "white",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    margin: "10px 0",
  },

  video: {
    width: "100%",
    borderRadius: "10px",
  },

  loader: {
    width: "30px",
    height: "30px",
    border: "4px solid white",
    borderTop: "4px solid transparent",
    borderRadius: "50%",
    margin: "10px auto",
  },

  result: {
    padding: "10px",
    borderRadius: "10px",
    marginTop: "10px",
  },
};

export default App;