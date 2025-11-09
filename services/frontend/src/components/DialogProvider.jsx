import { ChatGptHistoryViewDialog } from './chatgpt/dialogs/ChatGptHistoryViewDialog';
import { CreateEmailRuleDialog } from './email/dialogs/CreateEmailRuleDialog';
import CreateFeatureDialog from './features/dialogs/CreateFeatureDialog';
import EditFeatureDialog from './features/dialogs/EditFeatureDialog';
import { MagnetLinkDialog } from './layouts/DashboardTorrentLayout';
import { NestDeviceLogRecordDialog } from './nest/NestDeviceLogRecordDialog';
import ReverbOrderDetailDialog from './reverb/ReverbOrderDetailDialog';
import { ScheduleAddLinkDialog } from './schedule/dialogs/ScheduleAddLinkDialog';
import { ScheduleDeleteConfirmDialog } from './schedule/dialogs/ScheduleDeleteConfirmDialog';
import { ScheduleHistoryViewDialog } from './schedule/dialogs/ScheduleHistoryViewDialog';
import { DeleteTaskConfirmationDialog } from './task/dialogs/DeleteTaskConfirmationDialog';
import { DeleteBalanceConfirmDialog } from './bank/dialogs/DeleteBalanceConfirmDialog';

export const DialogProvider = () => {
  return (
    <>
      <ScheduleDeleteConfirmDialog />
      <ScheduleAddLinkDialog />
      <DeleteTaskConfirmationDialog />
      <DeleteBalanceConfirmDialog />
      <ReverbOrderDetailDialog />
      <CreateFeatureDialog />
      <EditFeatureDialog />
      <ScheduleHistoryViewDialog />
      <ChatGptHistoryViewDialog />
      <MagnetLinkDialog id='magnet-link-dialog' />
      <CreateEmailRuleDialog id='create-email-rule-dialog' />
      <NestDeviceLogRecordDialog />
    </>
  );
};
