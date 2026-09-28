import React, { useState } from 'react';
import { X, Download, Copy, Check, Search, ExternalLink, Shield } from 'lucide-react';
import { FCFSEntry } from '../types';

interface AdminEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: FCFSEntry[];
}

export const AdminEntriesModal: React.FC<AdminEntriesModalProps> = ({ isOpen, onClose, entries }) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = entries.filter((e) =>
    e.xHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.evmAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    const header = ['ID', 'X Handle', 'Retweet Link', 'EVM Wallet Address', 'Date Submitted', 'Status'];
    const rows = entries.map((e) => [
      e.id,
      e.xHandle,
      e.retweetLink,
      e.evmAddress,
      new Date(e.timestamp).toISOString(),
      e.status,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `funky_buddies_fcfs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySheets = () => {
    let tsv = 'X Handle\tRetweet Link\tEVM Wallet Address\tDate Submitted\n';
    entries.forEach((e) => {
      tsv += `${e.xHandle}\t${e.retweetLink}\t${e.evmAddress}\t${new Date(e.timestamp).toLocaleString()}\n`;
    });

    navigator.clipboard.writeText(tsv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141225] border-2 border-[#9B87F5] rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl text-[#F6F2FF] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#2c2650] flex items-center justify-between bg-[#1c1932]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9B87F5]/20 text-[#9B87F5] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Silkscreen'] text-lg text-[#FFD469]">
                FCFS Registered Submissions
              </h3>
              <p className="text-xs text-[#c9c2e0]">
                Private Owner Portal &bull; Total Entries: <strong>{entries.length}</strong> / 1,999 Total Supply
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#F6F2FF]" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 sm:p-6 border-b border-[#2c2650] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141225]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#c9c2e0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search handle or EVM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1c1932] border border-[#2c2650] text-[#F6F2FF] outline-none focus:border-[#9B87F5]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopySheets}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#9B87F5] text-[#141225] font-bold text-xs hover:bg-[#b09ff8] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Sheets Format!' : 'Copy for Google Sheets'}
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD469] text-[#141225] font-bold text-xs hover:bg-[#ffe08a] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="rounded-xl border border-[#2c2650] overflow-hidden bg-[#1c1932]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#241f42] text-[#77E0B0] font-['Silkscreen'] uppercase text-[10px] tracking-wider border-b border-[#2c2650]">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">X Username</th>
                  <th className="p-3.5">Retweet Link</th>
                  <th className="p-3.5">EVM Address</th>
                  <th className="p-3.5">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c2650]/60">
                {filtered.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-mono text-[#c9c2e0]">{index + 1}</td>
                    <td className="p-3.5 font-semibold text-[#FFD469]">
                      <a
                        href={`https://x.com/${entry.xHandle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        @{entry.xHandle}
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    </td>
                    <td className="p-3.5 max-w-[180px] truncate text-[#7EC8F0]">
                      <a
                        href={entry.retweetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline truncate block"
                        title={entry.retweetLink}
                      >
                        {entry.retweetLink}
                      </a>
                    </td>
                    <td className="p-3.5 font-mono text-neutral-300">
                      <code>{entry.evmAddress}</code>
                    </td>
                    <td className="p-3.5 text-neutral-400 font-mono text-[11px]">
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-400">
                      No matching submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-[#1c1932] border-t border-[#2c2650] flex items-center justify-between text-xs text-[#c9c2e0]">
          <div>Data is securely saved in browser storage and synchronized with your Python backend.</div>
          <button
            onClick={onClose}
            className="font-bold text-[#FFD469] hover:underline"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
