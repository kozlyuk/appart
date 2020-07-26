/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

// @ts-ignore
import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Collapse, CustomInput, Form, FormGroup, Input, Label, Row } from 'reactstrap';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import PageSpinner from '../../../components/PageSpinner';
import { FiFilter } from 'react-icons/fi';
import ApartmentAnalyticsController from '../../../controllers/ApartmentAnalyticsController';
import axios from 'axios';
// @ts-ignore
import moment from 'moment';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Helmet from 'react-helmet';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/uk';

/**
 * Filter interface
 */
interface FilterInterface {
  isLoaded: boolean,
  filterToggle: boolean,
  companyChoices?: any,
  houseChoices?: any,
  startDateValue?: any,
  startDateFormattedValue?: any,
  hoverRange?: Date[],
  selectedDays?: Date[]
}

export default class AnalyticsFilter extends Component<any, FilterInterface> {

  private ApartmentAnalyticsController: ApartmentAnalyticsController = new ApartmentAnalyticsController();

  public state: FilterInterface = {
    isLoaded: false,
    filterToggle: false,
    companyChoices: undefined,
    houseChoices: undefined,
    hoverRange: undefined,
    selectedDays: []
  };

  public componentDidMount = () => {
    Promise.all(this.ApartmentAnalyticsController.getFilterPromise()).then(axios.spread((
      companies: any,
      houses: any
    ) => {
      this.setState({
        isLoaded: true,
        companyChoices: companies.data,
        houseChoices: houses.data
      });
    }));
  };

  protected toggleFilter = (): void => {
    this.setState({
      filterToggle: !this.state.filterToggle
    });
  };

  private getRelativeDayInWeek(d: Date, dy: number): string { // 0 = Sunday, 1 = Monday ... 6 = Saturday
    d = new Date(d);
    const day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : dy);
    return new Date(d.setDate(diff)).toISOString();
  }

  private handleStartDataChange(value: any, formattedValue: any): void {
    const withDash = formattedValue.replace(/\//mg, '-');
    this.setState({
      startDateValue: value,             // ISO String, ex: "2016-11-19T12:00:00.000Z"
      startDateFormattedValue: withDash  // Formatted String, ex: "11/19/2016"
    });
  }

  private getWeekDays(weekStart: Date): Date[] {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
      days.push(
        moment(weekStart)
          .add(i, 'days')
          .toDate()
      );
    }

    return days;
  }

  private getWeekRange(date: Date): any {
    return {
      from: moment(date)
        .startOf('week')
        .toDate(),
      to: moment(date)
        .endOf('week')
        .toDate()
    };
  }

  private handleDayChange = (date: Date): void => {
    this.setState({
      selectedDays: this.getWeekDays(this.getWeekRange(date).from)
    }, () => {
      const days: any = this.state.selectedDays;
      this.props.dateRangeHandler(moment(days[0]).format('YYYY-MM-DD'), moment(days[6]).format('YYYY-MM-DD'));
    });
  };

  private handleDayEnter = (date: Date): void => {
    this.setState({
      hoverRange: this.getWeekRange(date)
    });
  };

  private handleDayLeave = (): void => {
    this.setState({
      hoverRange: undefined
    });
  };

  private handleWeekClick = (weekNumber: number, days: Date[], e: Event): void => {
    this.setState({
      selectedDays: days
    }, () => {
      this.props.dateRangeHandler(moment(days[0]).format('YYYY-MM-DD'), moment(days[6]).format('YYYY-MM-DD'));
    });
  };

  private static displayMonth(counter: number) {
    const today = new Date();
    const month = new Date().getMonth() - counter;
    today.setMonth(month);
    return today;
  }

  public render(): any {
    const {
      filterSearchHandler,
      houseSelectHandler,
      companySelectHandler,
      filterIsActiveHandler
    }: any = this.props;
    const {
      houseChoices,
      companyChoices,
      hoverRange,
      selectedDays
    }: any = this.state;
    const daysAreSelected = selectedDays.length > 0;
    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6]
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6]
    };
    const isLoaded: boolean = this.state.isLoaded;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>);
    } else {
      return (
        <>
          <Row form className="mb-2">
            <Button size="sm" color="secondary" outline onClick={this.toggleFilter} className="ml-2">
              <FiFilter/> <Text text="global.filter"/>
            </Button>
            <Form inline className="ml-auto">
              <FormGroup>
                <div>
                  <CustomInput
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    label={<Text text="global.displayInactive"/>} inline
                    onChange={filterIsActiveHandler}
                  />
                </div>
              </FormGroup>
            </Form>
            <Form inline className="ml-2" onSubmit={filterSearchHandler}>
              <FormGroup className="mr-2">
                <Label className="mr-2" for="search"><Text text="global.search"/></Label>
                <Input
                  type="text"
                  name="search"
                  filterquery="filter"
                  id="search"
                />
                <Button size="sm" className="ml-2" type="submit" color="primary"><Text text="global.search"/></Button>
              </FormGroup>
            </Form>
          </Row>
          <Collapse isOpen={this.state.filterToggle} className="mb-2">
            <Card>
              <CardBody className="pb-0">
                <Form>
                  <Row>
                    <Col className="pb-0 col-lg-6 col-12">
                      <FormGroup>
                        <Label className="mr-2" for="house">
                          <Text text="sidebar.house"
                                formatters='firstUppercase'/>
                        </Label>
                        <Input
                          type="select"
                          name="house"
                          filterquery="house"
                          id="house"
                          onChange={houseSelectHandler}
                        >
                          {houseChoices?.map(({ name, pk }: { name: string, pk: number }) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pb-0 col-lg-6 col-12">
                      <FormGroup>
                        <Label className="mr-2" for="company">
                          <Text text="sidebar.company"
                                formatters='firstUppercase'/>
                        </Label>
                        <Input
                          type="select"
                          name="company"
                          filterquery="company"
                          id="company"
                          onChange={companySelectHandler}
                        >
                          {companyChoices?.map(({ name, pk }: { name: string, pk: number }) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="SelectedWeek text-center">
                        {/*
                        // @ts-ignore*/}
                        <DayPicker
                          selectedDays={selectedDays}
                          showWeekNumbers
                          showOutsideDays
                          numberOfMonths={4}
                          month={AnalyticsFilter.displayMonth(3)}
                          localeUtils={MomentLocaleUtils}
                          locale={'uk'}
                          modifiers={modifiers}
                          onDayClick={this.handleDayChange}
                          onDayMouseEnter={this.handleDayEnter}
                          onDayMouseLeave={this.handleDayLeave}
                          onWeekClick={this.handleWeekClick}
                        />
                        {selectedDays.length === 7 && (
                          <div>
                            {moment(selectedDays[0]).format('LL')} –{' '}
                            {moment(selectedDays[6]).format('LL')}
                          </div>
                        )}
                      </div>
                      {/*
                        // @ts-ignore*/}
                      <Helmet>
                        <style>{`
                          .SelectedWeek .DayPicker-Month {
                            border-collapse: separate;
                          }
                          .SelectedWeek .DayPicker-WeekNumber {
                            outline: none;
                          }
                          .SelectedWeek .DayPicker-Day {
                            outline: none;
                            border: 1px solid transparent;
                          }
                          .SelectedWeek .DayPicker-Day--hoverRange {
                            background-color: #EFEFEF !important;
                          }
              
                          .SelectedWeek .DayPicker-Day--selectedRange {
                            background-color: #8095fc !important;
                          }
              
                          .SelectedWeek .DayPicker-Day--selectedRangeStart {
                            background-color: #6f7cb9 !important;
                          }
              
                          .SelectedWeek .DayPicker-Day--selectedRangeEnd {
                            background-color: #6f7cb9 !important;
                          }
              
                          .SelectedWeek .DayPicker-Day--selectedRange:not(.DayPicker-Day--outside).DayPicker-Day--selected,
                          .SelectedWeek .DayPicker-Day--hoverRange:not(.DayPicker-Day--outside).DayPicker-Day--selected {
                            color: black !important;
                          }
                          .SelectedWeek .DayPicker-Day--hoverRange:hover {
                            border-radius: 0 !important;
                          }
                        `}</style>
                      </Helmet>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Collapse>
        </>
      );
    }
  }
}