import React, { useCallback } from 'react';
import { Button, Card, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useDropzone } from 'react-dropzone';

import '../styles/fileuploader.css';

interface IUploadFileProps {
  registerFile: (file: File) => void;
  uploadString: string;
}

const UploadFile = (p: IUploadFileProps): React.ReactElement => {
  const onDrop = useCallback(acceptedFiles => {
    const file: File = acceptedFiles[0];
    p.registerFile(file);
  }, [p])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
          <div className="file_uploader__text">{p.uploadString}</div>
      }
    </div>
  )
}

export interface IFileUploaderProps {
  registerFile: (file: File) => void;
  uploadFile: () => void;
  registeredFile?: {[key: string]: string};
  uploadString: string;
}

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
        <UploadFile 
          registerFile={this.props.registerFile} 
          uploadString={this.props.uploadString}
        />
        {this.renderFileInfo()}
        <div className="file_uploader__upload_button"> 
          <Button 
            large={true}
            disabled={!this.props.registeredFile}
            icon={IconNames.UPLOAD}
            text={"Upload RoadX Data"}
            onClick={this.props.uploadFile}
          />
        </div>
      </div>
    )
  }
}