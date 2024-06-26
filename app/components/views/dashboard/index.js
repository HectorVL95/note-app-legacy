'use client'

import { useEffect, useState } from "react";
import { Box, TextField, Button, FormControl, IconButton, Card } from "@mui/material";
import { TbHttpDelete } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { db, auth } from "@/app/config/firebase";
import { addDoc, getDocs, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const DashBoard = () => {
  const router = useRouter();
  const [notes, setNotes] = useState({ title: '', body: '' });
  const [savedNote, setSavedNote] = useState([]);
  const [user, setUser] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNote, setEditingNote] = useState({ title: '', body: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        getNotesList(user.uid);
      } else {
        setUser(null);
        setSavedNote([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const getNotesList = async (uid) => {
    try {
      const userNotesCollectionRef = collection(db, 'users', uid, 'notes');
      const notesSnapshot = await getDocs(userNotesCollectionRef);
      const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedNote(notesList);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  const saveNote = async () => {
    try {
      if (user) {
        const userNotesCollectionRef = collection(db, 'users', user.uid, 'notes');
        const docRef = await addDoc(userNotesCollectionRef, notes);
        const newNote = { id: docRef.id, ...notes };
        console.log('New note saved:', newNote);
        setSavedNote(prevNotes => [...prevNotes, newNote]);
        setNotes({ title: '', body: '' });
      } else {
        console.error('User not logged in');
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  const trashNote = async (id) => {
    console.log('trashNote called with id:', id);
    try {
      if (user) {
        const docRef = doc(db, 'users', user.uid, 'notes', id);
        await deleteDoc(docRef);
        console.log(`Deleted note with id ${id}`);
        setSavedNote(prevNotes => prevNotes.filter(note => note.id !== id));
      } else {
        console.error('User not logged in');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  const handleLogOut = () => {
    signOut(auth).then(() => {
      router.push('/');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  }

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditingNote({ title: note.title, body: note.body });
  }

  const saveEdit = async () => {
    try {
      if (user && editingNoteId) {
        const docRef = doc(db, 'users', user.uid, 'notes', editingNoteId);
        await updateDoc(docRef, editingNote);
        console.log(`Updated note with id ${editingNoteId}`);
        setSavedNote(prevNotes =>
          prevNotes.map(note =>
            note.id === editingNoteId ? { ...note, ...editingNote } : note
          )
        );
        setEditingNoteId(null);
        setEditingNote({ title: '', body: '' });
      } else {
        console.error('User not logged in or no note selected for editing');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  return (
    <Box component="div" className="flex flex-col">
      <Box component="div" className="flex justify-evenly">
        <FormControl>
          <Box>
            <Box>
              <IconButton onClick={saveNote}>
                <IoMdAdd />
              </IconButton>
              <IconButton onClick={() => setNotes({ title: '', body: '' })}>
                <TbHttpDelete />
              </IconButton>
            </Box>
            <Box className="flex flex-col">
              <TextField
                name="title"
                placeholder="Write the title"
                onChange={(e) => setNotes({ ...notes, title: e.target.value })}
                value={notes.title}
              />
              <TextField
                name="note"
                placeholder="Share your thoughts...."
                onChange={(e) => setNotes({ ...notes, body: e.target.value })}
                value={notes.body}
              />
            </Box>
          </Box>
        </FormControl>
        <Box>
          {savedNote.map(data =>
            <Card key={data.id}>
              <Box className="flex">
                {editingNoteId === data.id ? (
                  <IconButton onClick={saveEdit}>
                    <FaRegSave />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => startEditing(data)}>
                    <MdEdit />
                  </IconButton>
                )}
                <IconButton onClick={() => trashNote(data.id)}>
                  <FaTrashCan />
                </IconButton>
              </Box>
              {editingNoteId === data.id ? (
                <FormControl>
                  <Box className="flex flex-col">
                    <TextField
                      name="title"
                      placeholder="Write the title"
                      onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                      value={editingNote.title}
                    />
                    <TextField
                      name="note"
                      placeholder="Share your thoughts...."
                      onChange={(e) => setEditingNote({ ...editingNote, body: e.target.value })}
                      value={editingNote.body}
                    />
                  </Box>
                </FormControl>
              ) : (
                <>
                  <Box>
                    {data.title}
                  </Box>
                  <Box>
                    {data.body}
                  </Box>
                </>
              )}
            </Card>
          )}
        </Box>
      </Box>
      <Button onClick={handleLogOut}>
        Log out
      </Button>
    </Box>
  );
}

export default DashBoard;
