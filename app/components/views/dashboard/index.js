'use client'

import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, FormControl, IconButton, Card } from "@mui/material";
import { TbHttpDelete } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import {v4 as uuidv4} from 'uuid';
import { db, storage } from "@/app/config/firebase";
import { addDoc, getDocs, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";


const DashBoard = () => {

  //state hook to have the body of the notes with its own id
  const [notes, setNotes] = useState(
    {
      id: '',
      title: '',
      body: ''
    }
  );

  //state hook that has the notes we have saved
  const [savedNote, setSavedNote] = useState([]);

  //geting our databse 
  const notesCollectionRef = collection(db, "notes")

  const saveNote = async () => {
    try{
      await addDoc(notesCollectionRef, {
        id: notes.id,
        title: notes.title,
        body: notes.body
      })
      const newNote = { ...notes, id: uuidv4() };
      setSavedNote([...savedNote, newNote]);
      setNotes({
        id: '', title: '', body: ''
      });
    }
    catch (error) {
      console.error(error)
    }
  }

  const getNotesList = async () => {
    try{
      const data = await getDocs(notesCollectionRef);
      const filteredData = data.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setSavedNote([...savedNote, newNote]);
    } catch (error) {
      console.error(error)
    }
  }

  const trashNote = async (id) => {

    try{
      await deleteDoc(notesCollectionRef)
      console.log(`deleted note with id ${id}`);
      const updatedNotes = savedNote.filter(note => note.id !== id)
      setSavedNote(updatedNotes)
    } catch (error) {
      console.error(error)
    }
 
  }

  useEffect(() => {
    getNotesList();
  }, [])

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