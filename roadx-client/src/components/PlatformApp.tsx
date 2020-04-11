import React from 'react';
import { Button, Navbar, NavbarGroup, Alignment, Overlay, Classes, Dialog } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import FilterPanel from './FilterPanel';

import "../styles/platformapp.css";
import ListView from './ListView';
import { FilterSpec, RoadXRecord, DataDisplayMode, LIST_MODE, MAP_MODE } from '../types/types';
import { getDataByFilterSpec } from '../api/api';
import Uploader from './uploadPortal/Uploader';

interface IPlatformAppState {
    mode: DataDisplayMode,
    filters: FilterSpec,
    data: Array<RoadXRecord>
    uploaderIsOpen: boolean,
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
        uploaderIsOpen: false,
    }

    updateFilters = async (filters: FilterSpec) => {
        const result: Array<RoadXRecord> =  await getDataByFilterSpec(filters);
        // perhaps some post processing here TODO
        this.setState({
            filters: filters,
            data: result,
        })
    }

    changeMode = () => {
        const { mode } = this.state;
        // Toggle the mode
        this.setState({
            mode: mode === LIST_MODE ? MAP_MODE : LIST_MODE,
        })
    } 

    openUploader = () => {
        this.setState({uploaderIsOpen: true});
    }

    closeUploader = () => {
        this.setState({uploaderIsOpen: false});
    }

    // Helper method to render the navbar at the top of the app
    renderNavbar = () => {
        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <Navbar.Heading className="app__navbar-text">RoadX Analysis Platform</Navbar.Heading>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button 
                        minimal={false}
                        text="Upload New Data" 
                        icon={IconNames.UPLOAD}
                        onClick={this.openUploader}
                    />
                    <Dialog
                        icon={IconNames.UPLOAD}
                        title="RoadX Data Upload Portal"
                        isOpen={this.state.uploaderIsOpen}
                        onClose={this.closeUploader} 
                        usePortal={true}
                    >
                        <Uploader/>
                    </Dialog>
                </NavbarGroup>
            </Navbar>
        )
    }

    renderFilterPanel = () => {
        const { filters, mode } = this.state;
        return(
            <div className="app__filter_panel">
                <FilterPanel 
                    filters={filters} 
                    updateFilters={this.updateFilters}
                    mode={mode}
                    changeMode={this.changeMode}
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