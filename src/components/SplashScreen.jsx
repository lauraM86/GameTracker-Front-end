import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import "../styles/Splash.css";

export default function SplashScreen() {
  return (
    <div className="splash-container">
      <motion.div
        className="splash-logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Gamepad2 size={60} className="splash-icon" />
        <h1 className="splash-title">GameTraker</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="splash-subtitle"
      >
        Cargando...
      </motion.p>
    </div>
  );
}
