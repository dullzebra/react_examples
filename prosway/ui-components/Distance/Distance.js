import React from 'react';
import s from './Distance.scss';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import TextWithTooltip from '_uicomponents/TextWithTooltip/TextWithTooltip.js';
import utils from '_services/utils.js';

const cx = classNames.bind(s);

class Distance extends React.Component {
  render() {
    const { distance, locations, targetLocation, browserLocation, compactViewClass, firstLineClass, isFirstLine } = this.props;

    const distanceItems = [];
    let distanceString = '';

    if (locations.length > 0) {
      locations.forEach(location => {
        if (location.name) {
          distanceString = `${utils.getDistance(location.distance)} от ${location.name}`;
          distanceItems.push(distanceString);
        }
      });
    } else if (browserLocation && targetLocation) {
      const distance = utils.calcDistance(browserLocation, targetLocation);
      distanceString = `${utils.getDistance(distance)} от вас`;
    } else {
      distanceString = `${utils.getDistance(distance)} от центра города`;
    }

    const detailsClass = cx({
      Adress: true,
      [compactViewClass]: !isFirstLine,

    });
    const linkClass = cx({
      [firstLineClass]: isFirstLine,
    });
    const childrenClass = cx({
      [compactViewClass]: isFirstLine,
    });

    return (
      <div className={detailsClass}>
        <div className={linkClass}>
          {locations.length > 0 ? (
            <TextWithTooltip
              linkText={distanceItems[0]}
              items={distanceItems.slice(1)}
            />
          ) : (
              <div className={s.Text}>{distanceString}</div>
            )}
        </div>
        <div className={childrenClass}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(null)(Distance);
