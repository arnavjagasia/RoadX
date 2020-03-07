import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const uploadString: string = "Drag Roadx files here or click to select"
function GetDropzoneUploader() {
  const onDrop = useCallback(acceptedFiles => {
    // TODO handle only one file
    const file: {[key: string]: string} = acceptedFiles[0];
    const path: string = file['path'];
    console.log(" Uploaded File ", acceptedFiles);
    const requestData = {
      'imageFilePath': path,
      "deviceId": 123,
      "timestamp": 123,
    }

    fetch('http://localhost:5000/create', {
      method: 'post',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }).then(response => {
      console.log(response)
    })
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>{uploadString}</p>
      }
    </div>
  )
}

const Uploader: React.FC = () => {
  return(
    <GetDropzoneUploader />
  )
}

export default Uploader