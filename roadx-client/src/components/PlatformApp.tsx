import React from 'react';
import { Button, Navbar, NavbarGroup, Alignment } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import Map from './Map';
import FilterPanel from './FilterPanel';

import "../styles/platformapp.css";
import { thistle } from 'color-name';



export type DataDisplayMode = string;
export const MAP_MODE: DataDisplayMode = "MAP_MODE";
export const LIST_MODE: DataDisplayMode = "LIST_MODE";

export type DefectClassifiction = string;
export const POTHOLE: DefectClassifiction = "Pothole";
export const LONGITUDINAL_CRACK: DefectClassifiction = "Longitudinal Crack";
export const LATERAL_CRACK: DefectClassifiction = "Lateral Crack";
export const ALLIGATOR_CRACK: DefectClassifiction = "Alligator Crack";
export const ALL_DEFECTS: Array<DefectClassifiction> = [POTHOLE, LONGITUDINAL_CRACK, LATERAL_CRACK, ALLIGATOR_CRACK]

export interface FilterSpec {
    coordinates: Array<String>;
    defectClassifications: Array<DefectClassifiction>;
    threshold: number;
}

interface IPlatformAppState {
    mode: DataDisplayMode,
    filters: FilterSpec,
}

export default class PlatformApp extends React.Component<{}, IPlatformAppState> {
    state: IPlatformAppState = {
        mode: LIST_MODE,
        filters: {
            coordinates: [],
            defectClassifications: [],
            threshold: 0, 
        }
    }

    updateFilters = (filters: FilterSpec) => {
        this.setState({
            filters: filters,
        })
    }

    // Helper method to render the navbar at the top of the app
    renderNavbar = () => {
        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <Navbar.Heading className="app__navbar-text">RoadX</Navbar.Heading>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button 
                        minimal={false}
                        text="Upload New Data" 
                        icon={IconNames.UPLOAD}
                    />
                </NavbarGroup>
            </Navbar>
        )
    }

    renderFilterPanel = () => {
        return(
            <div className="app__filter_panel">
                <FilterPanel filters={this.state.filters} updateFilters={this.updateFilters}/>
            </div>
        )
    }

    renderDataDisplay = () => {
        return(
            <div className="app__data_display"> 
                YOOHOO 
            </div>
        );
    }

    render() {
        return(
           <div className='app__container'>
               {this.renderNavbar()}
               <div className="app__contents">
                    {this.renderFilterPanel()}
                    {this.renderDataDisplay()}
               </div>
           </div> 
        )
    }
    // Nav bar at top
    // Map options on right
    // Filter options on left

}