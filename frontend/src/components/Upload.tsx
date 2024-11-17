import { ChangeEvent, useState } from 'react';
import { createFileService } from '../services/backend-service';

function Upload() {
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }

    // Check whether to create an upload button on click
    if (!document.getElementById("upload_click")) { // Only if no upload already exists
      let upload_section = document.getElementById("upload_div");
      if (upload_section) {
        let new_button = document.createElement("button");
        new_button.id = "upload_click";
        new_button.onclick = handleUploadClick;
        new_button.textContent = "Upload";
        upload_section.appendChild(new_button);
      }
    }
    
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }


    const { request, cancel } = createFileService().post({body:file})

    request
      .then((res => UpdateText(res.data)))
      
  };

  return (
    <div id="upload_div">
      <input type="file" onChange={handleFileChange} />
      <div>{file && `${file.name} - ${file.type}`}</div>
    </div>
  );
}

export default Upload;