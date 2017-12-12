import ReportType from '../ReportType';

interface IReportRequest {
    type: ReportType;
    from: string;
    to: string;
    res: string;
    id?: string;
}

export default IReportRequest;
