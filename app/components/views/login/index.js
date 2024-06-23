'use client'

import { useRouter } from "next/navigation";
import { Box, TextField, FormControl, Button, Typography, Link } from "@mui/material";
import { useState } from "react";
import { auth } from "@/app/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {

  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSignin = async () => {
    try {
     await signInWithEmailAndPassword(auth, email, password);
     console.log('te logueaste con exito');
     router.push('/dashBoard');

    } catch (error){
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
          Please Sign In
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
        <Button variant="contained" onClick={handleSignin}>Sign In</Button>
        <Typography variant="body2">You do not have an account? <Link href="/signUp">Sign Up Now</Link> </Typography>
      </FormControl>
    </Box>
  );
}

export default Login;