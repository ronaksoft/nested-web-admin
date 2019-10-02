export default interface IResolutionSetting {
  latestAreaLabel: string;
  latestAreaColor: string;
  secondAreaLabel: string;
  secondAreaColor: string;
  thirdAreaColor?: string;
  resolutionKey: string;
  tooltipLabelFormatter: (value: number | string) => React.ReactNode;
  tickFormatter: (value: number) => void;
  parser: (items: any[]) => void;
  ticksDateFormat?: string;
  ticksCount: number;
  ticksGapDuration: any;
}
