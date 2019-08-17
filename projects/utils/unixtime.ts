const units = {
  millisecond: 1,
  tick: 200,
  second: 1000,
  minute: 60000,
  hour: 3600000,
  date: 86400000,
  day: 86400000,

  getTime(num: number, unit: string) {
    return num * this[unit];
  },
};

export function time(val: number | string | Date = Date.now()) {
  if (val instanceof Date) {
    return Unixtime.fromDate(val);
  }
  if ((val as string).substr) {
    return Unixtime.fromUTC(val as string);
  }

  return Unixtime.of(val as number);
}

export class Unixtime {
  static of(val: number) {
    return new Unixtime(val);
  }

  static fromDate(val: Date) {
    return new Unixtime(val.getTime());
  }

  static fromUTC(val: string) {
    return new Unixtime(Date.parse(val));
  }

  static max(...values: number[] | Unixtime[]) {
    return Unixtime.of((values as Unixtime[])
      .map(x => +x)
      .reduce((acc: number, val: number) => acc > val ? acc : val, 0));
  }

  static min(...values: number[] | Unixtime[]) {
    return Unixtime.of((values as Unixtime[])
      .map(x => +x)
      .reduce((acc: number, val: number) => acc < val ? acc : val, Infinity));
  }

  // PROPS

  private cacheDate: Date;

  // GETTERS

  get value() {
    return this.val;
  }

  get unix() {
    return Math.floor(this.val / units['second']);
  }

  get seconds() {
    return this.toDate().getSeconds();
  }

  get minutes() {
    return this.toDate().getMinutes();
  }

  get hours() {
    return this.toDate().getHours();
  }

  get date() {
    return this.toDate().getDate();
  }

  get day() {
    return this.toDate().getDay();
  }

  get month() {
    return this.toDate().getMonth();
  }

  get year() {
    return  this.toDate().getFullYear();
  }

  constructor(private val: number) {}

  // MATH

  add(num: number | Unixtime, unit: string = 'millisecond') {
    return new Unixtime(this.value + units.getTime(+num, unit));
  }

  subtract(num: number | Unixtime, unit: string = 'millisecond') {
    return new Unixtime(this.value - units.getTime(+num, unit));
  }

  diff(num: number | Unixtime, unit: string = 'millisecond') {
    return new Unixtime(units.getTime(this.value - (+num), unit));
  }

  startOf(unit: string) {
    return this.subtract(this.value % units[unit]);
  }

  endOf(unit: string) {
    return this.startOf(units[unit]).add(1, unit).subtract(1);
  }

  // LOGIC

  isSame(num: number | Unixtime) {
    return this.value === (+num);
  }

  isAfter(num: number | Unixtime) {
    return this.value > (+num);
  }

  isAfterOrSame(num: number | Unixtime) {
    return this.value >= (+num);
  }

  isBefore(num: number | Unixtime) {
    return this.value < (+num);
  }

  isBeforeOrSame(num: number | Unixtime) {
    return this.value <= (+num);
  }

  // FORMAT

  toDate() {
    if (!this.cacheDate) this.cacheDate = new Date(this.value);
    return this.cacheDate;
  }

  // SYSTEM

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value;
  }
}
