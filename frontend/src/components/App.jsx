import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

function App() {
  const localEndpoint = "http://localhost:3000/";
  const remoteEndpoint = "https://keeper-api-three.vercel.app/";

  const [note_list, set_list] = useState([]);

  async function fetchData(endpoint) {
    try {
      const res = await axios.get(endpoint);
      set_list(res.data);
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      throw err; // Re-throw the error to be caught by the caller
    }
  }

  async function postData(data, endpoint) {
    try {
      const res = await axios.post(endpoint, data);
      return res;
    } catch (err) {
      console.error(`Error posting data to ${endpoint}:`, err);
      throw err; // Re-throw the error to be caught by the caller
    }
  }

  async function deleteData(data, endpoint) {
    try {
      const res = await axios.post(`${endpoint}delete`, { data });
      console.log(res);
      return res;
    } catch (err) {
      console.error(`Error deleting data from ${endpoint}:`, err);
      throw err; // Re-throw the error to be caught by the caller
    }
  }

  async function get_data() {
    try {
      await fetchData(localEndpoint);
    } catch (err) {
      console.log("Falling back to remote endpoint");
      await fetchData(remoteEndpoint);
    }
  }

  async function add_note(event) {
    event.preventDefault();
    const newNote = { title: event.target.title.value, content: event.target.content.value, id: (note_list.length + 1) };
    set_list([...note_list, newNote]);
    try {
      await postData(newNote, localEndpoint);
    } catch (err) {
      console.log("Falling back to remote endpoint for posting data");
      await postData(newNote, remoteEndpoint);
    }
    event.target.reset();
  }

  async function delete_note(id) {
    set_list(note_list.filter((note) => note.id !== id));
    try {
      await deleteData({ id }, localEndpoint);
    } catch (err) {
      console.log("Falling back to remote endpoint for deleting data");
      await deleteData({ id }, remoteEndpoint);
    }
  }

  useEffect(() => {
    get_data();
  }, []);

  return (
    <div>
      <Header />
      <CreateArea add_note={add_note} />
      {note_list.map((item, index) => {
        return (item.title.length > 1 ? <Note key={index} id={item.id} title={item.title} content={item.content} delete_note={delete_note} /> : null)
      })}
      <Footer />
    </div>
  );
}

export default App;