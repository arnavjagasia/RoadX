import React, { useCallback } from 'react';
import { Button, Card, Icon, Toaster, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useDropzone } from 'react-dropzone';

import '../../styles/fileuploader.css';


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
  uploadString: string;
  permittedFileExtensions: Array<string>;
}

export interface IFileUploaderState {
  registeredFile: File | undefined;
}

const toaster = Toaster.create()

export default class FileUploader extends React.Component<IFileUploaderProps, IFileUploaderState> {
  state: IFileUploaderState = {
    registeredFile: undefined,
  }

  renderFileInfo = () => {
    if (this.state.registeredFile) {
      return(
        <Card className='file_uploader__file_card'>
          <div className="file_uploader__file_card--image">
            <Icon icon={IconNames.DOCUMENT} iconSize={20} />
          </div>
          <div className="file_uploader__file_card--contents">
            <h4>{this.state.registeredFile!['name']}</h4>
          </div>
        </Card>
      )
    } 
  }

  preRegisterFile = (file: File) => {
    // Ensure the file is the correct type
    if (!this.props.permittedFileExtensions.includes(file.type)) {
      const toastProps = {
        'message': 'Invalid File Type!',
        'intent': Intent.WARNING,
      }
      toaster.show(toastProps)
      return
    }

    this.setState({
      registeredFile: file
    })
  }

  render() {
      return(
      <div className="file_uploader__container">
        <UploadFile 
          registerFile={this.preRegisterFile} 
          uploadString={this.props.uploadString}
        />
        {this.renderFileInfo()}
        <div className="file_uploader__upload_button"> 
          <Button 
            large={true}
            disabled={!this.state.registeredFile}
            icon={IconNames.UPLOAD}
            text={"Upload to RoadX Platform"}
            // Can assert that registeredFile exists because otherwise this button would be disabled
            onClick={() => this.props.registerFile(this.state.registeredFile!)}
          />
        </div>
      </div>
    )
  }
}