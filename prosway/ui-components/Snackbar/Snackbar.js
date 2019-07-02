import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { resetError } from '_actions';
import s from './Snackbar.scss';

const cx = classNames.bind(s);

class Snackbar extends React.Component {
  timer = null

  componentDidUpdate(prevProps) {
    if (this.props.error && this.props.error !== prevProps.error) {
      this.autoClose();
    }
  }

  close = () => {
    this.props.resetError();
    clearTimeout(this.timer);
  }

  autoClose = () => {
    this.timer = setTimeout(() => this.close(), 4000);
  }

  render() {
    const {error: {error, info}} = this.props;
    return (
      <div className={cx({Snackbar: true, Info: !!info, isOpen: error || info})}>
        <div>{info || 'Что-то пошло не так. Попробуйте снова'}</div>
        <svg className={s.Icon} onClick={this.close}>
          <use xlinkHref={'#ic-clear-input'}/>
        </svg>
      </div>
    );
  }
}

export default connect(state => ({error: state.error}), {resetError})(Snackbar);
