import { AppData } from "@/lib/types";
import { useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Pill } from "@/components/pill";
import { Button } from "@/components/button";
import { Check } from "lucide-react";


export function LecturerAnnouncements({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [date, setDate] = useState("All dates");
  const dates = Array.from(new Set(data.lecturerNotifications.map((item) => item.date)));
  const visible = data.lecturerNotifications.filter((item) => date === "All dates" || item.date === date);
  const markRead = (id: string) => setData((old) => ({ ...old, lecturerNotifications: old.lecturerNotifications.map((item) => item.id === id ? { ...item, read: true } : item) }));
  return (
    <>
      <PageHeading eyebrow="Communication centre" title="Announcements & notifications" body="Review every teaching update and mark items as read once actioned."
      // actions={
      //   <Button onClick={() => toast.success("Announcement composer opened.")}>
      //     <Plus className="h-4 w-4" /> New announcement</Button>
      // }
      />
      <div className="portal-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="eyebrow">Full notification view</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Teaching updates</h3>
          </div>
          <select className="field mt-0 max-w-[220px]" value={date} onChange={(event) => setDate(event.target.value)}><option>All dates</option>
            {dates.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {visible.map((item) =>
            <div className="flex flex-col gap-4 py-5 first:pt-0 md:flex-row md:items-start md:justify-between" key={item.id}>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  {!item.read && <Pill>Unread</Pill>}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{item.body}</p>
                <p className="mt-2 text-xs text-slate-400">{item.date}</p>
              </div>
              {!item.read && <Button variant="light" onClick={() => markRead(item.id)}>Mark as read <Check className="h-4 w-4" /></Button>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}