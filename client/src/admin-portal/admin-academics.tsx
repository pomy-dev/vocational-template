// function AdminAcademics({ data, setData, navigate }: {
//   data: AppData;
//   setData: React.Dispatch<React.SetStateAction<AppData>>;
//   navigate: (path: string) => void
// }) {
//   const [tab, setTab] = useState("Schedules");
//   const [modal, setModal] = useState(false);
//   const tabs = ["Schedules", "Assignments", "Exams", "Announcements"];
//   return (
//     <PortalShell role="Admin" active="/admin/academics" onNavigate={navigate}>
//       <PageHeading eyebrow="Academic operations" title="Plan the learning cycle" body="Create, publish and maintain the academic calendar."
//         actions={
//           <Button onClick={() => setModal(true)}><Plus className="h-4 w-4" /> Create {tab.slice(0, -1)}</Button>
//         }
//       />
//       <div className="portal-card">
//         <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
//           {tabs.map((item) => <button key={item} className={`filter-chip ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>{item}</button>)}</div>
//         <div className="mt-5 overflow-x-auto">
//           {tab === "Schedules" &&
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Activity</th>
//                   <th>Type</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Location</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.schedules.map((s) =>
//                   <tr key={s.id}>
//                     <td className="font-semibold">{s.title}</td>
//                     <td>
//                       <Pill tone={s.kind === "Exam" ? "red" : "slate"}>{s.kind}</Pill>
//                     </td>
//                     <td>{s.date}</td>
//                     <td>{s.time}</td>
//                     <td>{s.location}</td>
//                     <td>
//                       <button className="icon-btn" onClick={() => toast.success("Schedule edit mode opened.")}><MoreHorizontal /></button>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           }
//           {tab === "Assignments" &&
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Assignment</th>
//                   <th>Course</th>
//                   <th>Due date</th>
//                   <th>Submissions</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.assignments.map((a) =>
//                   <tr key={a.id}>
//                     <td className="font-semibold">{a.title}</td>
//                     <td>{a.course}</td>
//                     <td>{a.due}</td>
//                     <td>18 / 24</td>
//                     <td>
//                       <Pill tone="green">Published</Pill>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           }
//           {tab === "Exams" &&
//             <div className="empty-state">
//               <FileText />
//               <h3>No additional exam papers yet</h3>
//               <p>Create a published exam schedule to make it visible to learners.</p>
//               <Button onClick={() => setModal(true)}>Create exam</Button>
//             </div>
//           }
//           {tab === "Announcements" &&
//             <div className="space-y-3">
//               {data.announcements.map((a) =>
//                 <div className="list-row" key={a.id}>
//                   <div>
//                     <p className="font-semibold text-slate-950">{a.title}</p>
//                     <p className="mt-1 text-xs text-slate-500">{a.date} · {a.audience}</p>
//                   </div>
//                   <button className="icon-btn" onClick={() => toast.success("Announcement edit mode opened.")}>
//                     <MoreHorizontal />
//                   </button>
//                 </div>
//               )}
//             </div>
//           }
//         </div>
//       </div>
//       {modal &&
//         <Modal title={`Create ${tab.slice(0, -1).toLowerCase()}`} onClose={() => setModal(false)}>
//           <form className="mt-5 space-y-4" onSubmit={(e) => {
//             e.preventDefault();
//             if (tab === "Schedules")
//               setData((old) => ({
//                 ...old,
//                 schedules: [{
//                   id: crypto.randomUUID(),
//                   title: "New academic activity",
//                   kind: "Class",
//                   date: "2026-07-01",
//                   time: "09:00 – 11:00",
//                   location: "Room 1 · Wynberg"
//                 },
//                 ...old.schedules]
//               }));
//             setModal(false);
//             toast.success(`${tab.slice(0, -1)} created and saved locally.`);
//           }}>
//             <label>Title
//               <input className="field" defaultValue="New academic activity" required />
//             </label>
//             <label>Date
//               <input className="field" type="date" defaultValue="2026-07-01" required />
//             </label>
//             <label>Notes
//               <textarea className="field min-h-[100px] py-3" defaultValue="Add details for learners and teaching staff." />
//             </label>
//             <Button type="submit" className="w-full justify-center">Save and publish <Check className="h-4 w-4" /></Button>
//           </form>
//         </Modal>
//       }
//     </PortalShell>
//   );
// }