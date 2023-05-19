import CreateFeatureDialog from './features/dialogs/CreateFeatureDialog';
import { KasaDeviceClientResponseDialog } from './kasa/dialogs/KasaDeviceClientResponseDialog';
import { KasaSceneCategoryDialog } from './kasa/dialogs/KasaSceneCategoryAddDialog';
import { KasaSceneCategoryRemoveDialog } from './kasa/dialogs/KasaCreateSceneCategoryDialog';
import ReverbOrderDetailDialog from './reverb/ReverbOrderDetailDialog';
import { ScheduleAddLinkDialog } from './schedule/dialogs/ScheduleAddLinkDialog';
import ScheduleDeleteConfirmDialog from './schedule/dialogs/ScheduleDeleteConfirmDialog';
import { ScheduleHistoryViewDialog } from './schedule/dialogs/ScheduleHistoryViewDialog';
import DeleteTaskConfirmationDialog from './task/dialogs/DeleteTaskConfirmationDialog';

export const DialogProvider = () => {
  return (
    <>
      <ScheduleDeleteConfirmDialog />
      <ScheduleAddLinkDialog />
      <DeleteTaskConfirmationDialog />
      <KasaSceneCategoryDialog />
      <KasaSceneCategoryRemoveDialog />
      <KasaDeviceClientResponseDialog />
      <ReverbOrderDetailDialog />
      <CreateFeatureDialog />
      <ScheduleHistoryViewDialog />
    </>
  );
};
