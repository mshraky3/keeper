import React from "react";
import AddIcon from '@mui/icons-material/Add';
function CreateArea(props) {
  return (
    <div>
      <form onSubmit={()=>{props.add_note(event)}}>
        <input name="title" placeholder="Title" />
        <textarea name="content" placeholder="Take a note..." rows="3" />
        <button type="Submit"><AddIcon/></button>
      </form>
    </div>
  );
}

export default CreateArea;
