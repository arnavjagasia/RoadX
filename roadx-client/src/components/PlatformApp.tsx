import React from 'react';
import { Button, Navbar, NavbarGroup, Alignment } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import FilterPanel from './FilterPanel';

import "../styles/platformapp.css";
import ListView from './ListView';
import { FilterSpec, RoadXRecord } from '../types/types';
import { getDataByFilterSpec } from '../api/api';

type DataDisplayMode = string;
const MAP_MODE: DataDisplayMode = "MAP_MODE";
const LIST_MODE: DataDisplayMode = "LIST_MODE";

interface IPlatformAppState {
    mode: DataDisplayMode,
    filters: FilterSpec,
    data: Array<RoadXRecord>
}

export default class PlatformApp extends React.Component<{}, IPlatformAppState> {
    state: IPlatformAppState = {
        mode: LIST_MODE,
        filters: {
            minLatitude: -100,
            minLongitude: -100,
            maxLatitude: 100,
            maxLongitude: 100,
            defectClassifications: [],
            threshold: 0, 
        },
        data: [],
    }

    updateFilters = async (filters: FilterSpec) => {
        const result: Array<RoadXRecord> =  await getDataByFilterSpec(filters);
        // perhaps some post processing here TODO
        this.setState({
            filters: filters,
            data: result,
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
                <FilterPanel 
                    filters={this.state.filters} 
                    updateFilters={this.updateFilters}
                />
            </div>
        )
    }

    renderDataDisplay = () => {
        return(
            <div className="app__data_display"> 
                <ListView data={this.state.data}/>
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