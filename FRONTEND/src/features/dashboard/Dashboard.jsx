import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  IndianRupee,
  Users,
  CheckCircle,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { eventsService } from "../events/eventsService";
import { postsService } from "../posts/postsService";
import { dashboardService } from "./dashboardService";
import BrandLoader from "../../utils/BrandLoader";
import { getErrorMessage } from "../../utils/apiMessage";

const ACCENT = "#0C6E72";

/* Custom recharts tooltip — themed, no broken CSS vars */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-[12px] border border-indriya-border dark:border-indriya-darkBorder bg-white dark:bg-indriya-darkCard px-3.5 py-2.5"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted mb-1">
        {label}
      </p>
      <p className="text-[15px] font-bold" style={{ color: ACCENT }}>
        {payload[0].value}{" "}
        <span className="text-[12px] font-medium text-indriya-muted dark:text-indriya-darkMuted">
          enrollments
        </span>
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    overview: {
      totalEarnings: 0,
      totalEventsConducted: 0,
      totalUsers: 0,
      totalSuccessfulEnrollments: 0,
    },
    engagementChart: [],
  });

  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, postsData, statsData] = await Promise.all([
        eventsService.getAllEvents().catch(() => []),
        postsService.getAllPosts().catch(() => []),
        dashboardService.getOverallStats().catch(() => ({
          overview: { totalEarnings: 0, totalEventsConducted: 0, totalUsers: 0, totalSuccessfulEnrollments: 0 },
          engagementChart: [],
        })),
      ]);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setPosts(Array.isArray(postsData) ? postsData : []);
      setStats(statsData);
    } catch {
      toast.error(getErrorMessage(undefined, "Failed to load dashboard data."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      const res = await eventsService.deleteEvent(id);
      toast.success(res?.message || "Event deleted.");
      fetchData();
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to delete event."));
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await postsService.deletePost(id);
      toast.success(res?.message || "Post deleted.");
      fetchData();
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to delete post."));
    }
  };

  if (isLoading) return <BrandLoader label="Loading dashboard…" />;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: CalendarIcon },
    { id: "posts", label: "Posts", icon: FileText },
  ];

  return (
    <div
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6 min-h-0 animate-in fade-in duration-500"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black tracking-[0.14em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-1.5">
            Admin
          </p>
          <h1
            className="text-indriya-text dark:text-indriya-darkText tracking-[-0.025em]"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400 }}
          >
            Command Center
          </h1>
          <p className="text-[14px] text-indriya-muted dark:text-indriya-darkMuted mt-1">
            Manage content, events, and platform financials.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-indriya-secondary dark:bg-indriya-darkSecondary p-1 rounded-[14px] border border-indriya-border dark:border-indriya-darkBorder gap-0.5 w-full sm:w-auto">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all duration-200
                  ${active
                    ? "bg-indriya-card dark:bg-indriya-darkCard shadow-sm border border-indriya-border dark:border-indriya-darkBorder"
                    : "text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText border border-transparent"
                  }`}
                style={active ? { color: ACCENT } : {}}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Revenue",
                value: `₹${new Intl.NumberFormat("en-IN").format(stats.overview.totalEarnings)}`,
                icon: IndianRupee,
                color: "#059669",
                bg: "rgba(16,185,129,0.1)",
              },
              {
                label: "Total Users",
                value: new Intl.NumberFormat("en-IN").format(stats.overview.totalUsers),
                icon: Users,
                color: ACCENT,
                bg: "rgba(12,110,114,0.1)",
              },
              {
                label: "Successful Enrollments",
                value: new Intl.NumberFormat("en-IN").format(stats.overview.totalSuccessfulEnrollments),
                icon: CheckCircle,
                color: "#0891b2",
                bg: "rgba(8,145,178,0.1)",
              },
              {
                label: "Events Conducted",
                value: stats.overview.totalEventsConducted,
                icon: CalendarIcon,
                color: "#7c3aed",
                bg: "rgba(124,58,237,0.1)",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[20px] p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted mb-2">
                    {label}
                  </p>
                  <p
                    className="tracking-tight leading-none"
                    style={{ fontFamily: "'DM Serif Display', serif", fontSize: "30px", fontWeight: 400, color }}
                  >
                    {value}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Engagement Chart */}
          <div
            className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] p-4 sm:p-7"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-indriya-border dark:border-indriya-darkBorder">
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                style={{ backgroundColor: "rgba(12,110,114,0.1)" }}
              >
                <Activity size={18} style={{ color: ACCENT }} />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-indriya-text dark:text-indriya-darkText">
                  Enrollment Trends
                </h2>
                <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
                  6-month historical view of approved enrollments.
                </p>
              </div>
            </div>

            {stats.engagementChart.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full mb-3 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(12,110,114,0.08)" }}
                >
                  <Activity size={22} style={{ color: ACCENT }} />
                </div>
                <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
                  No data yet
                </p>
                <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                  Enrollment trends will appear as registrations come in.
                </p>
              </div>
            ) : (
              <div className="h-[320px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.engagementChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ACCENT} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      className="text-indriya-border dark:text-indriya-darkBorder opacity-50"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#888" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#888" }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: ACCENT, strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.4 }} />
                    <Area
                      type="monotone"
                      dataKey="enrollments"
                      name="Enrollments"
                      stroke={ACCENT}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorEnrollments)"
                      dot={{ r: 0 }}
                      activeDot={{ r: 5, fill: ACCENT, stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: EVENTS ── */}
      {activeTab === "events" && (
        <div
          className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[20px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 duration-300"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
        >
          <div className="px-6 py-4 border-b border-indriya-border dark:border-indriya-darkBorder flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText">
              Event Directory
            </h2>
            <Link
              to="/events/create"
              className="flex items-center gap-1.5 text-white px-4 py-2 rounded-full text-[13px] font-bold transition-all hover:scale-[0.97]"
              style={{ backgroundColor: ACCENT, boxShadow: "0 4px 16px rgba(12,110,114,0.25)" }}
            >
              <Plus size={14} /> New Event
            </Link>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-indriya-border dark:border-indriya-darkBorder bg-indriya-secondary/40 dark:bg-indriya-darkSecondary/40">
                  {["Event Name", "Date", "Type", ""].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 font-bold text-[11px] uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted ${h === "" ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indriya-border dark:divide-indriya-darkBorder">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(12,110,114,0.08)" }}
                      >
                        <CalendarIcon size={22} style={{ color: ACCENT }} />
                      </div>
                      <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
                        No events yet
                      </p>
                      <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                        Create your first event to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-indriya-secondary dark:hover:bg-indriya-darkSecondary transition-colors">
                      <td className="px-6 py-4 font-semibold text-indriya-text dark:text-indriya-darkText">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 text-indriya-muted dark:text-indriya-darkMuted">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 text-[11px] font-bold rounded-full"
                          style={{ backgroundColor: "rgba(12,110,114,0.1)", color: ACCENT }}
                        >
                          {event.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/dashboard/events/${event.id}`}
                            className="p-2 rounded-lg text-indriya-muted hover:bg-indriya-secondary dark:hover:bg-indriya-darkSecondary transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                            onMouseLeave={e => (e.currentTarget.style.color = "")}
                            title="Manage attendees"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/events/${event.slug}/edit`}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#d97706", backgroundColor: "rgba(217,119,6,0.08)" }}
                            title="Edit event"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile: event cards ── */}
          <div className="md:hidden">
            {events.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(12,110,114,0.08)" }}
                >
                  <CalendarIcon size={22} style={{ color: ACCENT }} />
                </div>
                <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
                  No events yet
                </p>
                <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                  Create your first event to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-indriya-border dark:divide-indriya-darkBorder">
                {events.map((event) => (
                  <div key={event.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-indriya-text dark:text-indriya-darkText text-[14px] mb-1">
                          {event.title}
                        </p>
                        <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className="flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-full"
                        style={{ backgroundColor: "rgba(12,110,114,0.1)", color: ACCENT }}
                      >
                        {event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/events/${event.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-bold text-indriya-text dark:text-indriya-darkText bg-indriya-secondary dark:bg-indriya-darkSecondary transition-colors"
                      >
                        <Eye size={14} /> Manage
                      </Link>
                      <Link
                        to={`/events/${event.slug}/edit`}
                        className="p-2.5 rounded-lg transition-colors"
                        style={{ color: "#d97706", backgroundColor: "rgba(217,119,6,0.08)" }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2.5 rounded-lg transition-colors"
                        style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: POSTS ── */}
      {activeTab === "posts" && (
        <div
          className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[20px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 duration-300"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
        >
          <div className="px-6 py-4 border-b border-indriya-border dark:border-indriya-darkBorder flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-indriya-text dark:text-indriya-darkText">
              Blog Publications
            </h2>
            <Link
              to="/posts/create"
              className="flex items-center gap-1.5 text-white px-4 py-2 rounded-full text-[13px] font-bold transition-all hover:scale-[0.97]"
              style={{ backgroundColor: ACCENT, boxShadow: "0 4px 16px rgba(12,110,114,0.25)" }}
            >
              <Plus size={14} /> Write Post
            </Link>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-indriya-border dark:border-indriya-darkBorder bg-indriya-secondary/40 dark:bg-indriya-darkSecondary/40">
                  {["Title", "Author", "Published", ""].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 font-bold text-[11px] uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted ${h === "" ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indriya-border dark:divide-indriya-darkBorder">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(12,110,114,0.08)" }}
                      >
                        <FileText size={22} style={{ color: ACCENT }} />
                      </div>
                      <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
                        No posts yet
                      </p>
                      <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                        Publish your first article to see it here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-indriya-secondary dark:hover:bg-indriya-darkSecondary transition-colors">
                      <td className="px-6 py-4 font-semibold text-indriya-text dark:text-indriya-darkText max-w-[280px] truncate">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 text-indriya-muted dark:text-indriya-darkMuted">
                        {post.author?.fullName || "Admin"}
                      </td>
                      <td className="px-6 py-4">
                        {post.published === false ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full" style={{ backgroundColor: "rgba(217,119,6,0.1)", color: "#d97706" }}>
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669" }}>
                            Live
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/posts/${post.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-indriya-muted hover:bg-indriya-secondary dark:hover:bg-indriya-darkSecondary transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                            onMouseLeave={e => (e.currentTarget.style.color = "")}
                            title="View live"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/posts/${post.slug}/edit`}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#d97706", backgroundColor: "rgba(217,119,6,0.08)" }}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile: post cards ── */}
          <div className="md:hidden">
            {posts.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(12,110,114,0.08)" }}
                >
                  <FileText size={22} style={{ color: ACCENT }} />
                </div>
                <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
                  No posts yet
                </p>
                <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
                  Publish your first article to see it here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-indriya-border dark:divide-indriya-darkBorder">
                {posts.map((post) => (
                  <div key={post.id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-semibold text-indriya-text dark:text-indriya-darkText text-[14px] leading-snug">
                        {post.title}
                      </p>
                      {post.published === false ? (
                        <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ backgroundColor: "rgba(217,119,6,0.1)", color: "#d97706" }}>
                          Draft
                        </span>
                      ) : (
                        <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669" }}>
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted mb-3">
                      {post.author?.fullName || "Admin"} · {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/posts/${post.slug}`}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-bold text-indriya-text dark:text-indriya-darkText bg-indriya-secondary dark:bg-indriya-darkSecondary transition-colors"
                      >
                        <Eye size={14} /> View
                      </Link>
                      <Link
                        to={`/posts/${post.slug}/edit`}
                        className="p-2.5 rounded-lg transition-colors"
                        style={{ color: "#d97706", backgroundColor: "rgba(217,119,6,0.08)" }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2.5 rounded-lg transition-colors"
                        style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}