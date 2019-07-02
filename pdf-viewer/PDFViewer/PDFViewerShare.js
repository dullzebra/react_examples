import React from 'react';
import PropTypes from 'prop-types';
import s from './PDFViewerShare.scss'
import classNames from 'classnames/bind';
import qs from 'qs';
import { Form, Input, Button, Label } from '_components/Form/Form';
import {
  urlQueries
} from '_config/config'

class PDFViewerShare extends React.Component {
  state = {
    open: false,
    pageFrom: 1,
    pageTo: this.props.maxPage,
    sharelink: '',
    copySuccess: false,
  }

  toggle = () => this.setState(prevState => ({ open: !prevState.open }));

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value, sharelink: '' })
  }

  buildLink = () => {
    const {pageFrom, pageTo} = this.state;
    if (!pageFrom || !pageTo || pageFrom > pageTo) return; 

    const location = window.location;
    let search = location.search.replace('?', '')

    const query = qs.parse(search)
    delete query[urlQueries.defaultView];
    query[urlQueries.pageFrom] = this.state.pageFrom;
    query[urlQueries.pageTo] = this.state.pageTo;

    search = '?' + qs.stringify(query, { encode: false });
    const sharelink = location.origin + '/static/books-viewer/index.html' + search;

    this.setState({ sharelink });
  }

  copyToClipboard = e => {
    this.link.select();
    document.execCommand('copy');
    this.link.focus();
    this.setState({ copySuccess: true });
  };

  clearCopySuccess = () => {
    this.setState({ copySuccess: false });
  }

  render() {
    const {
      open,
      pageFrom,
      pageTo,
      sharelink,
    } = this.state;
    const { children } = this.props;

    return (
      <div className={s.PDFViewerShare}>
        {children(this.toggle)}

        {open &&
          <div className={s.PDFViewerShare__DropDown}>
            <div className={s.PDFViewerShare__Title}>
              <span>Поделиться страницами учебника</span>
              <i onClick={this.toggle} />
            </div>
            <Form>
              <p>Укажите диапазон страниц</p>
              <div className={s.PDFViewerShare__Form}>
                <Label>От</Label>
                <Input
                  value={pageFrom}
                  name='pageFrom'
                  type='number'
                  max={pageTo}
                  required
                  onChange={this.handleInputChange}
                />
                <Label>До</Label>
                <Input
                  value={pageTo}
                  name='pageTo'
                  type='number'
                  min={pageFrom}
                  required
                  onChange={this.handleInputChange}
                />
                <Button
                  onClick={this.buildLink}>
                  <i />Получить ссылку
              </Button>
              </div>
              <p>Ссылка на выбранные страницы:</p>
              <div className={s.PDFViewerShare__Form}>
                <input
                  className={s.PDFViewerShare_Link}
                  value={sharelink}
                  onChange={() => { }}
                  onClick={this.copyToClipboard}
                  onBlur={this.clearCopySuccess}
                  ref={link => this.link = link}
                />
              </div>
              <div className={s.PDFViewerShare__CopySuccess}>{this.state.copySuccess && <span>Ссылка скопирована в буфер обмена</span>}</div>
            </Form>
          </div>}
      </div>
    )
  }
}

export default PDFViewerShare;

PDFViewerShare.propTypes = {
  children: PropTypes.func.isRequired,
};