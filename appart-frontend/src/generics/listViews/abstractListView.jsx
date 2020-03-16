import React from 'react';
import axios from 'axios';
import Auth from '../../auth/auth';

export default class AbstractListView extends React.Component {
  dataUrl;
  filterUrl;

  /**
   *
   * @param props
   * @param dataUrl
   * @param filterUrl
   */
  constructor(props, dataUrl, filterUrl) {
    super(props);
    this.state = {
      isFilterActive: false,
      isLoaded: false,
      isFilterLoaded: false,
      data: null,
      filterData: null,
      paginationCount: null,
      paginationNext: null,
      paginationPrevious: null,
      //paginator settings
      itemsCountPerPage: process.env.REACT_APP_ITEMS_COUNT_PER_PAGE,
      pageRangeDisplayed: process.env.REACT_APP_PAGE_RANGE_DISPLAYED,
      //paginator settings end
      modal: false,
      modal_backdrop: false,
      modal_nested_parent: false,
      modal_nested: false,
      backdrop: true
    };
    dataUrl = this.dataUrl;
    filterUrl = this.filterUrl;
    this.user = new Auth();
  }

  /**
   * Paginator
   *
   * @param pageNumber
   */
  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    this.refreshData(pageNumber);
  }

  /**
   *
   * @param page
   */
  refreshData(page) {
    axios(`${this.dataUrl}?page=${page}`, {
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    })
      .then(
        result => {
          this.setState({
            isLoaded: true,
            data: result.data.results,
            paginationCount: result.data.count,
            paginationNext: result.data.next,
            paginationPrevious: result.data.previous
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  /**
   *
   * @param dataUrl
   */
  loadData(dataUrl) {
    axios(dataUrl, {
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    })
      .then(
        result => {
          this.setState({
            isLoaded: true,
            data: result.data.results,
            paginationCount: result.data.count,
            paginationNext: result.data.next,
            paginationPrevious: result.data.previous
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  /**
   *
   * @param dataUrl
   */
  loadFilterData(dataUrl) {
    axios(dataUrl, {
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    })
      .then(
        result => {
          this.setState({
            isFilterLoaded: true,
            filterData: result.data.results
          });
        },
        error => {
          this.setState({
            isFilterLoaded: true,
            error
          });
        }
      );
  }

  /**
   *
   * @param modalType
   * @returns {function(...[*]=)}
   */
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`]
    });
  };

  /**
   *
   * @returns {*}
   */
  componentDidMount() {
    this.loadData(this.dataUrl);
    if (this.state.isFilterActive) {
      this.loadFilterData(this.filterUrl);
    }
    return void 0;
  }
}