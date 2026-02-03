declare module "korean-lunar-calendar" {
  interface LunarCalendar {
    year: number;
    month: number;
    day: number;
    intercalation?: boolean;
  }
  class KoreanLunarCalendar {
    setSolarDate(year: number, month: number, day: number): void;
    getLunarCalendar(): LunarCalendar;
  }
  export default KoreanLunarCalendar;
}
