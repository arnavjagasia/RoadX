import React from 'react';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { DefectClassification, ALL_DEFECTS, RoadXRecord } from '../../types/types';
import { MenuItem, Button, Toaster, Position, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import '../../styles/classifier.css';
import { ISubmitOverrideParams, submitOverride } from '../../api/api';

const ClassificationSelector = Select.ofType<DefectClassification>();

const OverrideToaster = Toaster.create({
    className: "override-toaster",
    position: Position.TOP,
});

interface IClassifierProps {
    record: RoadXRecord
}

interface IClassifierState {
    classificationOverride: DefectClassification | undefined,
}

export default class Classifier extends React.Component<IClassifierProps, IClassifierState> {
    state: IClassifierState = {
        classificationOverride: undefined
    }

    renderClassification: ItemRenderer<DefectClassification> = (classification, { handleClick, modifiers, query }) => {
        return (
            <MenuItem
                text={classification}
                key={classification}
                onClick={handleClick}
            />
        );
    };

    handleSelectOverride = (classificationOverride: DefectClassification) => {
        this.setState({
            classificationOverride: classificationOverride,
        })
    }

    handleSubmitOverride = async () => {
        if (!this.state.classificationOverride) {
            OverrideToaster.show({
                message: "Please select an override to submit",
                intent: Intent.WARNING,
                icon: IconNames.UPLOAD,
            })
        }
        const params: ISubmitOverrideParams = {
            id: this.props.record.recordId,
            classificationOverride: this.state.classificationOverride
        }
        await submitOverride(params);
    }

    renderClassificationSelector() {
        const { classificationOverride } = this.state;
        const selectorText: string = classificationOverride ? classificationOverride : "Select a defect classification..."
        return (
            <div className={"classifier__selector"}>
                <ClassificationSelector
                    items={ALL_DEFECTS}
                    itemRenderer={this.renderClassification}
                    onItemSelect={this.handleSelectOverride}
                >
                    <Button
                        text={selectorText}
                        rightIcon="double-caret-vertical"
                    />
                </ClassificationSelector>
            </div>
        )
    }

    renderOverrideButton() {
        return (
            <Button
                className={"classifier__button"}
                text={"Submit Override"}
                icon={IconNames.UPLOAD}
                onClick={this.handleSubmitOverride}
            />
        )
    }
    render() {
        return (
            <div className="classifier__container">
                {this.renderClassificationSelector()}  
                {this.renderOverrideButton()}
            </div>
        );
    }
}