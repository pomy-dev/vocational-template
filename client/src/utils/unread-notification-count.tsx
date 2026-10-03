import { AppData } from "@/lib/types";

export function unreadNotificationCount(data: AppData) { return data.lecturerNotifications.filter((item) => !item.read).length; }