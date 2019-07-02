import React from 'react';
import classNames from 'classnames/bind';
import s from './AreaList.scss';

const cx = classNames.bind(s);

class AreaList extends React.Component {
  state = {
    focus: false,
    value: '',
  }

  componentDidMount() {
    this.input.click();
  }

  onSubmitArea(id) {
    const {area, onSelect} = this.props;
    area.input.onChange(id);
    this.setState({value: ''});
    onSelect();
  }

  onInputFocus = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({focus: true});
  }

  onInputBlur = () => {
    this.setState({focus: false});
  }

  onChange = () => {
    this.setState({value: this.input.value});
  }

  onClear = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({value: ''});
  }

  highlightText(text, re) {
    if (re) {
      return text.replace(re, str => `<i>${str}</i>`);
    }
    return text;
  }

  renderOptions = () => {
    const {options} = this.props;
    const {value} = this.state;
    const pattern = value.toLowerCase();
    const re = new RegExp(pattern, 'gi');
    let result = null;

    if (options) {
      result = options
        .filter(op => op.name.toLowerCase().includes(pattern))
        .map(opt => (
          <li className={s.AreaListOption} key={opt.id}
            onClick={this.onSubmitArea.bind(this, opt.id)}
            dangerouslySetInnerHTML={{__html: this.highlightText(opt.name, re)}}
          />
        ));

      if (!result.length) {
        result = <li className={s.AreaListOption}>Не найдено</li>;
      }
    }
    return result;
  }

  render() {
    const {value, focus} = this.state;
    return (
      <div className={s.AreaList}>
        <div className={cx({AreaListInputContainer: true, focus})}>
          <svg className={s.Icon}>
            <use xlinkHref={'#ic_search'}/>
          </svg>
          <input
            autoFocus={true}
            placeholder='Искать район'
            className={s.AreaListInput}
            type={'text'}
            value={this.state.value}
            onChange={this.onChange}
            onClick={e => this.onInputFocus(e)}
            onBlur={this.onInputBlur}
            ref={(input) => {
              this.input = input;
            }} />
          {value
            && <svg className={cx(s.Icon, s.IconButton)} onClick={(e) => this.onClear(e)}>
              <use xlinkHref={'#ic-clear-input'}/>
            </svg>}
        </div>
        <ul className={s.AreaListScrollBox}>
          {this.renderOptions()}
        </ul>
      </div>
    );
  }
}

export default AreaList;
