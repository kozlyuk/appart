/*
 * Abstract list view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import axios from 'axios';
import Auth from '../../auth/auth';

export default class AbstractListView extends React.Component {
  dataUrl;
  filterUrl;

  /**
   * Get props
   *
   * @return {*}
   */
  get props() {
    return this._props;
  }

  /**
   * Set props
   *
   * @param value
   */
  set props(value) {
    this._props = value;
  }

  /**
   * Get data url
   *
   * @return {*}
   */
  get dataUrl() {
    return this._dataUrl;
  }

  /**
   * Set data url
   *
   * @param value
   */
  set dataUrl(value) {
    this._dataUrl = value;
  }

  /**
   * Get filter url
   *
   * @return {*}
   */
  get filterUrl() {
    return this._filterUrl;
  }

  /**
   * Set filter url
   *
   * @param value
   */
  set filterUrl(value) {
    this._filterUrl = value;
  }

  /**
   * Get user
   *
   * @return {Auth}
   */
  get user() {
    return this._user;
  }

  /**
   * Set user
   *
   * @param value
   */
  set user(value) {
    this._user = value;
  }

  /**
   *
   * @param props
   * @param dataUrl
   * @param filterUrl
   */
  constructor(props, dataUrl, filterUrl) {
    super(props);
    dataUrl = this.dataUrl;
    filterUrl = this.filterUrl;
    this._user = new Auth();
    this._props = props;
    this._dataUrl = dataUrl;
    this._filterUrl = filterUrl;
  }

  state = {
    isFilterActive: false,
    isLoaded: false,
    isFilterLoaded: false,
    data: null,
    filterData: null,
    paginationCount: null,
    paginationNext: null,
    paginationPrevious: null,
    //paginator settings
    itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
    pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
    //paginator settings end
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true
  };

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
  refreshData(page, queryParams) {
    if (!queryParams) {
      axios(`${this.dataUrl}?page=${page}`, {
        headers: {
          'Authorization': 'Token ' + this._user.getAuthToken()
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
    } else {
      axios(`${this.dataUrl}${queryParams}&page=${page}`, {
        headers: {
          'Authorization': 'Token ' + this._user.getAuthToken()
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
  }

  /**
   *
   * @param dataUrl
   */
  loadData(dataUrl) {
    axios(dataUrl, {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
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
        'Authorization': 'Token ' + this._user.getAuthToken()
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