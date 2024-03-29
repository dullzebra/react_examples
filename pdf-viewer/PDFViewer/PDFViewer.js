import React from 'react'
import Modal from 'react-modal';
import s from './PDFViewer.scss'
import classNames from 'classnames/bind';
import Button from '_components/Button/Button';
import PDFViewerShare from './PDFViewerShare';
import Pager from './PDFViewerPager';
import {
  appData,
  urlQueries,
  appDefaults,
} from '_config/config';

/*
* This pdf-viewer uses html+css and other stuff generated by pdf2htmlEX (https://github.com/coolwanglu/pdf2htmlEX)
* These files lay in dir testEnv.pdfPath
*/

const searchParams = new URLSearchParams(window.location.search);
const dataPath = searchParams.get(urlQueries.dataPath);

const BOOK = dataPath + appData.pdfBookFolder + appData.pdfBookIndex;
const OUTLINE = dataPath + appData.pdfBookFolder + appData.pdfBookOutline;
const SCALESTEP = appData.pdfBookScalestep;

const cx = classNames.bind(s);

class PDFViewer extends React.Component {
  state = {
    viewer: null,
    maxPage: null,
    scale: 1,
    sidebarNode: null,
    sidebarOpen: false,
    sidebarOn: true,
    pageFrom: this.props.pageFrom || this.props.page || 1,
    rangeStyleNode: null,
    rangeNodeSelector: (() => {
      // compose string like 'div[data-page-no=5], div[data-page-no=6], div[data-page-no=7] ...' 
      // that is used to show only [pageFrom, pageTo] range of pages
      const pagesStyle = [];
      for (let i = +this.props.pageFrom; i <= +this.props.pageTo; i++) {
        pagesStyle.push(`div[data-page-no='${i.toString(16)}']`)
      }
      return pagesStyle.join(', ');
    })(),
  }

  handleCloseModal = () => {
    this.props.onClose();
  }

  gotoPage = input => {
    const { maxPage, viewer } = this.state;
    let page = +input;

    if (maxPage && page > maxPage) {
      page = maxPage;
    }

    try {
      viewer.navigate_to_dest('[' + page + ',"Fit"]')
    } catch (e) {
      return
    }
  }

  onInitContent = () => {
    const { page, pageFrom, pageTo } = this.props;

    try {
      const viewer = this.iframeRef.contentWindow.pdf2htmlEX.defaultViewer;
      /*
       source function viewer.navigate_to_dest() heads for page+1 relative to destination.
       in order to fix that behavior we redefine it:
      */
      const sourceNavigateFn = viewer.navigate_to_dest.bind(viewer);
      viewer.navigate_to_dest = function (a, b) {
        try {
          var c = JSON.parse(a);
          if (c instanceof Array) {
            // here we correct page number 
            c[0] = c[0] - 1;
          }
          if (c[0] === 0) {
            // scroll to page 0 does not work properly, so do it by scroll(0,0)
            viewer.container.scrollTo(0, 0);
            return;
          }
          var fixed_a = JSON.stringify(c);

          // call initial function with correct params           
          sourceNavigateFn(fixed_a, b);
        } catch (e) { return }
      }

      this.setState({
        viewer,
        maxPage: viewer.pages.length,
      },
        () => this.gotoPage(pageFrom || page)
      );

      if (pageFrom && pageTo) {
        /*
          redefine load_page: it considers attribute data-load now
         */
        const sourceLoadPage = viewer.load_page.bind(viewer);
        viewer.load_page = function (a, b, c) {
          var e = this.pages;
          const p = e[a].page.getAttribute("data-load");
          if (p && p === '1') {
            sourceLoadPage(a, b, c);
          }
        }
        this.prepareRangeNodes();
        this.loadOutlineIntoViewer(viewer, () => this.turnSidebar(false));
      } else {
        this.loadOutlineIntoViewer(viewer);
      }

    } catch (e) {
      return
    };
  }

  /*
    Need to display specified pages and hide all other pages 
   */
  prepareRangeNodes = () => {
    const { rangeNodeSelector } = this.state;

    // attribute data-load enables/disables page loading
    const viewer = this.iframeRef.contentWindow.pdf2htmlEX.defaultViewer;
    const container = viewer.container;
    Array.from(container.children).forEach(div => div.setAttribute('data-load', '0'));
    container.querySelectorAll(`${rangeNodeSelector}`).forEach(div => div.setAttribute('data-load', '1'));

    const document = this.iframeRef.contentWindow.document;
    // styles to display/hide selected pages
    // (code from source function pre_hide_pages is used)
    var a = `@media screen{
          .pf{display: none}
          ${rangeNodeSelector}{display:block}     
        }`,
      b = document.createElement("style");
    b.id = 'rangeStyle';
    b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(document.createTextNode(a));

    document.head.appendChild(b);
    this.setState({ rangeStyleNode: b });
  }

  /*
   Switch between full book and [pageFrom, pageTo] range:
      - add/remove <style> to hide/show all pages.
      - switch attribute data-load of page nodes to '0'/'1' 
      (that fixes immidiate loading of hidden pages)
  */
  onPagerRangeChange = pagerRange => {
    const { viewer, rangeNodeSelector, rangeStyleNode } = this.state;

    const document = this.iframeRef.contentWindow.document;
    const container = viewer.container;

    if (pagerRange === 'all') {
      this.turnSidebar(true);
      this.gotoPage(1);
      this.setState({ pageFrom: 1 });

      Array.from(container.children).forEach(div => div.setAttribute('data-load', '1'));
      document.head.removeChild(rangeStyleNode);

    } else {
      this.turnSidebar(false);
      this.gotoPage(this.props.pageFrom);
      this.setState({ pageFrom: this.props.pageFrom });

      Array.from(container.children).forEach(div => div.setAttribute('data-load', '0'));
      container.querySelectorAll(`${rangeNodeSelector}`).forEach(div => div.setAttribute('data-load', '1'));
      document.head.appendChild(rangeStyleNode);
    }
  }

  // pdf2htmlEX does not put contents of .outline file into #sidebar-div in .html file
  // Here we do it ourselves
  loadOutlineIntoViewer = (viewer, cb) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", OUTLINE);
    xhr.onload = () => {
      if (200 === xhr.status || 0 === xhr.status) {
        try {
          const doc = this.iframeRef.contentWindow.document;
          const outlineDiv = doc.getElementById('outline');
          outlineDiv.innerHTML = xhr.responseText;
          doc.getElementById('sidebar').classList.add('opened');

          this.setState({
            sidebarNode: doc.getElementById('sidebar'),
            sidebarOpen: true,
          });

          typeof cb === 'function' && cb.call();
        } catch (e) {
          return
        }
      }
    }
    xhr.send();
  }

  // Sidebar opening/closing is also up to us :(
  toggleSidebar = force => {
    const { sidebarNode } = this.state;
    sidebarNode && sidebarNode.classList && sidebarNode.classList.toggle('opened', force);
    this.setState(prevState => ({ sidebarOpen: !prevState.sidebarOpen }))
  }

  turnSidebar = force => {
    this.setState({ sidebarOn: force });
    this.toggleSidebar(force)
  }

  onZoomIn = () => {
    this.scalePage(this.state.scale / SCALESTEP);
  }

  onZoomOut = () => {
    this.scalePage(this.state.scale * SCALESTEP);
  }

  scalePage = scale => {
    const { viewer } = this.state;
    this.setState({ scale })
    viewer.rescale(scale);
  }


  render() {
    const { isOpen, title, withEbook, pageTo } = this.props;
    const { maxPage, viewer, sidebarOpen, sidebarOn, pageFrom } = this.state;

    const sidebarClassNames = cx({
      PDFViewer__SidebarTrigger: true,
      open: sidebarOpen,
    });

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.handleCloseModal}
        className={s.PDFViewer__Popup}
      >
        <div className={s.PDFViewer__Head}>
          {viewer &&
            <Pager
              pageFrom={pageFrom}
              pageTo={pageTo}
              maxPage={maxPage}
              page={this.props.pageFrom}
              onPageChange={this.gotoPage}
              onRangeChange={this.onPagerRangeChange}
            />}

          <h1 className={s.PDFViewer__Title}>{title}</h1>

          {viewer && <React.Fragment>
            <div className={s.PDFViewer__Zoom}>
              <button className={s.PDFViewer__ZoomIn} onClick={this.onZoomIn} />
              <button className={s.PDFViewer__ZoomOut} onClick={this.onZoomOut} />
              <PDFViewerShare maxPage={maxPage}>
                {onClick => <button className={s.PDFViewer__Share} onClick={onClick} />}
              </PDFViewerShare>
            </div>
            {withEbook &&
              <Button classNames={s.PDFView__Toggle} onClick={this.handleCloseModal}>
                {appDefaults.ebookBookButton}
              </Button>}
          </React.Fragment>}

        </div>

        {sidebarOn && <div className={sidebarClassNames} onClick={() => this.toggleSidebar()}></div>}

        <iframe
          src={BOOK}
          ref={ref => this.iframeRef = ref}
          onLoad={this.onInitContent}
          title='pdf_version'
          className={s.PDFViewer__Frame}
        ></iframe>
      </Modal>
    )
  }
}

Modal.setAppElement('#root');

export default PDFViewer;
