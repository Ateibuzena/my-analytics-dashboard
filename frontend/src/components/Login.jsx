import { auth, provider, signInWithPopup, db, doc, setDoc } from "../firebase";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper 
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Bienvenido a Analytics Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleLogin}
            sx={{ mt: 3, mb: 2 }}
            fullWidth
          >
            Iniciar sesión con Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
