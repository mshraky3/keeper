import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios"





function App() {

  const [note_list, set_list] = useState([])
 
  async function get_data() {
    try {
      const res = await axios.get("http://localhost:3000")
      console.log(res.data)
      set_list(res.data)
    }catch(err){
      console.error("err")
    }

  }

  async function postData(data) {
      const res = await axios.post("http://localhost:3000" , data ) ;
  }
  async function deleteData(data) {
    const res = await axios.post("http://localhost:3000/delete" , {data} ) ;
  }

  useEffect(() => {
    get_data()
  }, [])

  async function add_note(event) {
    event.preventDefault();
    const newNote = { title: event.target.title.value, content: event.target.content.value, id:( note_list.length + 1) } ;
    set_list([...note_list, newNote])
    postData(newNote);
    event.target.reset()
  }

  async function delete_note(event) {
    set_list(note_list.filter((index) => { return index.id !== event }))
    deleteData(event);
  }


  return (
    <div>
      <Header />
      <CreateArea add_note={add_note} />
      {note_list.map((item, index) => {
        return ( item.title.length >1 ? <Note key={index} id={item.id} title={item.title} content={item.content} delete_note={delete_note} /> : null )
      })}
      <Footer />
    </div>
  );
}

export default App;
