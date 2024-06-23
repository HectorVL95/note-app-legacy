'use client'

import { Box, TextField, FormControl, Button, Typography} from "@mui/material";
import { useState } from "react";
import { auth } from "@/app/config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    console.log("funcion activada");
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      console.log('Cuenta creada con exito');
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <Box component="div" className="flex flex-col flex justify-center gap-8">
      <Box component="div">
        <Typography variant="h1" className="text-center">
          Note App
        </Typography>
        <Typography variant="body2" className="text-center">
          Create Account
        </Typography>
      </Box>
      <FormControl className="flex flex-col gap-8">
        <TextField
          placeholder="Email..."
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />    
        <TextField
        placeholder="Password..."
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleSignUp}>Create Account</Button>

      </FormControl>
    </Box>
  );
}

export default SignUp;