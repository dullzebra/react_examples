import React from 'react'
import classNames from 'classnames/bind';
import s from './PDFViewer.scss';

const cx = classNames.bind(s);

class PDFViewerPager extends React.Component {
  state = {
    input: this.props.pageFrom,
    pageFrom: this.props.pageFrom,
    pagerMenuOpen: false,
    pagerStateFull: false,
  }

  static getDerivedStateFromProps(props, state) {
    if (props.pageFrom !== state.pageFrom) {
      return {
        input: props.pageFrom,
        pageFrom: props.pageFrom,
      }
    }
    return null;
  }

  onChangeInput = e => this.setState({ input: e.target.value })

  onClickInput = e => e.stopPropagation();

  onSubmit = e => {
    e && e.preventDefault();
    this.props.onPageChange(this.state.input);
  }

  togglePagerMenu = () => this.setState(prevState => ({ pagerMenuOpen: !prevState.pagerMenuOpen }))

  togglePagerState = e => {
    const pagerStateFull = !this.state.pagerStateFull;
    e.stopPropagation();

    this.setState({
      pagerStateFull: pagerStateFull,
      pagerMenuOpen: false,
    },
      () => this.props.onRangeChange(pagerStateFull ? 'all' : 'range')
    )
  }


  render() {
    const { page, pageTo, maxPage } = this.props;
    const { pagerMenuOpen, pagerStateFull, pageFrom } = this.state;

    if (pageFrom && pageTo) {

      const triggerFull = (<React.Fragment>
        Страница
        <input type='number' name='pageInput'
          min='1'
          value={this.state.input}
          onChange={this.onChangeInput}
          onClick={this.onClickInput}
        />
        {maxPage && <label>из {maxPage} </label>}
      </React.Fragment>)

      const triggerCut = (<React.Fragment>
        Страница
        <input type='number' name='pageInput'
          min={pageFrom}
          max={pageTo}
          value={this.state.input}
          onChange={this.onChangeInput}
          onClick={this.onClickInput} />
        из {page}&ndash;{pageTo}
      </React.Fragment>)

      return (<React.Fragment>
        <form onSubmit={this.onSubmit} className={s.PDFViewer__Form}>
          <div
            className={cx({ PDFViewer__DTrigger: true, open: pagerMenuOpen })}
            onClick={this.togglePagerMenu}
          >
            {pagerStateFull && triggerFull}
            {!pagerStateFull && triggerCut}
            <i></i>
            <ul>
              <li onClick={this.togglePagerState}>
                {pagerStateFull && <span>Страницы {page}&ndash;{pageTo}</span>}
                {!pagerStateFull && <span>Весь учебник</span>}
              </li>
            </ul>
          </div>
          <button type='submit' onClick={this.onSumit} />
        </form>
      </React.Fragment>)
    }

    return (
      <form onSubmit={this.onSubmit} className={s.PDFViewer__Form}>
        <label>Страница </label>
        <input type='number' min='1' name='pageInput' onChange={this.onChangeInput} value={this.state.input} />
        {maxPage && <label>из {maxPage}</label>}
        <button type='submit' onClick={this.onSubmit} />
      </form>
    )
  }
}

export default PDFViewerPager;