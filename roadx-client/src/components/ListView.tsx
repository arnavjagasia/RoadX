import React from 'react';
import { RoadXRecord } from '../types/types';
import ListViewCard from './ListViewCard';

interface IListViewProps {
    data: Array<RoadXRecord>;
    viewRecordOnMap: (record: RoadXRecord) => void;
}

export default class ListView extends React.Component<IListViewProps, {}> {
    render() {
        return(
            <div className="list_view__container">
                {this.props.data.map((record: RoadXRecord) => {
                    return(
                        <ListViewCard
                            key={record.recordId}
                            record={record}
                            viewOnMap={() => this.props.viewRecordOnMap(record)}
                        />
                    )
                })}
            </div>
        )
    }
}
