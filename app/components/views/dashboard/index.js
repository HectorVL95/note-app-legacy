'use client'

import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, FormControl, IconButton, Card } from "@mui/material";
import { TbHttpDelete } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import {v4 as uuidv4} from 'uuid';
import { db, auth } from "@/app/config/firebase";
import { addDoc, getDocs, collection, doc, updateDoc, deleteDoc} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DashBoard = () => {

  //state hook to have the body of the notes with its own id
  const [notes, setNotes] = useState(
    {
      title: '',
      body: ''
    }
  );

  //state hook that has the notes we have saved
  const [savedNote, setSavedNote] = useState([]);

  const [user, setUser] = useState(null)

  //geting our databse 
  const notesCollectionRef = collection(db, "notes")

  const getNotesList = async (uid) => {
    try{
      const useNotesCollectionRef = collection(db, 'users', uid, 'notes');
      const notesSnapshot = await getDocs(useNotesCollectionRef);
      const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
      setSavedNote(notesList)
    } catch (error) {
      console.error(error)
    }

}

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
        getNotesList(user.uid);
      } else {
        setUser(null);
        setSavedNote([]);
      }
    })

    return () => unsubscribe();
  }, [])

  const saveNote = async () => {
    try{
      if (user) {
        const userNotesCollectionRef = collection(db, 'users', user.uid, 'notes');
        const docRef = addDoc(userNotesCollectionRef, notes);
        const newNote = {id: docRef.id, ...notes }
        setSavedNote([...savedNote, newNote]);
        setNotes({
          title: '', body: ''
        });
        }
      }
    catch (error) {
      console.error(error)
    }
  }


  const trashNote = async (id) => {
    try{
      if (user) {
        const docRef = doc(db, "users", user.uid, 'notes', id)
        await deleteDoc(docRef) 
        console.log(`deleted note with id ${id}`);
        const updatedNotes = savedNote.filter(note => note.id !== id)
        setSavedNote(updatedNotes)
      } else{
        console.error('User not logged in')
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box component="div" className="flex justify-evenly">
      <FormControl>
        <Box>
          <Box>
            <IconButton onClick={saveNote}>
              <IoMdAdd />
            </IconButton>
            <IconButton>
              <MdEdit />
            </IconButton>
            <IconButton onClick={() => setNotes({title: '', body: ''})}>
              <TbHttpDelete />
            </IconButton>
          </Box>
          <Box className="flex flex-col">
            <TextField 
              name="title"
              placeholder="Write the title"
              onChange={(e) => setNotes({...notes, title : e.target.value
              })}
              value={notes.title}
            />
            <TextField
              name="note"
              placeholder="Share your thoughts...."
              onChange={(e) => setNotes({
                ...notes, body : e.target.value
              })}
              value={notes.body}
            />
          </Box>
        </Box>
      </FormControl>
      <Box>
        {
          savedNote.map( data => 
            <Card key={data.id}>
              <Box className="flex ">
                <IconButton>
                  <MdEdit />
                </IconButton>
                <IconButton onClick={() => trashNote(data.id)}>
                  <FaTrashCan />
                </IconButton>
              </Box>
              <Box>
                {data.title}
              </Box>
              <Box>
                {data.body}
              </Box>
            </Card>
          )
        }
      </Box>
    </Box>
  );
}

export default DashBoard;