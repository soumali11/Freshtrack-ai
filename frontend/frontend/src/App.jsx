import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- COMPONENTS ---

const LandingPage = ({ onStart }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    style={styles.landingContainer}
  >
    <div style={styles.heroContent}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span style={styles.badge}>AI-Powered Precision</span>
        <h1 style={styles.heroTitle}>FreshTrack AI</h1>
        <p style={styles.heroSubtitle}>
          Stop guessing. Start tracking. Our AI instantly detects expiry dates 
          to keep your kitchen safe and reduce food waste.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 198, 255, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart} 
          style={styles.getStartedBtn}
        >
          Get Started — It's Free
        </motion.button>
      </motion.div>
    </div>
    {/* pointerEvents: "none" prevents this glow from blocking button clicks */}
    <div style={{...styles.glow, pointerEvents: "none"}} />
  </motion.div>
);

const ScannerApp = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    setResult(null);
    setFile(selectedFile);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(selectedFile));
    setCameraOn(false); 
  };

  const startCamera = async () => {
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraOn(true);
        setPreview(null);
      }
    } catch (err) {
      alert("Camera access denied.");
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
      handleFileChange(capturedFile);
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      setCameraOn(false);
    }, "image/jpeg");
  };

  // ✅ FIXED: Sending data to the real Backend URL
const handleUpload = async () => {
    if (!file) return alert("Please upload or capture an image first!");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Using 127.0.0.1 and a timestamp prevents most "Failed to Fetch" and caching errors
      const response = await fetch("http://127.0.0.1:8000/api/upload", {
  method: "POST",
  body: formData,
});
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.expiry_date) {
        setResult({ expiry_date: data.expiry_date });
      } else {
        alert("OCR Error: No date found in response.");
      }
    } catch (error) {
      console.error("Detailed Fetch Error:", error);
      alert("Connection Failed. Check if uvicorn is running and your main.py is saved.");
    } finally {
      setLoading(false);
    }
  };
  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    const [d, m, y] = dateStr.split("/");
    const expiryDate = new Date(`${y}-${m}-${d}`);
    const today = new Date();
    today.setHours(0,0,0,0);
    return expiryDate < today;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
      <h2 style={styles.cardTitle}>AI Scanner</h2>
      
      <div style={styles.buttonGroup}>
        <label style={styles.uploadLabel}>
          📁 Upload <input type="file" onChange={(e) => handleFileChange(e.target.files[0])} style={{ display: "none" }} />
        </label>
        <button onClick={startCamera} style={styles.secondaryButton}>📷 Camera</button>
      </div>

      <AnimatePresence>
        {cameraOn && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
            <video ref={videoRef} autoPlay playsInline style={styles.video} />
            <button onClick={captureImage} style={styles.captureButton}>📸 Capture</button>
          </motion.div>
        )}
      </AnimatePresence>

      {preview && !cameraOn && <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={preview} style={styles.image} alt="Preview" />}

      {(preview || cameraOn) && !loading && (
        <button onClick={handleUpload} style={styles.button}>
          🚀 {result ? "Re-Scan Image" : "Scan Product"}
        </button>
      )}

      {loading && (
        <div style={{ margin: "20px 0" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={styles.loader} />
          <p style={{ color: "#00c6ff", fontSize: "14px", marginTop: "10px" }}>Extracting text with AI...</p>
        </div>
      )}

      {result && !loading && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          style={{ ...styles.result, border: `2px solid ${isExpired(result.expiry_date) ? "#ff4d4d" : "#00ffcc"}` }}
        >
          <h3 style={{ color: isExpired(result.expiry_date) ? "#ff4d4d" : "#00ffcc", margin: "0 0 5px 0" }}>
            {isExpired(result.expiry_date) ? "❌ Expired" : "✅ Safe"}
          </h3>
          <p style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>{result.expiry_date}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div style={styles.bg}>
      <AnimatePresence mode="wait">
        {!showScanner ? (
          <LandingPage key="landing" onStart={() => setShowScanner(true)} />
        ) : (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={styles.appWrapper}
          >
             <button onClick={() => setShowScanner(false)} style={styles.backBtn}>← Back to Home</button>
             <ScannerApp />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  bg: { minHeight: "100vh", backgroundColor: "#0f172a", background: "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)", color: "white", fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  landingContainer: { textAlign: "center", maxWidth: "800px", padding: "20px", position: "relative" },
  heroContent: { zIndex: 10, position: "relative" }, 
  badge: { background: "rgba(0, 198, 255, 0.1)", color: "#00c6ff", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" },
  heroTitle: { fontSize: "clamp(48px, 8vw, 80px)", fontWeight: "800", margin: "20px 0" },
  heroSubtitle: { fontSize: "18px", color: "#94a3b8", marginBottom: "40px" },
  getStartedBtn: { padding: "18px 40px", fontSize: "18px", fontWeight: "600", borderRadius: "50px", border: "none", background: "linear-gradient(90deg, #00c6ff, #0072ff)", color: "white", cursor: "pointer", position: "relative", zIndex: 20 },
  glow: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "400px", background: "rgba(0, 114, 255, 0.15)", filter: "blur(100px)", borderRadius: "50%", zIndex: 1 },
  appWrapper: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "20px" },
  backBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", marginBottom: "20px" },
  card: { backdropFilter: "blur(20px)", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "30px", borderRadius: "32px", width: "100%", maxWidth: "400px", textAlign: "center" },
  cardTitle: { fontSize: "24px", marginBottom: "20px" },
  buttonGroup: { display: "flex", gap: "10px", marginBottom: "20px" },
  uploadLabel: { flex: 1, padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", cursor: "pointer" },
  secondaryButton: { flex: 1, padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", color: "white", border: "none", cursor: "pointer" },
  button: { width: "100%", padding: "16px", borderRadius: "16px", border: "none", background: "#0072ff", color: "white", fontWeight: "bold", cursor: "pointer" },
  video: { width: "100%", borderRadius: "16px", marginBottom: "10px" },
  captureButton: { width: "100%", padding: "10px", borderRadius: "10px", background: "#ef4444", color: "white", border: "none" },
  image: { width: "100%", borderRadius: "16px", marginBottom: "20px", maxHeight: "300px", objectFit: "cover" },
  result: { padding: "20px", borderRadius: "20px", background: "rgba(255,255,255,0.03)" },
  loader: { width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid #00c6ff", borderRadius: "50%", margin: "0 auto" }
};