import { AntomNotifyType } from "@lib/common/consts/antom";
import { PaymentResultOperation } from "./payment-result-operation";
import { CaptureResultOperation } from "./capture-result-operation";
import type { AntomPaymentNotificationReq } from "@lib/common/dto/antom";

export enum AntomResultStatus {
    Success = 'S',
    Failed = 'F',
}

export interface INotifyTypeOperation {
    do(): Promise<void>;
}

export class NotifyTypeOperationFactory {
    static create(req: AntomPaymentNotificationReq): INotifyTypeOperation {
        switch (req.notifyType) {
            case AntomNotifyType.PaymentResult:
                return new PaymentResultOperation(req);
            case AntomNotifyType.CaptureResult:
                return new CaptureResultOperation(req);
        }
    }
}
