import React from 'react';
import s from './Address.scss';
import utils from '_services/utils.js';
import SubwayStation from '_uicomponents/SubwayStation/SubwayStation.js';

class Address extends React.Component {
  render() {
    const { isMin, address, targetLocation, subwayStationsObject } = this.props;

    let minDist = {};
    let subwayStations = subwayStationsObject;

    // add distance prop to each subwayStation
    if (targetLocation && subwayStationsObject && subwayStationsObject.length) {
      subwayStations = subwayStations.map(item => {
        if (!item.location) {
          return item;
        }
        return {
          ...item,
          distance: utils.calcDistance(item.location, targetLocation),
        };
      });
    }


    // find subwayStation with min distance from targetLocation
    if (isMin && subwayStationsObject && subwayStationsObject.length) {
      minDist = subwayStations.reduce((min, item) => {
        return item.distance < min.distance ? item : min;
      });
      subwayStations = [minDist];
    }


    return (
      <React.Fragment>
        <SubwayStation subway_stations_object={subwayStations}/>
        <p>{address}</p>
      </React.Fragment>
    );
  }
}

export default Address;
