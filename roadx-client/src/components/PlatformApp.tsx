import React from 'react';
import { Button, Navbar, NavbarGroup, Alignment, Dialog, isPositionHorizontal } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FilterSpec, RoadXRecord, DataDisplayMode, LIST_MODE, MAP_MODE } from '../types/types';
import FilterPanel from './FilterPanel';
import ListView from './ListView';
import MapView from './MapView';
import Uploader from './uploadPortal/Uploader';

import "../styles/platformapp.css";
import { getDataByFilterSpec } from '../api/api';

interface IPlatformAppProps {
    logout: () => void;
}

interface IPlatformAppState {
    mode: DataDisplayMode,
    filters: FilterSpec,
    data: Array<RoadXRecord>
    uploaderIsOpen: boolean,
    currentRecord: RoadXRecord | undefined
}

export default class PlatformApp extends React.Component<IPlatformAppProps, IPlatformAppState> {
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
        currentRecord: undefined,
    }

    componentDidMount =  async () => {
        const { filters } = this.state;
        const result: Array<RoadXRecord> =  await getDataByFilterSpec(filters);
        this.setState({
            data: result,
        })
    }

    updateFilters = async (filters: FilterSpec) => {
        const result: Array<RoadXRecord> =  await getDataByFilterSpec(filters);
        this.setState({
            filters: filters,
            data: result,
        })
    }

    updateMapScope = (
        minLatitude: number, 
        minLongitude: number, 
        maxLatitude: number, 
        maxLongitude: number
    ) => {
        console.log(minLatitude, minLongitude, maxLatitude, maxLongitude)
        const newFilters: FilterSpec = {
            minLatitude: minLatitude,
            minLongitude: minLongitude,
            maxLatitude: maxLatitude,
            maxLongitude: maxLongitude,
            ...this.state.filters,
        }
        this.updateFilters(newFilters);
    }

    changeMode = () => {
        const { mode } = this.state;
        console.log('hello')
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
    
    viewRecordOnMap = (record: RoadXRecord) => {
        this.setState({
            currentRecord: record,
            mode: MAP_MODE
        })
    }
    // Helper method to render the navbar at the top of the app
    renderNavbar = () => {
        return (
            <Navbar className="app__nav">
                <NavbarGroup align={Alignment.LEFT}>
                    <Navbar.Heading className="app__nav-text">RoadX Analysis Platform</Navbar.Heading>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button
                        className="app__nav-button"
                        minimal={false}
                        text="Upload New Data"
                        icon={IconNames.CLOUD_UPLOAD}
                        onClick={this.openUploader}
                    />
                    <Button
                        className="app__nav-button"
                        minimal={false}
                        text="Logout"
                        icon={IconNames.LOG_OUT}
                        onClick={this.props.logout}
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
      if(this.state.mode === MAP_MODE){
        return(
            <div className="app__data_display">
                <MapView 
                    data={this.state.data} 
                    updateMapScope={this.updateMapScope}
                    currentRecord={this.state.currentRecord}
                />
            </div>
        );
      }
      else{
        return(
            <div className="app__data_display">
                <ListView 
                    data={this.state.data}
                    viewRecordOnMap={this.viewRecordOnMap}
                />
            </div>
        );
      }
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
}
