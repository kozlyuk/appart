/*
 * Filter component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

// @ts-ignore
import React, {Component} from 'react';
import {Button, Card, CardBody, Col, Collapse, CustomInput, Form, FormGroup, Input, Label, Row} from 'reactstrap';
// @ts-ignore
import {Text} from 'react-easy-i18n';
import PageSpinner from '../../../components/PageSpinner';
import {FiFilter} from 'react-icons/fi';
import ApartmentAnalyticsController from '../../../controllers/ApartmentAnalyticsController';
import axios from 'axios';
// @ts-ignore
import moment from 'moment';
import DayPicker, {DateUtils} from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Helmet from 'react-helmet';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/uk';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

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

const animatedComponents = makeAnimated();

export default class PaymentFilter extends Component<any, FilterInterface> {
  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
  }

  private ApartmentAnalyticsController: ApartmentAnalyticsController = new ApartmentAnalyticsController();

  public state: FilterInterface = {
    isLoaded: false,
    filterToggle: false,
    companyChoices: undefined,
    houseChoices: undefined,
    hoverRange: undefined,
    selectedDays: this.getWeekRange(new Date())
  };

  public componentDidMount = () => {
    const emptyCompany = {pk: '', name: '----------'};
    Promise.all(this.ApartmentAnalyticsController.getFilterPromise()).then(axios.spread((
      companies: any,
      houses: any
    ) => {
      const houseOptions: any[] = [];
      houses.data.map((item: any) => {
        houseOptions.push({value: item.pk, label: item.name});
      });
      this.setState({
        isLoaded: true,
        companyChoices: [emptyCompany, ...companies.data],
        houseChoices: houseOptions
      });
    }));
  };

  private getInitialState = (): any => {
    return {
      from: this.getMonthRange(new Date).from,
      to: this.getMonthRange(new Date).to
    };
  };

  private handleDayClick = (day: Date) => {
    // @ts-ignore
    const range = DateUtils.addDayToRange(day, this.state);
    // @ts-ignore
    this.setState(range, () => {
      this.props.dateRangeHandler(
        moment(range.from || this.getMonthRange(new Date).from).format('YYYY-MM-DD'),
        moment(range.to || this.getMonthRange(new Date).to).format('YYYY-MM-DD')
      );
    });
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

  public getWeekRange(date: Date): any {
    return {
      from: moment(date)
        .startOf('week')
        .toDate(),
      to: moment(date)
        .endOf('week')
        .toDate()
    };
  }

  public getMonthRange(date: Date): any {
    return {
      from: moment(date)
        .startOf('month')
        .toDate(),
      to: moment(date)
        .endOf('month')
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
    // @ts-ignore
    const {from, to} = this.state;
    const modifiers = {start: from, end: to};
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
                    label={'Тільки нерозпізнані'} inline
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
                          {companyChoices?.map(({name, pk}: { name: string, pk: number }) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pb-0 col-lg-6 col-12">
                      <FormGroup>
                        <Label className="mr-2" for="house">
                          <Text text="sidebar.house"
                                formatters='firstUppercase'/>
                        </Label>
                        <Select
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          // defaultValue={[colourOptions[4], colourOptions[5]]}
                          onChange={houseSelectHandler}
                          isMulti
                          options={houseChoices}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pb-0 col-lg-6 col-12">
                      <FormGroup>
                        <Label className="mr-2" for="company">
                          Тип оплати
                        </Label>
                        <Input
                          type="select"
                          name="company"
                          filterquery="company"
                          id="company"
                          onChange={companySelectHandler}
                        >
                          {companyChoices?.map(({name, pk}: { name: string, pk: number }) => (
                            <option key={pk} value={pk}>{name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pb-0 col-lg-6 col-12">
                      <FormGroup>
                        <Label className="mr-2" for="house">
                          Сервісна служба
                        </Label>
                        <Select
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          // defaultValue={[colourOptions[4], colourOptions[5]]}
                          onChange={houseSelectHandler}
                          isMulti
                          options={houseChoices}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="RangeExample text-center">
                        <DayPicker
                          className="Selectable"
                          selectedDays={[from, {from, to}]}
                          showWeekNumbers
                          showOutsideDays
                          numberOfMonths={4}
                          month={PaymentFilter.displayMonth(3)}
                          localeUtils={MomentLocaleUtils}
                          locale={'uk'}
                          modifiers={modifiers}
                          onDayClick={this.handleDayClick}
                        />
                        {/*
                        // @ts-ignore*/}
                        <Helmet>
                          <style>{`
                            .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                              background-color: #f0f8ff !important;
                              color: #4a90e2;
                            }
                            .Selectable .DayPicker-Day {
                              border-radius: 0 !important;
                            }
                            .Selectable .DayPicker-Day--start {
                              border-top-left-radius: 50% !important;
                              border-bottom-left-radius: 50% !important;
                            }
                            .Selectable .DayPicker-Day--end {
                              border-top-right-radius: 50% !important;
                              border-bottom-right-radius: 50% !important;
                            }
                          `}</style>
                        </Helmet>
                      </div>
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