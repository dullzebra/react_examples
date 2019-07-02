import React from 'react';
import classNames from 'classnames/bind';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';

import s from './AreaSelect.scss';
import * as actions from '_actions';
import CircleOnMap from '_uicomponents/CircleOnMap/CircleOnMap';
import AreaList from '_uicomponents/AreaList/AreaList';
import utils from '_services/utils.js';
import {
  LAYOUT_MOBILE,
} from '_components/Layout/layoutTypes';

const cx = classNames.bind(s);

class AreaSelect extends React.Component {
  state = {
    isOpen: false,
    isMobileScreen: this.props.layoutType === LAYOUT_MOBILE,
  };
  toggle = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ isOpen: !this.state.isOpen });
  };
  hide = () => {
    this.setState({ isOpen: false });
  };
  switchMode = (mode) => {
    this.hide();

    if (mode === 'circle') {
      this.clearField('area');
    } else if (mode === 'list') {
      this.clearField('locationInput');
      this.clearField('distance');
    }
  };
  clearField = field => {
    if (this.props[field]) {
      this.props[field].input.onChange('');
    }
  };

  componentDidMount() {
    const {
      isMobileScreen,
    } = this.state;

    if (!isMobileScreen) {
      const CLICK_EVENT = window.CLICK_EVENT ? window.CLICK_EVENT : 'click';
      document.addEventListener(CLICK_EVENT, this.hide);
    }
  }

  componentWillUnmount() {
    const {
      isMobileScreen,
    } = this.state;

    if (!isMobileScreen) {
      const CLICK_EVENT = window.CLICK_EVENT ? window.CLICK_EVENT : 'click';
      document.removeEventListener(CLICK_EVENT, this.hide);
    }
  }

  onClear() {
    ['locationInput', 'distance', 'area'].forEach(field => {
      this.clearField(field);
    });
  }

  render() {
    const {
      isYmapsLoaded,
      locationInput,
      location,
      distance,
      id,
      placeholder,
      area,
      areaList,
      areaListById,
      input,
    } = this.props;
    const {
      isMobileScreen,
    } = this.state;
    const hasCircleValue = locationInput.input.value && distance.input.value;
    const areaValue = area.input.value;
    const hasAreaValue = areaValue && Object.keys(areaListById).length > 0;

    const FieldInfoClass = cx({
      FieldInfo: true,
      _hasValue: hasCircleValue || hasAreaValue,
    });

    const renderControls = () => (
      <React.Fragment>
        <CircleOnMap
          isYmapsLoaded={isYmapsLoaded}
          distance={distance}
          location={location}
          locationInput={locationInput}
          onClose={this.switchMode.bind(this, 'circle')}/>
        {areaList && areaList.length > 0 && <AreaList
          isMobileScreen={isMobileScreen}
          area={area}
          options={areaList}
          onSelect={this.switchMode.bind(this, 'list')}/>}
      </React.Fragment>
    );

    return (
      <div className={s.AreaSelect}>
        <div className={s.hiddenInputContainer}>
          <input
            placeholder={placeholder}
            className={s.inputClass}
            type={'text'}
            onFocus={this.onInputClick}
            ref={(input) => {
              this.inputRef = input;
            }}
            readOnly={true}
            id={id}
          />
        </div>
        <div className={s.Field}>
          <div className={FieldInfoClass} onClick={this.toggle}>
            <div className={s.Label}>
              Район
            </div>
            {hasCircleValue
            && <div className={s.Value}>
              <div className={s.ValueText}>Выбрана область</div>
            </div>
            }

            {hasAreaValue
            && <div className={s.Value}>
              <div className={s.ValueText}>{areaListById[areaValue].name}</div>
            </div>
            }

            {!hasCircleValue && !hasAreaValue
            && <div className={s.Value}>
              <div className={s.Placeholder}>Не выбрано</div>
            </div>
            }
          </div>
          <div className={s.ButtonZone}>
            {hasCircleValue || hasAreaValue ? (
              <div className={s.Clear} onClick={::this.onClear}>
                <svg>
                  <use xlinkHref={'#ic-clear-input'}/>
                </svg>
              </div>
            ) : (
              <div className={s.Arrow} onClick={this.toggle}/>
            )}
          </div>
        </div>
        {!isMobileScreen && <div className={cx({ Drop: true, isOpen: this.state.isOpen })}>
          {renderControls()}
        </div>}

        {isMobileScreen && <ReactModal
          isOpen={this.state.isOpen}
          className={s.AreaSelectFullScreen}
          overlayClassName={s.AreaSelectFullScreenOverlay}
        >
          <div className={s.Close} onClick={this.hide}>
            <svg>
              <use xlinkHref={'#ic-clear-input'}/>
            </svg>
          </div>
          {renderControls()}
        </ReactModal>}

        <input
          {...distance.input}
          hidden
          type={'text'}
        />
        <input
          {...locationInput.input}
          hidden
          type={'text'}
        />
        <input
          {...area.input}
          hidden
          type={'text'}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { layout: { isYmapsLoaded, type }, user, filter: { areaList, areaListById } } = state;
  const parentUser = utils.getParentUser(user);
  let location;

  if (parentUser) {
    location = utils.getLocationFromUser(parentUser);
  }
  return {
    isYmapsLoaded,
    location,
    areaList,
    areaListById,
    layoutType: type,
  };
}


export default connect(mapStateToProps, actions)(AreaSelect);
