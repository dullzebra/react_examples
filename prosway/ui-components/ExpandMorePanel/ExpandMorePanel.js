import React from 'react';
import s from './ExpandMorePanel.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

class ExpandMorePanel extends React.Component {
  state = {
    height: 0,
    maxPanelHeight: 0,
  }

  componentDidMount() {
    this.setState({maxPanelHeight: this.panel.scrollHeight});
  }

  toggle = (e) => {
    e.stopPropagation();
    const { height, maxPanelHeight } = this.state;
    this.setState({ height: height ? 0 : maxPanelHeight });
  }

  render() {
    const { linkText, items: [first, ...rest] } = this.props;
    const { height } = this.state;

    const containerClass = cx({
      isOpen: height,
    });

    const panelStyle = {
      maxHeight: height,
    };

    return (
      <div className={containerClass}>
        <div className={s.Row}>
          <div className={s.First}>
            {first}
          </div>
          <div className={s.Link} onClick={this.toggle}>
            {linkText}
            <i className={s.Icon}>
              <svg>
                <use xlinkHref={'#ic-arrow-down-purple'} />
              </svg>
            </i>
          </div>
        </div>
        <div className={s.Panel} style={panelStyle} ref={el => {
          this.panel = el;
        }}>
          {rest}
        </div>
      </div>
    );
  }
}

export default ExpandMorePanel;
