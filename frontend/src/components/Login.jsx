import { auth, provider, signInWithPopup, db, doc, setDoc } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Guardar usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      }, { merge: true });

      console.log("Usuario guardado en Firestore:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
};

export default Login;
