import React from 'react';
import { FilterSpec, DefectClassification, ALL_DEFECTS, DataDisplayMode, LIST_MODE} from '../types/types';
import { Slider, Checkbox, Alignment, Button } from '@blueprintjs/core';

import '../styles/filterpanel.css';
import { IconNames } from '@blueprintjs/icons';

interface IFilterPanelProps {
    filters: FilterSpec;
    updateFilters: (filters: FilterSpec) => void;
    mode: DataDisplayMode;
    changeMode:() => void;
}

export default class FilterPanel extends React.Component<IFilterPanelProps, FilterSpec> {
    state: FilterSpec = this.props.filters;

    updateThreshold = (threshold: number) => {
        this.setState({threshold: threshold});
    }

    renderThresholdSlider = () => {
        const { threshold } = this.state;
        return(
            <div className="filter_panel__item">
                <p className="filter_panel__item-text"> Filter by Confidence Threshold </p>
                <Slider
                    initialValue={100}
                    labelStepSize={20}
                    max={100}
                    min={0}
                    onChange={this.updateThreshold}
                    stepSize={1}
                    value={threshold}
                />
            </div>
        )
    }

    updateCheckedDefect = (_: any, defectClass: DefectClassification) => {
        const { defectClassifications } = this.state;
        if (defectClassifications.includes(defectClass)) {
            this.setState({defectClassifications: defectClassifications.filter(d => d !== defectClass)});
        } else {
            this.setState({defectClassifications: [defectClass, ...defectClassifications]})
        }

    }

    renderDefectSelection = () => {
        const { defectClassifications } = this.state;
        return(
            <div className="filter_panel__item">
                <p className="filter_panel__item-text"> Filter by Defect Classification </p>
                {
                    // Iterate through each defect and make a checkbox that is connected to state
                    ALL_DEFECTS.map(defect => {
                        return(
                            <Checkbox
                                alignIndicator={Alignment.LEFT}
                                checked={defectClassifications.includes(defect)}
                                label={defect}
                                key={defect}
                                onChange={_ => this.updateCheckedDefect(_, defect)}
                            />
                        )
                    })
                }
            </div>
        )
    }

    renderUpdateFiltersButton = () => {
        return(
            <div className="filter_panel__button">
                <Button
                    text="Update Filters"
                    icon={IconNames.FILTER}
                    onClick={() => this.props.updateFilters(this.state)}
                />
            </div>
        )
    }

    renderChangeModeButton = () => {
        const { mode } = this.props;
        const text = mode === LIST_MODE ? "View in Map Mode" : "View in List Mode";
        const icon = mode === LIST_MODE ? IconNames.MAP : IconNames.LIST;
        return (
            <div className="filter_panel__button">
                <Button
                    text={text}
                    icon={icon}
                    onClick={() => this.props.changeMode()}
                />
            </div>
        )
    }

    render() {
        return(
            <div className="filter_panel__container">
                {this.renderThresholdSlider()}
                {this.renderDefectSelection()}
                {this.renderUpdateFiltersButton()}
                {this.renderChangeModeButton()}
            </div>
        )
    }
}
