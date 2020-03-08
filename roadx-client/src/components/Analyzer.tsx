import React from 'react';
import { Button } from '@blueprintjs/core';

interface IAnalyzerProps {
    filename: string
}

export default class Analyzer extends React.Component<IAnalyzerProps, {}> {
    runAnalysis = async () => {
        const formData: FormData = new FormData();
        formData.append('filename', this.props.filename)
        await fetch('http://localhost:5000/analyzeImage', {
            method: 'POST',
            mode: 'no-cors', // cannot pass headers with no-cors
            body: formData
        }).then(response => {
            console.log(response)
        }).catch((reason) =>
            console.log(reason)
        )
    }

    render() {
        return(
            <Button 
                text={"Analyze"}
                onClick={this.runAnalysis}
            />
        )
    }
}