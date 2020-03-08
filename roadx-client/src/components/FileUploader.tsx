import React, { useCallback } from 'react';
import { Button, Card, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useDropzone } from 'react-dropzone';

import '../styles/fileuploader.css';

interface IUploadFileProps {
  registerFile: (file: {[key: string]: string}) => void
}

const UploadFile = (p: IUploadFileProps): React.ReactElement => {
  const onDrop = useCallback(acceptedFiles => {
    // TODO handle only one file
    const file: {[key: string]: string} = acceptedFiles[0];
    p.registerFile(file);
    
  }, [p])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
          <div className="file_uploader__text">{uploadString}</div>
      }
    </div>
  )
}
interface IFileUploaderProps {
  registerFile: (file: {[key: string]: string}) => void;
  uploadFile: () => void;
  registeredFile?: {[key: string]: string};
}

const uploadString: string = "Drag RoadX files here or click here to select a file."

export default class FileUploader extends React.Component<IFileUploaderProps, {}> {
  renderFileInfo() {
    if (this.props.registeredFile) {
      return(
        <Card className='file_uploader__file_card'>
          <div className="file_uploader__file_card--image">
            <Icon icon={IconNames.DOCUMENT} iconSize={20} />
          </div>
          <div className="file_uploader__file_card--contents">
            <h4>{this.props.registeredFile['name']}</h4>
          </div>
        </Card>
      )
    } 
  }
  render() {
      return(
      <div className="file_uploader__container">
        <UploadFile registerFile={this.props.registerFile}/>
        {this.renderFileInfo()}
        <div className="file_uploader__upload_button"> 
          <Button 
            large={true}
            icon={IconNames.GRAPH}
            text={"Upload RoadX Data"}
            onClick={this.props.uploadFile}
          />
        </div>
      </div>
    )
  }
}