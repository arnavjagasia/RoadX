import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const uploadString: string = "Drag Roadx files here or click to select"
function GetDropzoneUploader() {
  const onDrop = useCallback(acceptedFiles => {
    console.log("Accepted Files", acceptedFiles);
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