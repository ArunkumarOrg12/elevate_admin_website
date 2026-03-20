import { useState } from 'react';
import {
  Bell, Send, Trash2, CheckCheck, X, Inbox,
  Users, UserCog, Globe, Mail, BellRing, Loader2,
  CheckCircle2, Clock, AlertCircle, History, ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../constants/roles';
import {
  useNotificationInbox,
  useBroadcastNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useDeleteAllNotifications,
  useDeleteNotification,
  useBroadcastHistory,
  useAdminDeleteBroadcast,
  useAdminDeleteAllBroadcasts,
} from '../controllers/notificationsController';

/* ─────────────────────────── helpers ──────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TARGET_OPTIONS = [
  { value: 'all',      label: 'All Users',    icon: Globe,   desc: 'Every admin + student on the platform' },
  { value: 'students', label: 'All Students', icon: Users,   desc: 'Everyone with the student role' },
  { value: 'admins',   label: 'All Admins',   icon: UserCog, desc: 'College-admins & super-admins' },
  { value: 'specific', label: 'Specific IDs', icon: Mail,    desc: 'Comma-separated user IDs' },
];

const CHANNEL_OPTIONS = [
  { value: 'both',   label: 'In-app + Email' },
  { value: 'in-app', label: 'In-app only' },
  { value: 'email',  label: 'Email only' },
];

const TARGET_COLOR = {
  all:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  students: 'bg-blue-50 text-blue-700 border-blue-200',
  admins:   'bg-purple-50 text-purple-700 border-purple-200',
  specific: 'bg-gray-100 text-gray-700 border-gray-200',
};

/* ─────────────────────────── NotificationItem ─────────────────────────────── */
function NotificationItem({ notif, onRead, onDelete }) {
  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border transition-all group
        ${notif.is_read
          ? 'bg-white border-gray-100 hover:border-gray-200'
          : 'bg-indigo-50/60 border-indigo-100 hover:border-indigo-200'
        }`}
    >
      <div className="mt-1 flex-shrink-0">
        {notif.is_read
          ? <CheckCircle2 size={16} className="text-gray-300" />
          : <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${notif.is_read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
            {notif.title ?? notif.message}
          </p>
          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notif.is_read && (
              <button
                onClick={() => onRead(notif.id)}
                title="Mark as read"
                className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <CheckCheck size={14} />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              title="Delete"
              className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        {notif.title && notif.message && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <Clock size={11} className="text-gray-400" />
          <span className="text-[11px] text-gray-400">{timeAgo(notif.created_at)}</span>
          {notif.channel && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{notif.channel}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── BroadcastHistoryItem ─────────────────────────── */
function BroadcastHistoryItem({ item, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug truncate">{item.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              className={`text-[10px] h-4 px-1.5 border ${TARGET_COLOR[item.target] ?? TARGET_COLOR.specific}`}
            >
              {item.target === 'all' ? 'All Users'
                : item.target === 'students' ? 'Students'
                : item.target === 'admins' ? 'Admins'
                : 'Specific'}
            </Badge>
            {item.channel && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{item.channel}</Badge>
            )}
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(item.created_at)}
            </span>
          </div>
        </div>

        {/* Delete trigger */}
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            title="Retract from all users"
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        ) : (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => { onDelete(item.id); setConfirming(false); }}
              className="text-[11px] px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-[11px] px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── BroadcastPanel ───────────────────────────────── */
function BroadcastPanel() {
  const [panelTab, setPanelTab]     = useState('compose');  // 'compose' | 'history'
  const [target, setTarget]         = useState('all');
  const [channel, setChannel]       = useState('both');
  const [title, setTitle]           = useState('');
  const [message, setMessage]       = useState('');
  const [specificIds, setSpecificIds] = useState('');
  const [sent, setSent]             = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const broadcast            = useBroadcastNotification();
  const { data: historyData, isLoading: historyLoading } = useBroadcastHistory();
  const adminDeleteOne       = useAdminDeleteBroadcast();
  const adminDeleteAll       = useAdminDeleteAllBroadcasts();

  const history = historyData?.data ?? historyData?.broadcasts ?? [];
  const targetInfo = TARGET_OPTIONS.find(t => t.value === target);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    broadcast.mutate({
      target,
      title: title.trim(),
      message: message.trim(),
      channel,
      ...(target === 'specific' && {
        userIds: specificIds.split(',').map(s => s.trim()).filter(Boolean),
      }),
    }, {
      onSuccess: () => {
        setSent(true);
        setTitle('');
        setMessage('');
        setSpecificIds('');
        setTimeout(() => setSent(false), 3000);
        // Switch to history so admin can see the sent notification
        setPanelTab('history');
      },
    });
  };

  return (
    <Card className="p-5 h-fit sticky top-6">
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <BellRing size={15} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-gray-900">Broadcast</h2>
          <p className="text-xs text-gray-500">Send or manage notifications</p>
        </div>
      </div>

      {/* Compose / History tabs */}
      <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1 mb-5">
        {[
          { key: 'compose', label: 'Compose', icon: Send },
          { key: 'history', label: 'Sent', icon: History, count: history.length },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setPanelTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${panelTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon size={12} />
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-0.5 bg-indigo-600 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── COMPOSE TAB ── */}
      {panelTab === 'compose' && (
        <>
          {/* Target audience */}
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Audience</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {TARGET_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = target === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTarget(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all
                    ${active
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {target === 'specific' && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                User IDs <span className="text-gray-400">(comma-separated)</span>
              </label>
              <Input
                placeholder="user-id-1, user-id-2, ..."
                value={specificIds}
                onChange={e => setSpecificIds(e.target.value)}
                className="text-sm"
              />
            </div>
          )}

          {targetInfo && (
            <div className="flex items-center gap-1.5 mb-4 text-xs text-gray-500">
              <AlertCircle size={12} className="text-indigo-400 flex-shrink-0" />
              {targetInfo.desc}
            </div>
          )}

          <label className="block text-xs font-medium text-gray-700 mb-1.5">Channel</label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="mb-4 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHANNEL_OPTIONS.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(channel === 'email' || channel === 'both') && (
            <div className="flex items-start gap-2 mb-4 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
              <Mail size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                An email will be dispatched to each recipient's registered address.
                {target === 'students' && ' Only students will receive the email.'}
              </p>
            </div>
          )}

          <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
          <Input
            placeholder="Notification title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mb-4 text-sm"
          />

          <label className="block text-xs font-medium text-gray-700 mb-1.5">Message</label>
          <Textarea
            placeholder="Write your notification message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="mb-4 text-sm resize-none"
          />

          <Button
            className="w-full gap-2"
            onClick={handleSend}
            disabled={!title.trim() || !message.trim() || broadcast.isPending}
          >
            {broadcast.isPending
              ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
              : sent
              ? <><CheckCircle2 size={15} /> Sent!</>
              : <><Send size={15} /> Send Notification</>}
          </Button>

          {broadcast.isError && (
            <p className="mt-2 text-xs text-red-500 text-center">
              {broadcast.error?.response?.data?.message ?? 'Failed to send. Please try again.'}
            </p>
          )}
        </>
      )}

      {/* ── HISTORY TAB ── */}
      {panelTab === 'history' && (
        <>
          {/* Clear-all banner */}
          {history.length > 0 && (
            <div className="mb-3">
              {!confirmClearAll ? (
                <button
                  onClick={() => setConfirmClearAll(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-xs text-red-500 hover:bg-red-50 transition-all"
                >
                  <ShieldAlert size={13} />
                  Retract all from all users
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700 font-medium mb-2">
                    This will remove ALL broadcast notifications from every user's inbox. Are you sure?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 h-7 text-xs gap-1"
                      onClick={() => { adminDeleteAll.mutate(); setConfirmClearAll(false); }}
                      disabled={adminDeleteAll.isPending}
                    >
                      {adminDeleteAll.isPending
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Trash2 size={12} />}
                      Yes, retract all
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs"
                      onClick={() => setConfirmClearAll(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History list */}
          {historyLoading ? (
            <div className="flex justify-center py-10 text-gray-400">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <History size={28} className="text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">No broadcasts sent yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-0.5">
              {history.map(item => (
                <BroadcastHistoryItem
                  key={item.id}
                  item={item}
                  onDelete={(id) => adminDeleteOne.mutate(id)}
                />
              ))}
            </div>
          )}

          <div className="mt-4 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100">
            <ShieldAlert size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Deleting a broadcast removes it from <strong>all recipients' inboxes</strong>, not just your own.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

/* ─────────────────────────── Main Page ─────────────────────────────────────── */
export default function Notifications() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.COLLEGE_ADMIN;

  const [filter, setFilter] = useState('all');

  const { data, isLoading, isError } = useNotificationInbox(
    filter === 'unread' ? { unread: true } : undefined
  );

  const markAllRead = useMarkAllNotificationsRead();
  const markOneRead = useMarkNotificationRead();
  const deleteAll   = useDeleteAllNotifications();
  const deleteOne   = useDeleteNotification();

  const notifications = data?.data ?? data?.notifications ?? [];
  const unreadCount   = notifications.filter(n => !n.is_read).length;

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className={`grid gap-5 ${isAdmin ? 'lg:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
        {/* ── LEFT: Inbox ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1 mr-auto">
              {[
                { key: 'all',    label: 'All' },
                { key: 'unread', label: 'Unread' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
                    ${filter === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.label}
                  {tab.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 bg-indigo-600 text-white text-[10px] rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {notifications.length > 0 && (
              <>
                <Button
                  variant="outline" size="sm" className="text-xs gap-1.5"
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending || unreadCount === 0}
                >
                  {markAllRead.isPending
                    ? <Loader2 size={12} className="animate-spin" />
                    : <CheckCheck size={12} />}
                  Mark all read
                </Button>
                <Button
                  variant="outline" size="sm"
                  className="text-xs gap-1.5 text-red-500 hover:text-red-600 hover:border-red-300"
                  onClick={() => deleteAll.mutate()}
                  disabled={deleteAll.isPending}
                >
                  {deleteAll.isPending
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />}
                  Clear inbox
                </Button>
              </>
            )}
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-3 text-indigo-400" />
              <p className="text-sm">Loading notifications…</p>
            </div>
          )}

          {isError && !isLoading && (
            <Card className="flex flex-col items-center justify-center py-16">
              <AlertCircle size={32} className="text-red-400 mb-3" />
              <p className="text-sm text-gray-500">Failed to load notifications.</p>
            </Card>
          )}

          {!isLoading && !isError && notifications.length === 0 && (
            <Card className="flex flex-col items-center justify-center py-16">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <Inbox size={28} className="text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {filter === 'unread' ? 'No unread notifications' : 'Your inbox is empty'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {filter === 'unread'
                  ? 'Switch to "All" to see past messages.'
                  : 'Notifications will appear here once received.'}
              </p>
            </Card>
          )}

          {!isLoading && !isError && notifications.length > 0 && (
            <div className="space-y-2">
              {notifications.map(notif => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  onRead={(id) => markOneRead.mutate(id)}
                  onDelete={(id) => deleteOne.mutate(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Broadcast panel (admins only) ── */}
        {isAdmin && <BroadcastPanel />}
      </div>
    </div>
  );
}
