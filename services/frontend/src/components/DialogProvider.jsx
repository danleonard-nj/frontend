import { KasaDeviceClientResponseDialog } from './kasa/dialogs/KasaDeviceClientResponseDialog';
import { KasaSceneCategoryDialog } from './kasa/dialogs/KasaSceneCategoryAddDialog';
import { KasaSceneCategoryRemoveDialog } from './kasa/dialogs/KasaSceneCategoryRemoveDialog';
import { EditNotificationDialog } from './reminders/dialogs/EditNotificationDialog';
import { EditReminderDialog } from './reminders/dialogs/EditReminderDialog';
import { CreateReminderLocationDialog } from './reminders/dialogs/layout/CreateLocationDialog';
import { ViewDestinationDetailsDialog } from './reminders/dialogs/ViewDestinationDetailsDialog';
import ReverbOrderDetailDialog from './reverb/ReverbOrderDetailDialog';
import ScheduleAddLinkDialog from './schedule/dialogs/ScheduleAddLinkDialog';
import ScheduleDeleteConfirmDialog from './schedule/dialogs/ScheduleDeleteConfirmDialog';
import DeleteTaskConfirmationDialog from './task/dialogs/DeleteTaskConfirmationDialog';

export const DialogProvider = () => {
  return (
    <>
      <EditReminderDialog />
      <ViewDestinationDetailsDialog />
      <ScheduleDeleteConfirmDialog />
      <ScheduleAddLinkDialog />
      <DeleteTaskConfirmationDialog />
      <CreateReminderLocationDialog />
      <EditNotificationDialog />
      <KasaSceneCategoryDialog />
      <KasaSceneCategoryRemoveDialog />
      <KasaDeviceClientResponseDialog />
      <ReverbOrderDetailDialog />
    </>
  );
};
