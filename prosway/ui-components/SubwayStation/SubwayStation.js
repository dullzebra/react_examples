import React from 'react';
import s from './SubwayStation.scss';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import ExpandMorePanel from '_uicomponents/ExpandMorePanel/ExpandMorePanel';
import SubwayStationName from './SubwayStationName';


const cx = classNames.bind(s);

class SubwayStation extends React.Component {
  render() {
    const {
      subway_stations_object,
      firstLineClass,
      compactViewClass,
    } = this.props;

    const subwayClasses = cx({
      SubwayStation: true,
      [firstLineClass]: true,
    });

    if (!subway_stations_object) {
      return (
        <div className={subwayClasses}/>
      );
    }

    const [first, ...rest] = subway_stations_object.map((station, i) => {
      const detailsClass = cx({
        SubwayStation: true,
        [compactViewClass]: true,
      });
      const lineClasses = i === 0 ? subwayClasses : detailsClass;

      return (
        <SubwayStationName
          key={i}
          lineClasses={lineClasses}
          station={station}
        />
      );
    });

    if (!rest.length) {
      return (
        <div>{first}</div>
      );
    } else {
      const linkText = `Ещё ${rest.length}`;
      return (
        <ExpandMorePanel linkText={linkText} items={[first, ...rest]}/>
      );
    }
  }
}

SubwayStation.propTypes = {};

export default SubwayStation;

