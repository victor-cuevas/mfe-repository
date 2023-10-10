import { DtoBase } from './dtobase.model';
import { ManageNotificationInitialData } from './manage-notification-intialdata.model';
import { NotificationConfigDto } from './notification-config.model';

export class GetNotificationConfig extends DtoBase{
    manageNotificationConfigInitialData!:ManageNotificationInitialData
    notificationConfigList !: NotificationConfigDto[]
}