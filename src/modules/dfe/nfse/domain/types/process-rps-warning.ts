export interface ProcessRpsWarning {
    code: string;
    message: string;
    type: 'INFO' | 'ALERT' | 'WARNING';
}