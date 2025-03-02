import { useEffect, useState } from "react";
import { auth, signOut, db, doc, getDoc } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {userData ? (
        <>
          <img src={userData.photoURL} alt="Avatar" className="w-16 h-16 rounded-full" />
          <h1 className="text-2xl">Hola, {userData.name} 👋</h1>
          <p className="text-gray-600">{userData.email}</p>
        </>
      ) : (
        <p>Cargando datos...</p>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
