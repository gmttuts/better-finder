// Docs (docs.html): every section in English and Vietnamese. Checked against the apps (mediaindex/: Mac CHANGELOG.json,
// desktop/CHANGELOG.json, PARITY.md, entitlements.rs). Don't add a claim the apps don't back up; no long dashes.
// Keyboard shortcuts come from data/shortcuts.js (scripts/gen-docs-shortcuts.py), drawn by docs.js into [data-keys].
(() => {
  const k = (...keys) => keys.map((x) => `<kbd>${x}</kbd>`).join(" ");
  const PRO = `<span class="pro-badge">PRO</span>`;
  const mac = `<span class="os-tag">Mac</span>`;
  const win = `<span class="os-tag">Windows / Linux</span>`;
  const note = (s) => `<p class="doc-note">${s}</p>`;

  window.DOCS = {
    // Which app versions this guide follows (shown at the top).
    versions: { mac: "0.351", desktop: "0.3.0" },
    ui: {
      title: { en: "Docs", vi: "Tài liệu" },
      lead: { en: "How to use Better Explora on Mac, Windows and Linux, and what it can't do.",
              vi: "Cách dùng Better Explora trên Mac, Windows và Linux, và những gì app chưa làm được." },
      follows: { en: "This guide follows Better Explora {mac} for Mac and {desktop} for Windows and Linux.",
                 vi: "Tài liệu này theo Better Explora {mac} cho Mac và {desktop} cho Windows và Linux." },
      search: { en: "Search the docs", vi: "Tìm trong tài liệu" },
      contents: { en: "Contents", vi: "Mục lục" },
      noHits: { en: "Nothing found. Try another word.", vi: "Không tìm thấy. Thử từ khác." },
      hits: { en: "{n} results", vi: "{n} kết quả" },
      keysMac: { en: "Mac", vi: "Mac" },
      keysDesk: { en: "Windows and Linux", vi: "Windows và Linux" },
      keysFixed: { en: "fixed", vi: "cố định" },
      keysNone: { en: "none", vi: "chưa có" },
      top: { en: "Back to top", vi: "Lên đầu trang" },
      groups: {
        File: "Tệp", Edit: "Sửa", View: "Xem", Workspace: "Workspace", Go: "Đi tới", "Rating & Label": "Sao và nhãn màu",
        "In the file list": "Trong danh sách file", Player: "Player", "In the player's queue": "Trong hàng chờ của player", App: "App",
      },
    },

    sections: [
      // ------------------------------------------------------------------ Getting started
      { id: "getting-started", icon: "🚀", t: { en: "Getting started", vi: "Bắt đầu" },
        en: `
<h3 id="install-mac">Install on Mac</h3>
<p>macOS 13 Ventura or later, Apple silicon or Intel.</p>
<ol>
<li>Download the .dmg from the <a href="index.html#install">download section</a>, open it and drag Better Explora into Applications.</li>
<li>The app isn't notarized by Apple, so macOS blocks the first launch. On macOS 15 or later: open the app once, then System Settings ▸ Privacy &amp; Security, scroll down and click <b>Open Anyway</b>. On macOS 13 and 14: Control-click the app ▸ Open.</li>
<li>If macOS says the app is “damaged”, run this in Terminal and open it again: <code>xattr -dr com.apple.quarantine "/Applications/Better Explora.app"</code></li>
</ol>
<h3 id="install-windows">Install on Windows</h3>
<p>Windows 10 or 11, 64-bit. Run the installer (.exe). If SmartScreen says “Windows protected your PC”, click <b>More info</b> ▸ <b>Run anyway</b>: the app isn't signed with a paid certificate. FFmpeg comes with the installer.</p>
<h3 id="install-linux">Install on Linux</h3>
<p>x86-64, Ubuntu 22.04 or later, Fedora and others. Use the AppImage (make it executable: Properties ▸ Allow executing, or <code>chmod +x</code>, then open it) or the .deb for Ubuntu and Debian, which installs FFmpeg with it. The AppImage uses your system's FFmpeg and bsdtar: install them first (for example <code>sudo apt install ffmpeg libarchive-tools</code>).</p>
<h3 id="first-run">First run</h3>
<p>A short welcome helps you set things up: pick a style (macOS, Windows 11 or Linux GNOME) and, on Mac, a Workspace, bring Finder's sidebar over (Mac), choose whether folders open in Better Explora (Mac and Windows), download the Visual Search and Whisper models if you want them, and see what Free and Pro include. Skip closes it at any step, and everything in it is also in Settings. Open it again with Help ▸ Welcome to Better Explora… ${mac} or right-click an empty spot ▸ Welcome to Better Explora… ${win}.</p>
<p>Better Explora moves, renames and deletes real files, just like Finder or Explorer. Try it on a copy of a folder first.</p>
<h3 id="permissions">Permissions on Mac</h3>
<ul>
<li>When macOS asks for access to Desktop, Documents, Downloads or an external drive, click <b>Allow</b>.</li>
<li>macOS never asks for <b>Full Disk Access</b> by itself. Better Explora needs it to show the Trash, read Finder's sidebar and open some protected folders: System Settings ▸ Privacy &amp; Security ▸ Full Disk Access ▸ <b>+</b> ▸ Better Explora, switch it on, then quit and reopen Better Explora.</li>
<li>To make “Show in Finder” in other apps open Better Explora, use Settings ▸ Windows &amp; Sidebar. Right-click ▸ Open in macOS Finder still opens the real Finder.</li>
</ul>
<h3 id="extras">Optional extras on Mac</h3>
<p>Better Explora plays most video without anything else. MKV, WebM, AVI and a few other jobs need FFmpeg; the app tells you when. Install it with <a href="https://brew.sh" rel="noopener">Homebrew</a>: <code>brew install ffmpeg</code>. For Whisper transcripts on Mac, install <code>brew install whisper-cpp</code> and download a model in Settings ▸ Transcribe (on macOS 26, macOS Speech works without either).</p>
<h3 id="updates">Updates</h3>
<ul>
<li>${mac} The app checks for a new version at most once a day (Settings ▸ Updates; Better Explora ▸ Check for Updates… checks now). Download the new .dmg and drag the app into Applications, choosing Replace. Your settings are kept. macOS may block the new version once, like the first install.</li>
<li>${win} The Windows app and the Linux AppImage update themselves. With the .deb, download the new package.</li>
</ul>
<h3 id="remove">Remove Better Explora</h3>
<p>${mac} Delete the app from Applications, then the folder <code>~/.mediaindex</code> (index, thumbnails, transcripts, models) and <code>~/Library/Preferences/local.mediafinder.app.plist</code> (settings).</p>
<p>${win} Uninstall it like any other app (Windows: Settings ▸ Apps; Linux: delete the AppImage or remove the .deb package).</p>
<h3 id="feedback">Suggest a feature or report a bug</h3>
<p>Post an idea or a problem on the <a href="feedback.html">feedback board</a>, and vote for the ideas you want most. The Roadmap there shows what is planned.</p>`,
        vi: `
<h3 id="install-mac">Cài trên Mac</h3>
<p>macOS 13 Ventura trở lên, chip Apple hoặc Intel.</p>
<ol>
<li>Tải file .dmg ở <a href="index.html#install">mục tải về</a>, mở ra và kéo Better Explora vào Applications.</li>
<li>App chưa được Apple notarize nên macOS chặn lần mở đầu. macOS 15 trở lên: mở app một lần, rồi vào System Settings ▸ Privacy &amp; Security, cuộn xuống và bấm <b>Open Anyway</b>. macOS 13 và 14: Control-click vào app ▸ Open.</li>
<li>Nếu macOS báo app “damaged”, chạy dòng này trong Terminal rồi mở lại: <code>xattr -dr com.apple.quarantine "/Applications/Better Explora.app"</code></li>
</ol>
<h3 id="install-windows">Cài trên Windows</h3>
<p>Windows 10 hoặc 11, 64-bit. Chạy bộ cài (.exe). Nếu SmartScreen báo “Windows protected your PC”, bấm <b>More info</b> ▸ <b>Run anyway</b>: app chưa ký bằng chứng chỉ trả phí. Bộ cài có sẵn FFmpeg.</p>
<h3 id="install-linux">Cài trên Linux</h3>
<p>x86-64, Ubuntu 22.04 trở lên, Fedora và các bản khác. Dùng AppImage (cho phép chạy: Properties ▸ Allow executing, hoặc <code>chmod +x</code>, rồi mở) hoặc gói .deb cho Ubuntu và Debian, gói này cài kèm FFmpeg. AppImage dùng FFmpeg và bsdtar của hệ thống: hãy cài trước (ví dụ <code>sudo apt install ffmpeg libarchive-tools</code>).</p>
<h3 id="first-run">Lần mở đầu</h3>
<p>Một màn chào ngắn giúp bạn thiết lập: chọn kiểu giao diện (macOS, Windows 11 hoặc Linux GNOME) và Workspace (Mac), lấy thanh bên của Finder (Mac), chọn có mở thư mục bằng Better Explora không (Mac và Windows), tải model Visual Search và Whisper nếu muốn, và xem bản Free và Pro có gì. Bấm Skip để đóng ở bất kỳ bước nào; mọi thứ trong đó đều có trong Settings. Mở lại bằng Help ▸ Welcome to Better Explora… ${mac} hoặc chuột phải chỗ trống ▸ Welcome to Better Explora… ${win}.</p>
<p>Better Explora di chuyển, đổi tên và xoá file thật, giống Finder hay Explorer. Lần đầu nên thử trên một thư mục copy.</p>
<h3 id="permissions">Quyền truy cập trên Mac</h3>
<ul>
<li>Khi macOS hỏi quyền vào Desktop, Documents, Downloads hay ổ ngoài, bấm <b>Allow</b>.</li>
<li>macOS không tự hỏi quyền <b>Full Disk Access</b>. Better Explora cần quyền này để xem Thùng rác, đọc thanh bên của Finder và mở một số thư mục được bảo vệ: System Settings ▸ Privacy &amp; Security ▸ Full Disk Access ▸ <b>+</b> ▸ Better Explora, bật lên, rồi thoát và mở lại Better Explora.</li>
<li>Muốn “Show in Finder” ở app khác mở Better Explora: Settings ▸ Windows &amp; Sidebar. Chuột phải ▸ Open in macOS Finder vẫn mở Finder thật.</li>
</ul>
<h3 id="extras">Cài thêm (tuỳ chọn) trên Mac</h3>
<p>Better Explora phát được phần lớn video mà không cần gì thêm. MKV, WebM, AVI và vài việc khác cần FFmpeg; app sẽ báo khi cần. Cài bằng <a href="https://brew.sh" rel="noopener">Homebrew</a>: <code>brew install ffmpeg</code>. Muốn tạo transcript bằng Whisper trên Mac, cài <code>brew install whisper-cpp</code> và tải model trong Settings ▸ Transcribe (trên macOS 26, macOS Speech chạy được mà không cần hai thứ này).</p>
<h3 id="updates">Cập nhật</h3>
<ul>
<li>${mac} App kiểm bản mới tối đa mỗi ngày một lần (Settings ▸ Updates; Better Explora ▸ Check for Updates… để kiểm ngay). Tải file .dmg mới, kéo app vào Applications và chọn Replace. Thiết lập được giữ nguyên. macOS có thể chặn bản mới một lần, như lúc cài đầu.</li>
<li>${win} App Windows và AppImage trên Linux tự cập nhật. Dùng gói .deb thì tải gói mới.</li>
</ul>
<h3 id="remove">Gỡ Better Explora</h3>
<p>${mac} Xoá app trong Applications, rồi xoá thư mục <code>~/.mediaindex</code> (chỉ mục, thumbnail, transcript, model) và file <code>~/Library/Preferences/local.mediafinder.app.plist</code> (thiết lập).</p>
<p>${win} Gỡ như mọi app khác (Windows: Settings ▸ Apps; Linux: xoá file AppImage hoặc gỡ gói .deb).</p>
<h3 id="feedback">Góp ý tính năng hoặc báo lỗi</h3>
<p>Gửi ý tưởng hoặc lỗi gặp phải lên <a href="feedback.html">trang góp ý</a>, và bình chọn cho những ý tưởng bạn muốn nhất. Mục Roadmap ở đó cho biết những gì đã lên kế hoạch.</p>` },

      // ------------------------------------------------------------------ Browsing
      { id: "browsing", icon: "🗂", t: { en: "Browsing", vi: "Duyệt file" },
        en: `
<h3 id="views">Views</h3>
<p>Four views, in Finder's order: Grid (Large icons on Windows / Linux), List (Details), Columns and Gallery. Mac: ${k("⌘1")} Grid, ${k("⌘2")} List, ${k("⌘3")} Columns, ${k("⌘4")} Gallery. Windows / Linux: ${k("Ctrl+Shift+1")} Large icons, ${k("Ctrl+Shift+2")} Details, ${k("Ctrl+Shift+3")} Columns, ${k("Ctrl+Shift+4")} Gallery.</p>
<ul>
<li>Hover over a video, GIF, Lottie or Rive file in Grid to scrub through it without opening it.</li>
<li>View Options (${k("⌘J")} / ${k("Ctrl+J")}) keep a view, sort, icon size, columns and background for one folder.</li>
<li>Right-click a List column header to show or hide columns; drag to reorder and resize. The AI, FPS and Aspect Ratio columns are ${PRO}. Group By and Sort By work in every view.</li>
</ul>
<h3 id="tabs-panes">Tabs and panes</h3>
<ul>
<li>New tab ${k("⌘T")} / ${k("Ctrl+T")}, close ${k("⌘W")} / ${k("Ctrl+W")}.</li>
<li>Split the window into panes: ${k("⌘\\")} split right, ${k("⌥⌘\\")} split down ${mac}; ${k("Ctrl+\\")} ${win}. Drag a tab to the edge of a pane to split there, onto another pane to move it, or out of the window to open a new window.</li>
<li>Click a tab bar, then press ${k("1")} to ${k("9")} (and ${k("0")}) for that pane's 1st to 10th tab (Settings ▸ Windows &amp; Sidebar on Mac, Windows, Tabs &amp; Sidebar on Windows, Tabs &amp; Sidebar on Linux).</li>
<li>Workspaces save the List columns, view, number of panes and sidebar: Window ▸ Workspace or ${k("⌥⌘1")}…${k("⌥⌘9")} ${mac}, ${k("Alt+1")}…${k("Alt+9")} ${win}. Standard is free; the other Workspaces and saving new ones are ${PRO}.</li>
</ul>
<h3 id="sidebar">Sidebar</h3>
<p>Favorites, drives, tags, playlists (one free, more with ${PRO}) and Smart Folders. On Mac it can follow Finder's own Favorites and tags (Settings ▸ Windows &amp; Sidebar). Drag a folder in to add it; drop files on a tag to tag them. Hide it with ${k("⌃⌘S")} / ${k("Ctrl+Shift+S")}.</p>
<ul>
<li>Groups fold: click a group's name (Favorites, Locations, Tags, Playlists, Smart Folders) to open or close it. The Mac remembers this for each window, Windows and Linux for each pane.</li>
<li>Make your own groups: right-click a group's name ▸ New Group…, then drag folders onto it. Rename, hide or delete a group from the same menu, and drag a group's name to move it. Your folders are never moved.</li>
<li>The Drop Zone at the bottom of the sidebar collects files from anywhere (the file list, Finder or Explorer, other apps) without moving them: it only keeps a note of where they are, also after you quit. Drag the stack out to a folder, a pane or another app to copy or move the files, as the Copy | Move switch under it says. On Mac hold ${k("⌥")} for the other one; on Windows and Linux ${k("Ctrl")} copies and ${k("Shift")} moves. Show List shows each file (Space for Quick Look); right-click the stack for Copy to, Move to, Reveal Originals and Clear; the bolt button ${PRO} offers Compress, Transcribe, To JPG, Remove Background, Zip and Email (and AirDrop on Mac). Hide it with View ▸ Hide Drop Zone (${k("⌃⌘B")} / ${k("Ctrl+Shift+B")}).</li>
</ul>
<h3 id="chips">Filter chips</h3>
<p>The chip bar above the files filters by type: Video, Images, Audio, Motion, 3D, Projects &amp; Design, Archives and more. Click a chip to filter; ${k("⌘")}-click (Mac) or ${k("Ctrl")}-click (Windows / Linux) to pick several. Right-click a chip to rename it, change its colour or hide it; right-click the bar for chip style, layout and order. Settings ▸ File Types decides which extensions go in each chip.</p>
<h3 id="search">Search</h3>
<p>One search palette finds files everywhere. ${k("⌘K")} / ${k("Ctrl+K")} searches everywhere; ${k("⌘F")} / ${k("Ctrl+F")} or the toolbar's Search opens it on the folder you are in (Delete takes the folder away); ${k("⌥⌘F")} / ${k("Ctrl+Shift+F")} opens its Advanced tab. Three tabs sit under the search field: Search, Visual and Advanced (${k("⌘1")} ${k("⌘2")} ${k("⌘3")} / ${k("Ctrl+1")} ${k("Ctrl+2")} ${k("Ctrl+3")}); what you typed comes along.</p>
<ul>
<li><b>Search</b>: names show as you type, from a name index of your Home folder kept on your computer and updated as files change. Typos and missing accents still match (“invq4” finds invoice_Q4_final.pdf, “khach hang” finds “Khách hàng”). Below the names come tags, spoken words in your clips and, on Mac, text inside documents (Spotlight).</li>
<li>Chips narrow a search: <code>kind:video</code>, <code>ext:mov,mp4</code>, <code>tag:Red</code>, <code>in:Animation</code>, <code>color:pink</code> ${PRO}. Type <code>said:</code> (or <code>transcript:</code>) to search only what is said in your clips: every sentence is listed under its clip with its time, and Return plays the clip from there.</li>
<li>${k("⌘S")} / ${k("Ctrl+S")} saves the search as a Smart Folder, ${k("⌘↩")} / ${k("Ctrl+Enter")} shows every match in the window, and ${k("⌘K")} / ${k("Ctrl+K")} on a result lists what you can do with it (Open With, Reveal, Copy Path, Add to Drop Zone, Transcribe, Compress and more).</li>
<li>Type a path such as <code>~/Doc/kh</code> to go to a folder: each part is matched on its own. Tab completes it, Return opens it. Go to Folder (${k("⇧⌘G")} / ${k("Ctrl+Shift+G")}) opens the palette with <code>~/</code> typed.</li>
<li>External drives: plug one in and the palette offers to index it; one click and its files show up as you type, each time it connects. Settings ▸ Search ▸ Index drives when they connect does this for every drive, and each drive has its own tick so you can leave some out.</li>
<li><b>Visual</b> ${PRO}: type what a picture shows (“drone shot over the beach”) to find pictures and clips by what they show, with where in the clip. Paste or drop a picture to find ones like it; right-click a file ▸ Find Similar ${PRO} does the same. Runs on your computer after a one-time model download (Settings ▸ Visual Search). English words work best.</li>
<li>Colour ${PRO}: in the Visual tab, click one of 12 named colours or Custom… to find pictures and clips by colour, with how much of each one is that colour. Click two colours to find both. The eyedropper (${k("⌘E")} on Mac) takes a colour from anywhere on screen. No AI model needed: colours are read in the background as folders open.</li>
<li><b>Advanced</b>: conditions in groups that fold (File, Frame, Media, Project, Also), such as name, kind, size, date, ratio, frame size, rating, tags, project uses and missing media ${PRO}, and only duplicates. Results show live under the groups. Ask AI ${PRO} turns a sentence into conditions, typed or spoken with 🎙 (needs your own AI key in Settings ▸ AI Services).</li>
</ul>
<h3 id="recents">Recents</h3>
<p>Recents lists the files you opened lately, newest first. On Mac, new windows open on Recents, like Finder (Settings ▸ Windows &amp; Sidebar); Go ▸ Recents or ${k("⇧⌘F")}, and Go ▸ Recent Folders. On Windows and Linux, Recents is the first row of the sidebar (${k("Ctrl+Shift+R")}): it shows local files opened in the last 30 days, as Windows or Linux recorded them. Recent Folders is in the menu you get by right-clicking empty space.</p>
<h3 id="organize">Organize</h3>
<ul>
<li>Colour tags, star ratings (${k("⌃0")}…${k("⌃5")} Mac, ${k("Ctrl+0")}…${k("Ctrl+5")} Windows / Linux) and colour labels that Bridge, Lightroom and Premiere read too (stored in the file or a .xmp next to it).</li>
<li>Tidy Up by Type, Flatten and New Folder with Selection (right-click ▸ Organize on Windows / Linux; ${k("⌃⌘K")}, ${k("⌃⌘J")} and ${k("⌃⌘N")} on Mac).</li>
<li>Version stacks ${PRO}: logo_v1, logo_v2 and logo_v03_final show as one item with “3 versions”.</li>
<li>Sidecar files (.srt, .xmp, GoPro and DJI .LRV / .THM, Premiere proxies) move, rename and delete with their media, with one Undo.</li>
<li>Undo and Redo: ${k("⌘Z")} / ${k("⇧⌘Z")} on Mac, ${k("Ctrl+Z")} / ${k("Ctrl+Y")} on Windows / Linux.</li>
<li>Your notes are kept: transcripts, tags and ratings stay when a drive or folder can't be read for a moment; only files that are really gone leave the library. Trim, Export and Remove Audio never replace the original clip.</li>
</ul>
<h3 id="cloud-network">Cloud and network drives</h3>
<p>Files that live only in the cloud (Dropbox, iCloud, Google Drive, OneDrive “online only”) are never downloaded just because you browse or hover; opening or playing one downloads it, like Finder. Network drives (SMB, NFS) are read in one go and media details only for the files on screen; the status bar says “Network drive”.</p>`,
        vi: `
<h3 id="views">Chế độ xem</h3>
<p>Bốn chế độ, theo thứ tự của Finder: Grid (Large icons trên Windows / Linux), List (Details), Columns và Gallery. Mac: ${k("⌘1")} Grid, ${k("⌘2")} List, ${k("⌘3")} Columns, ${k("⌘4")} Gallery. Windows / Linux: ${k("Ctrl+Shift+1")} Large icons, ${k("Ctrl+Shift+2")} Details, ${k("Ctrl+Shift+3")} Columns, ${k("Ctrl+Shift+4")} Gallery.</p>
<ul>
<li>Rê chuột trên video, GIF, Lottie hay Rive trong Grid để xem lướt mà không cần mở.</li>
<li>View Options (${k("⌘J")} / ${k("Ctrl+J")}) giữ chế độ xem, cách sắp xếp, cỡ icon, cột và nền cho riêng một thư mục.</li>
<li>Chuột phải vào tiêu đề cột của List để bật / tắt cột; kéo để đổi thứ tự và độ rộng. Các cột AI, FPS và Aspect Ratio là ${PRO}. Group By và Sort By có ở mọi chế độ.</li>
</ul>
<h3 id="tabs-panes">Tab và khung (pane)</h3>
<ul>
<li>Tab mới ${k("⌘T")} / ${k("Ctrl+T")}, đóng tab ${k("⌘W")} / ${k("Ctrl+W")}.</li>
<li>Chia cửa sổ thành nhiều khung: ${k("⌘\\")} chia sang phải, ${k("⌥⌘\\")} chia xuống dưới ${mac}; ${k("Ctrl+\\")} ${win}. Kéo tab vào mép một khung để chia ở đó, thả lên khung khác để chuyển sang, hoặc kéo ra ngoài để mở cửa sổ mới.</li>
<li>Bấm vào hàng tab rồi nhấn ${k("1")} đến ${k("9")} (và ${k("0")}) để sang tab thứ 1 đến 10 của khung đó (Settings ▸ Windows &amp; Sidebar trên Mac, Windows, Tabs &amp; Sidebar trên Windows, Tabs &amp; Sidebar trên Linux).</li>
<li>Workspace lưu cột của List, chế độ xem, số khung và thanh bên: Window ▸ Workspace hoặc ${k("⌥⌘1")}…${k("⌥⌘9")} ${mac}, ${k("Alt+1")}…${k("Alt+9")} ${win}. Standard là miễn phí; các workspace khác và lưu workspace mới là ${PRO}.</li>
</ul>
<h3 id="sidebar">Thanh bên</h3>
<p>Mục yêu thích, ổ đĩa, tag, playlist (một playlist miễn phí, nhiều hơn cần ${PRO}) và Smart Folder. Trên Mac, thanh bên có thể theo Favorites và tag của Finder (Settings ▸ Windows &amp; Sidebar). Kéo thư mục vào để thêm; thả file lên tag để gắn tag. Ẩn bằng ${k("⌃⌘S")} / ${k("Ctrl+Shift+S")}.</p>
<ul>
<li>Các nhóm thu gọn được: bấm vào tên nhóm (Favorites, Locations, Tags, Playlists, Smart Folders) để mở hoặc đóng. Mac nhớ việc này cho từng cửa sổ, Windows và Linux cho từng khung.</li>
<li>Tự tạo nhóm: chuột phải vào tên một nhóm ▸ New Group…, rồi kéo thư mục vào. Đổi tên, ẩn hoặc xoá nhóm trong cùng menu đó, và kéo tên nhóm để đổi chỗ. Thư mục của bạn không bao giờ bị di chuyển.</li>
<li>Drop Zone ở cuối thanh bên gom file từ mọi nơi (danh sách file, Finder hay Explorer, app khác) mà không di chuyển chúng: app chỉ ghi nhớ file nằm ở đâu, kể cả sau khi thoát app. Kéo cả chồng ra một thư mục, một khung hoặc app khác để chép hoặc chuyển file, theo công tắc Copy | Move bên dưới. Trên Mac giữ ${k("⌥")} để làm việc còn lại; trên Windows và Linux ${k("Ctrl")} là chép, ${k("Shift")} là chuyển. Show List hiện từng file (Space để Quick Look); chuột phải vào chồng file để có Copy to, Move to, Reveal Originals và Clear; nút tia sét ${PRO} có Compress, Transcribe, To JPG, Remove Background, Zip và Email (và AirDrop trên Mac). Ẩn bằng View ▸ Hide Drop Zone (${k("⌃⌘B")} / ${k("Ctrl+Shift+B")}).</li>
</ul>
<h3 id="chips">Chip lọc</h3>
<p>Thanh chip phía trên danh sách lọc theo loại file: Video, Images, Audio, Motion, 3D, Projects &amp; Design, Archives và các loại khác. Bấm chip để lọc; ${k("⌘")}-bấm (Mac) hoặc ${k("Ctrl")}-bấm (Windows / Linux) để chọn nhiều. Chuột phải vào chip để đổi tên, đổi màu hoặc ẩn; chuột phải vào thanh chip để chỉnh kiểu, bố cục và thứ tự. Settings ▸ File Types quyết định đuôi file nào thuộc chip nào.</p>
<h3 id="search">Tìm kiếm</h3>
<p>Một bảng tìm kiếm (search palette) tìm file ở mọi nơi. ${k("⌘K")} / ${k("Ctrl+K")} tìm khắp máy; ${k("⌘F")} / ${k("Ctrl+F")} hoặc nút Search trên thanh công cụ mở bảng này cho thư mục đang xem (Delete để bỏ thư mục, tìm khắp máy); ${k("⌥⌘F")} / ${k("Ctrl+Shift+F")} mở thẳng tab Advanced. Dưới ô tìm có ba tab: Search, Visual và Advanced (${k("⌘1")} ${k("⌘2")} ${k("⌘3")} / ${k("Ctrl+1")} ${k("Ctrl+2")} ${k("Ctrl+3")}); chữ đã gõ được giữ khi đổi tab.</p>
<ul>
<li><b>Search</b>: tên file hiện ngay khi gõ, lấy từ chỉ mục tên của thư mục Home, lưu trên máy và tự cập nhật khi file thay đổi. Gõ sai hay thiếu dấu vẫn ra (“invq4” ra invoice_Q4_final.pdf, “khach hang” ra “Khách hàng”). Bên dưới tên là tag, lời nói trong clip và, trên Mac, chữ bên trong tài liệu (Spotlight).</li>
<li>Chip thu hẹp kết quả: <code>kind:video</code>, <code>ext:mov,mp4</code>, <code>tag:Red</code>, <code>in:Animation</code>, <code>color:pink</code> ${PRO}. Gõ <code>said:</code> (hoặc <code>transcript:</code>) để chỉ tìm trong lời nói của clip: từng câu hiện dưới clip của nó kèm thời điểm, Return phát clip từ câu đó.</li>
<li>${k("⌘S")} / ${k("Ctrl+S")} lưu lần tìm thành Smart Folder, ${k("⌘↩")} / ${k("Ctrl+Enter")} hiện mọi kết quả trong cửa sổ, và ${k("⌘K")} / ${k("Ctrl+K")} trên một kết quả liệt kê các việc làm được với nó (Open With, Reveal, Copy Path, Add to Drop Zone, Transcribe, Compress và các việc khác).</li>
<li>Gõ một đường dẫn như <code>~/Doc/kh</code> để tới thư mục: mỗi phần được so khớp riêng. Tab để điền nốt, Return để mở. Go to Folder (${k("⇧⌘G")} / ${k("Ctrl+Shift+G")}) mở bảng tìm với sẵn <code>~/</code>.</li>
<li>Ổ ngoài: cắm ổ vào là bảng tìm đề nghị lập chỉ mục cho nó; bấm một lần là file trong ổ hiện ra khi gõ, mỗi lần ổ được cắm. Settings ▸ Search ▸ Index drives when they connect làm việc này cho mọi ổ, và mỗi ổ có ô tick riêng để bỏ bớt.</li>
<li><b>Visual</b> ${PRO}: gõ thứ có trong hình (“drone shot over the beach”) để tìm ảnh và clip theo nội dung hình, kèm vị trí trong clip. Dán hoặc thả một ảnh vào để tìm ảnh giống nó; chuột phải vào file ▸ Find Similar ${PRO} cũng vậy. Chạy ngay trên máy sau khi tải model một lần (Settings ▸ Visual Search). Gõ tiếng Anh cho kết quả tốt nhất.</li>
<li>Màu sắc ${PRO}: trong tab Visual, bấm một trong 12 màu có tên hoặc Custom… để tìm ảnh và clip theo màu, kèm tỉ lệ màu đó trong mỗi hình. Bấm hai màu để tìm hình có cả hai. Ống hút màu (${k("⌘E")} trên Mac) lấy màu từ bất kỳ đâu trên màn hình. Không cần model AI: màu được đọc ở chế độ nền khi bạn mở thư mục.</li>
<li><b>Advanced</b>: điều kiện xếp trong các nhóm thu gọn được (File, Frame, Media, Project, Also), như tên, loại, dung lượng, ngày, tỉ lệ khung, kích thước khung hình, sao, tag, project dùng file nào và media thiếu ${PRO}, và chỉ file trùng. Kết quả hiện ngay bên dưới. Ask AI ${PRO} biến một câu thành điều kiện, gõ hoặc nói bằng 🎙 (cần API key của bạn trong Settings ▸ AI Services).</li>
</ul>
<h3 id="recents">Recents</h3>
<p>Recents liệt kê các file mở gần đây, mới nhất ở trên. Trên Mac, cửa sổ mới mở vào Recents, giống Finder (Settings ▸ Windows &amp; Sidebar); Go ▸ Recents hoặc ${k("⇧⌘F")}, và Go ▸ Recent Folders. Trên Windows và Linux, Recents là dòng đầu của thanh bên (${k("Ctrl+Shift+R")}): hiện các file trên máy đã mở trong 30 ngày qua, theo ghi nhận của Windows hoặc Linux. Recent Folders nằm trong menu khi chuột phải vào chỗ trống.</p>
<h3 id="organize">Sắp xếp file</h3>
<ul>
<li>Tag màu, sao (${k("⌃0")}…${k("⌃5")} trên Mac, ${k("Ctrl+0")}…${k("Ctrl+5")} trên Windows / Linux) và nhãn màu mà Bridge, Lightroom, Premiere cũng đọc được (lưu trong file hoặc file .xmp cạnh nó).</li>
<li>Tidy Up by Type, Flatten và New Folder with Selection (chuột phải ▸ Organize trên Windows / Linux; ${k("⌃⌘K")}, ${k("⌃⌘J")} và ${k("⌃⌘N")} trên Mac).</li>
<li>Gộp phiên bản ${PRO}: logo_v1, logo_v2 và logo_v03_final hiện thành một mục kèm “3 versions”.</li>
<li>File đi kèm (.srt, .xmp, .LRV / .THM của GoPro và DJI, proxy Premiere) di chuyển, đổi tên và xoá theo media, một lần Undo là trả lại hết.</li>
<li>Hoàn tác: ${k("⌘Z")} / ${k("⇧⌘Z")} trên Mac, ${k("Ctrl+Z")} / ${k("Ctrl+Y")} trên Windows / Linux.</li>
<li>Ghi chú của bạn được giữ: transcript, tag và sao vẫn còn khi một ổ hay thư mục tạm thời không đọc được; chỉ file thật sự đã mất mới rời khỏi thư viện. Trim, Export và Remove Audio không bao giờ ghi đè clip gốc.</li>
</ul>
<h3 id="cloud-network">File cloud và ổ mạng</h3>
<p>File chỉ có trên cloud (Dropbox, iCloud, Google Drive, OneDrive “online only”) không bao giờ bị tải về chỉ vì bạn duyệt hay rê chuột; mở hoặc phát thì mới tải, giống Finder. Ổ mạng (SMB, NFS) được đọc một lượt và chỉ đọc thông tin media của các file đang thấy trên màn hình; thanh trạng thái ghi “Network drive”.</p>` },

      // ------------------------------------------------------------------ Quick Look and viewers
      { id: "viewers", icon: "👁", t: { en: "Quick Look and viewers", vi: "Quick Look và trình xem" },
        en: `
<p>Select a file and press ${k("Space")}. ${k("↑")} and ${k("↓")} go to the file before or after; ${k("Space")} or ${k("Esc")} closes.</p>
<h3 id="ql-many">Several files at once</h3>
<p>Select several files and press ${k("Space")}: they open one after another, each in its own viewer. A bar under it shows where you are (3 / 20) with Previous, Next and a list of all the files. ${k("←")} ${k("→")} or Page Up / Page Down move through them; in project timelines and PDFs, whose arrows step frames and pages, use ${k("⌘←")} ${k("⌘→")} / ${k("Ctrl+←")} ${k("Ctrl+→")}.</p>
<h3 id="ql-media">Video and pictures</h3>
<p>Space shows a quick preview. A double-click on a video or sound opens Better Explora's own <a href="#player">player</a> (Settings can send them to their default app instead).</p>
<h3 id="ql-pdf">PDF</h3>
<ul>
<li>One page at a time, fitted to the window. ${k("←")} ${k("→")} (or Page Up, Page Down, Home, End) turn pages.</li>
<li>Click “3 / 22” (or ${k("⌘L")} / ${k("Ctrl+L")}), type a page number and press Return.</li>
<li>Zoom with the − and + buttons, pinch, or ${k("⌘+")} ${k("⌘-")}; click the % to switch between fitted and 100%. Double-click fits the page again.</li>
<li>Full Screen for presenting: the button or ${k("F")}. A click, ${k("Space")}, ${k("→")} or ${k("↓")} go to the next page; ${k("Esc")} leaves full screen.</li>
<li>A double-click on a PDF opens it here too; untick Settings ▸ File Types ▸ PDF to use your usual PDF app. A PDF with a password asks for it.</li>
</ul>
<h3 id="ql-pptx">PowerPoint</h3>
<p>Space on a .pptx, .ppsx or .potx shows its slides in the same viewer as PDFs (arrows, slide number, zoom, Full Screen with ${k("F")}). No PowerPoint or Keynote needed. The first slide shows at once and the rest follow in a few seconds. Open sends the file to PowerPoint or Keynote to edit or play it. See <a href="#lim-pptx">what isn't drawn</a>.</p>
<h3 id="ql-figma">Figma (.fig)</h3>
<p>Free shows the picture saved in the file and its info card. The page and frame viewer is ${PRO}.</p>
<p>Space on a .fig file shows its pages without Figma: drag to move, scroll or pinch to zoom, double-click to fit, click a frame to zoom to it, pick a page at the top left. See <a href="#lim-figma">what isn't drawn</a>.</p>
<h3 id="ql-aep">After Effects (.aep, .aet)</h3>
<p>Free shows the project's info card and the picture saved in it. The comp and timeline viewer below is ${PRO}.</p>
<p>Space on a project shows every composition in a tree (by nesting or by folders) and the selected one's timeline like After Effects: layers, switches, blending modes, track mattes, parents, effects, markers, keyframes and expressions. Drag in the ruler to scrub, ${k("←")} ${k("→")} step a frame (${k("Shift")}: 10), ${k("J")} and ${k("K")} jump between keyframes, double-click a precomp to open it. Missing footage is in red.</p>
<p>Above the timeline, a sketch of the frame at the playhead: solids, footage (pictures, image sequences, the right frame of movies), precomps, shape layers, text, masks, alpha mattes, blending modes, some layer styles (Stroke, Drop Shadow, Outer Glow, Color Overlay), Master Properties and three effects (Gaussian Blur, Fill, Drop Shadow). Drag to pan, scroll with ${k("⌘")} / ${k("Ctrl")} to zoom, double-click or Fit to fit, click in the frame to pick a layer. Play runs the sketch through the work area; Outlines shows each layer's box and marks what can't be drawn. It is drawn from the file, without After Effects: see <a href="#lim-aep">limitations</a>. On Mac it opens in its own window, on Windows and Linux inside Quick Look.</p>
<p>Play also plays the project's sound in time with the picture: audio layers and footage with sound, inside precomps too, with Solo, Audio Levels and Time Remap. Dragging the playhead plays short snippets. The speaker button and volume slider sit next to Play. Missing media stays silent.</p>
<h3 id="ql-prproj">Premiere Pro (.prproj)</h3>
<p>Free shows the project's info card. The sequence and timeline viewer is ${PRO}.</p>
<p>Space on a Premiere Pro project shows its sequences (with nesting) or its bins, with a filter, and the selected sequence's settings. The timeline is laid out like Premiere: video tracks above audio, clips with their names and label colours, speed changes, transitions, markers, muted and locked tracks. Drag in the ruler or the tracks to scrub: the frame above is a sketch made from each clip's own file with its Motion (position, scale, rotation, anchor, crop) and opacity. After Effects comps placed by Dynamic Link are drawn like the After Effects viewer draws them when the .aep is on this computer. Double-click a nested sequence to open it. Missing media is marked Offline in red, and files that are only in the cloud are never downloaded. Play plays every audio track with its speed, Mute, Solo and Volume keyframes. See <a href="#lim-prproj">limitations</a>.</p>
<h3 id="ql-psd">Photoshop (.psd, .psb)</h3>
<p>Free shows the flat picture. Layers and artboards are ${PRO}.</p>
<p>Space on a Photoshop file opens it on a canvas like Figma: every artboard side by side, drag to move, scroll or pinch to zoom, double-click or ${k("0")} to see it all, click an artboard's name to zoom to it. ${k("L")} shows the Layers list: click a layer to outline it, copy a text layer's words with Copy Text or ${k("⌘C")}, and click the eye to hide or show a layer or group (Show as Saved goes back to the saved picture). See <a href="#lim-psd">limitations</a>. On Mac it opens in its own window, on Windows and Linux inside Quick Look (there ${k("Shift")} with the arrows pans, and the plain arrows go to the next file).</p>
<h3 id="ql-templates">Motion Graphics and Resolve templates</h3>
<ul>
<li>Motion Graphics Templates (.mogrt): their own thumbnail in every view. Space shows the picture and preview movie, whether it was made in After Effects or Premiere Pro, size, frame rate, length, fonts and the Premiere version it needs. Its editable controls appear as in Premiere's Essential Graphics panel (read only).</li>
<li>Play plays the preview movie, or, when there is none, opens the template in the After Effects viewer at its own composition. Open in After Effects Viewer shows the project inside the template; templates made in Premiere Pro open their sequence in the Premiere Pro viewer.</li>
<li>Zoom the preview: pinch, ${k("⌘")} / ${k("Ctrl")} with scroll, ${k("+")} and ${k("-")}, ${k("0")} to fit, ${k("1")} for actual size. ${k("F")} or a double-click shows the preview alone in the window.</li>
<li>DaVinci Resolve and Fusion templates (.setting, .drfx): the published controls as in Fusion's Inspector (text with its default words and font, colours, sliders, checkboxes, menus; read only), and a still of the title drawn from its Text+ layers. A .drfx pack lists its templates by Titles, Effects, Generators and Transitions; ${k("↑")} ${k("↓")} ${k("Home")} ${k("End")} move through them.</li>
<li>Advanced Search ▸ Templates finds templates by their text, control names or fonts.</li>
</ul>
<h3 id="ql-editing">Resolve, Final Cut, Filmora, VEGAS and Motion projects</h3>
<p>Free shows each project's info card and the picture saved in it. The project viewer is ${PRO}.</p>
<p>Space on one of these opens it in the project viewer, without the app: its timelines and compound clips, a media panel, tracks and clips, and a sketch of the frame at the playhead made from the media found beside the project. Play plays the sound. Pick a clip in the media panel to see it on its own; ${k("↑")} ${k("↓")} step through the panel. Each viewer says what it doesn't draw (see <a href="#lim-projects">limitations</a>).</p>
<ul>
<li>DaVinci Resolve (.drp, and .dra archives with their MediaFiles folder): timelines, compound clips and Media Pool folders; effect names in each clip's tooltip.</li>
<li>Final Cut Pro XML (.fcpxml, .fcpxmld): projects and compound clips, the primary storyline and connected clips as tracks, titles with their text. A library (.fcpbundle) lists its events, projects and original media; export a project as XML to see its timeline.</li>
<li>Filmora (.wfpbundle, .wfp): timelines, compound clips (double-click), effect clips, speed and reversed clips. Filmora's stock media, which the project doesn't carry, shows as a labelled box.</li>
<li>VEGAS Pro (.veg): tracks, events, media and title text, with pan / crop, fades and the titles' look. A render saved beside the project with its name (Intro.veg and Intro.mp4) plays with Play Render.</li>
<li>Apple Motion projects (.motn) and Final Cut Pro titles, transitions and effects (.moti, .motr, .moef) open in the After Effects viewer: groups as a tree, layers with keyframes and behaviours, and the parameters a template publishes to Final Cut Pro's Inspector.</li>
</ul>
<h3 id="ql-affinity">Affinity (.af, .afdesign, .afphoto, .afpub)</h3>
<p>Affinity documents show their own thumbnail. Space shows the picture big, with the app and version, author, colour profile, fonts, layers, linked files (found or missing), data merge fields, styles and text, even without Affinity installed. Older documents show their picture and file details.</p>
<h3 id="ql-archives">Archives</h3>
<p>Space on a .zip, .rar, .7z or .tar.gz lists what's inside without extracting it. More in <a href="#archives">Archives</a>.</p>
<h3 id="ql-3d">3D, Lottie and Rive</h3>
<p>Thumbnails for 3D models (OBJ, STL, FBX, glTF / GLB, USD and the pictures saved inside .blend, .c4d and others), Lottie (.json, .lottie) and Rive (.riv). They play when the pointer rests on them. 3D models also get an info card. In Space, turning a 3D model is ${PRO} and Rive is ${PRO} (its state machines respond to the mouse). Lottie is free.</p>
<p>Space on a Lottie animation opens a player: play and pause (the button or Return), a scrubber with the frame and time, ${k("←")} ${k("→")} step a frame (${k("Shift")}: 10), Home and End, speed from 0.25× to 4×, and loop. It shows the size, frame rate, frames, length and Lottie version; markers are buttons that jump to their frame. Pick a checkerboard, dark or light background, and one animation of a .lottie that has several. View JSON shows its data on the code card. Plain .json files that aren't animations show as code.</p>
<h3 id="ql-web">Web pages and SVG</h3>
<ul>
<li>Space on an .html page shows the page playing: CSS animations, JavaScript, canvas and SVG animation, with pause, play and restart. The Gallery and Get Info play it too, and grid thumbnails show the page about a second in.</li>
<li>Page, Split and Code at the top switch views; Split shows the code beside the page. Editing and saving the code is ${PRO}. Edit the code and the page follows a moment after you stop typing. Nothing is saved until ${k("⌘S")} / ${k("Ctrl+S")}; closing with changes asks first. ${k("⌥")}-click / ${k("Alt")}-click something in the page to select its code. Swap Sides (${k("⌥⌘X")} / ${k("Ctrl+Alt+X")}) puts the page on the left.</li>
<li>Page size: one button on the left of the bar says the size in use and offers Fit Pane (responsive, the default in Split), Page Size (the page's own), Desktop 1440, Laptop 1280, Tablet 768, Mobile 390, a custom width × height ${PRO} and the sizes you used lately. Wider sizes are scaled down to fit.</li>
<li>SVG pictures open the same way, fitted and sharp: zoom with Fit and 100% in the bar, ${k("⌘")} / ${k("Ctrl")} with ${k("+")}, ${k("-")} or ${k("0")}, a pinch, or ${k("⌥")} / ${k("Alt")} with scroll; drag to move around. A checkerboard button shows transparent parts, and animated SVGs play with pause and restart.</li>
<li>Pages and SVGs run on their own: offline, reading only files in their own folder. A page that wants fonts or scripts from the web shows Load Online Content for that page; Settings ▸ File Types ▸ Web Pages can allow the internet for every page. A page that stops responding is stopped.</li>
</ul>
<h3 id="ql-code">Code</h3>
<p>Space on a code file shows it on a card with its name, language, line numbers and syntax colours: JavaScript, TypeScript, Python, Java, C#, C, C++, SQL, HTML, CSS, Shell, PHP, Go, Rust, Kotlin, Swift, JSON, YAML, XML, Markdown, TOML, Lua, Ruby and After Effects scripts (.jsx). Pick a theme (Auto, Dracula, One Dark, Monokai, Nord, Solarized Light and others), a background (gradients, mesh, solid colours, a picture of your own, transparent or none), a window style (macOS, Windows, plain or none), text size, line numbers and wrapping. Copy copies the code; Copy Image and Save PNG ${PRO} make a picture of the card. JSON is shown formatted, with blocks that fold. Your choices are kept.</p>
<h3 id="ql-other">Text and other files</h3>
<p>On Mac, other files use macOS Quick Look. On Windows and Linux, Better Explora's Quick Look shows text files, fonts and pictures itself.</p>`,
        vi: `
<p>Chọn file rồi nhấn ${k("Space")}. ${k("↑")} và ${k("↓")} sang file trước hoặc sau; ${k("Space")} hoặc ${k("Esc")} để đóng.</p>
<h3 id="ql-many">Xem nhiều file một lượt</h3>
<p>Chọn nhiều file rồi nhấn ${k("Space")}: chúng mở lần lượt, mỗi file trong trình xem của nó. Thanh bên dưới cho biết bạn đang ở đâu (3 / 20), có Previous, Next và danh sách mọi file. ${k("←")} ${k("→")} hoặc Page Up / Page Down để chuyển file; trong timeline của project và trong PDF, nơi mũi tên dùng để bước khung hình và lật trang, dùng ${k("⌘←")} ${k("⌘→")} / ${k("Ctrl+←")} ${k("Ctrl+→")}.</p>
<h3 id="ql-media">Video và ảnh</h3>
<p>Space hiện bản xem nhanh. Double-click vào video hay file âm thanh sẽ mở <a href="#player">player</a> của Better Explora (Settings có thể chuyển sang mở bằng app mặc định).</p>
<h3 id="ql-pdf">PDF</h3>
<ul>
<li>Mỗi lần một trang, vừa khung cửa sổ. ${k("←")} ${k("→")} (hoặc Page Up, Page Down, Home, End) để lật trang.</li>
<li>Bấm vào “3 / 22” (hoặc ${k("⌘L")} / ${k("Ctrl+L")}), gõ số trang rồi nhấn Return.</li>
<li>Phóng to thu nhỏ bằng nút − và +, chụm hai ngón, hoặc ${k("⌘+")} ${k("⌘-")}; bấm vào số % để chuyển giữa vừa khung và 100%. Double-click để vừa khung lại.</li>
<li>Toàn màn hình để trình chiếu: nút Full Screen hoặc ${k("F")}. Bấm chuột, ${k("Space")}, ${k("→")} hoặc ${k("↓")} để sang trang; ${k("Esc")} thoát toàn màn hình.</li>
<li>Double-click vào PDF cũng mở ở đây; bỏ tick Settings ▸ File Types ▸ PDF để dùng app PDF quen thuộc. PDF có mật khẩu sẽ hỏi mật khẩu.</li>
</ul>
<h3 id="ql-pptx">PowerPoint</h3>
<p>Space trên file .pptx, .ppsx hoặc .potx hiện từng slide trong cùng trình xem PDF (mũi tên, số slide, zoom, toàn màn hình bằng ${k("F")}). Không cần PowerPoint hay Keynote. Slide đầu hiện ngay, các slide còn lại có sau vài giây. Nút Open mở file bằng PowerPoint hoặc Keynote để sửa hay trình chiếu. Xem <a href="#lim-pptx">những gì chưa vẽ được</a>.</p>
<h3 id="ql-figma">Figma (.fig)</h3>
<p>Bản miễn phí hiện ảnh lưu sẵn trong file và thẻ thông tin. Trình xem từng trang, từng frame là ${PRO}.</p>
<p>Space trên file .fig hiện các trang mà không cần Figma: kéo để di chuyển, cuộn hoặc chụm để zoom, double-click để vừa khung, bấm vào một frame để zoom tới, chọn trang ở góc trên bên trái. Xem <a href="#lim-figma">những gì chưa vẽ được</a>.</p>
<h3 id="ql-aep">After Effects (.aep, .aet)</h3>
<p>Bản miễn phí hiện thẻ thông tin của project và ảnh lưu sẵn trong file. Trình xem comp và timeline dưới đây là ${PRO}.</p>
<p>Space trên project hiện mọi composition dạng cây (theo lồng nhau hoặc theo thư mục) và timeline của comp đang chọn giống After Effects: layer, switch, blending mode, track matte, parent, effect, marker, keyframe và expression. Kéo trên thước thời gian để tua, ${k("←")} ${k("→")} bước một khung (${k("Shift")}: 10 khung), ${k("J")} và ${k("K")} nhảy giữa các keyframe, double-click vào precomp để mở. Footage thiếu hiện màu đỏ.</p>
<p>Phía trên timeline là bản phác khung hình tại vị trí playhead: solid, footage (ảnh, chuỗi ảnh, đúng khung hình của video), precomp, shape layer, chữ, mask, alpha matte, blending mode, một số layer style (Stroke, Drop Shadow, Outer Glow, Color Overlay), Master Properties và ba effect (Gaussian Blur, Fill, Drop Shadow). Kéo để di chuyển, cuộn kèm ${k("⌘")} / ${k("Ctrl")} để zoom, double-click hoặc Fit để vừa khung, bấm vào khung hình để chọn layer. Play chạy bản phác trong vùng work area; Outlines hiện khung của từng layer và đánh dấu phần không vẽ được. Hình được vẽ từ file, không cần After Effects: xem <a href="#lim-aep">giới hạn</a>. Trên Mac trình xem mở trong cửa sổ riêng, trên Windows và Linux nằm trong Quick Look.</p>
<p>Play phát cả âm thanh của project khớp với hình: audio layer và footage có tiếng, kể cả trong precomp, theo Solo, Audio Levels và Time Remap. Kéo playhead sẽ phát từng đoạn ngắn. Nút loa và thanh âm lượng nằm cạnh Play. Media thiếu thì im lặng.</p>
<h3 id="ql-prproj">Premiere Pro (.prproj)</h3>
<p>Bản miễn phí hiện thẻ thông tin của project. Trình xem sequence và timeline là ${PRO}.</p>
<p>Space trên project Premiere Pro hiện các sequence (kể cả lồng nhau) hoặc các bin, có ô lọc, và thông số của sequence đang chọn. Timeline bố trí giống Premiere: track video trên track audio, clip có tên và màu nhãn, thay đổi tốc độ, transition, marker, track bị tắt tiếng hoặc khoá. Kéo trên thước hoặc trên track để tua: khung hình phía trên là bản phác làm từ chính file của từng clip, theo Motion (vị trí, scale, xoay, anchor, crop) và opacity. Comp After Effects đặt bằng Dynamic Link được vẽ giống trình xem After Effects, nếu file .aep có trên máy. Double-click vào sequence lồng để mở. Media thiếu ghi Offline màu đỏ, và file chỉ có trên cloud không bao giờ bị tải về. Play phát mọi track audio theo tốc độ, Mute, Solo và keyframe Volume. Xem <a href="#lim-prproj">giới hạn</a>.</p>
<h3 id="ql-psd">Photoshop (.psd, .psb)</h3>
<p>Bản miễn phí hiện ảnh phẳng. Từng layer và artboard là ${PRO}.</p>
<p>Space trên file Photoshop mở nó trên canvas giống Figma: mọi artboard đặt cạnh nhau, kéo để di chuyển, cuộn hoặc chụm để zoom, double-click hoặc ${k("0")} để xem toàn bộ, bấm vào tên artboard để zoom tới. ${k("L")} mở danh sách Layers: bấm vào layer để viền nó, chép chữ của text layer bằng Copy Text hoặc ${k("⌘C")}, và bấm con mắt để ẩn / hiện layer hoặc group (Show as Saved quay về hình đã lưu). Xem <a href="#lim-psd">giới hạn</a>. Trên Mac trình xem mở trong cửa sổ riêng, trên Windows và Linux nằm trong Quick Look (ở đó ${k("Shift")} kèm mũi tên để di chuyển hình, mũi tên không kèm phím sang file kế tiếp).</p>
<h3 id="ql-templates">Template Motion Graphics và Resolve</h3>
<ul>
<li>Motion Graphics Template (.mogrt): có thumbnail riêng ở mọi chế độ xem. Space hiện hình và video xem trước, template làm bằng After Effects hay Premiere Pro, kích thước, fps, thời lượng, font và bản Premiere cần có. Các control chỉnh được hiện như bảng Essential Graphics của Premiere (chỉ xem).</li>
<li>Play phát video xem trước, hoặc nếu không có thì mở template trong trình xem After Effects đúng composition của nó. Open in After Effects Viewer mở project nằm trong template; template làm bằng Premiere Pro mở sequence trong trình xem Premiere Pro.</li>
<li>Zoom hình xem trước: chụm hai ngón, cuộn kèm ${k("⌘")} / ${k("Ctrl")}, ${k("+")} và ${k("-")}, ${k("0")} để vừa khung, ${k("1")} để xem đúng cỡ. ${k("F")} hoặc double-click để chỉ hiện hình xem trước trong cả cửa sổ.</li>
<li>Template DaVinci Resolve và Fusion (.setting, .drfx): các control được publish hiện như Inspector của Fusion (chữ kèm nội dung và font mặc định, màu, thanh trượt, ô tick, menu; chỉ xem), và một hình tĩnh của title vẽ từ các layer Text+. Gói .drfx liệt kê template theo Titles, Effects, Generators và Transitions; ${k("↑")} ${k("↓")} ${k("Home")} ${k("End")} để chuyển.</li>
<li>Advanced Search ▸ Templates tìm template theo chữ, tên control hoặc font.</li>
</ul>
<h3 id="ql-editing">Project Resolve, Final Cut, Filmora, VEGAS và Motion</h3>
<p>Bản miễn phí hiện thẻ thông tin và ảnh lưu sẵn của từng project. Trình xem project là ${PRO}.</p>
<p>Space trên các file này mở chúng trong trình xem project, không cần app: timeline và compound clip, bảng media, track và clip, và bản phác khung hình tại playhead làm từ media tìm thấy cạnh project. Play phát âm thanh. Chọn một clip trong bảng media để xem riêng nó; ${k("↑")} ${k("↓")} để đi qua từng mục. Mỗi trình xem đều ghi rõ phần nào chưa vẽ (xem <a href="#lim-projects">giới hạn</a>).</p>
<ul>
<li>DaVinci Resolve (.drp, và file lưu trữ .dra cùng thư mục MediaFiles): timeline, compound clip và thư mục Media Pool; tên effect của mỗi clip nằm trong tooltip.</li>
<li>Final Cut Pro XML (.fcpxml, .fcpxmld): project và compound clip, primary storyline và các clip nối thành track, title kèm chữ. Library (.fcpbundle) liệt kê event, project và media gốc; xuất project ra XML để xem timeline.</li>
<li>Filmora (.wfpbundle, .wfp): timeline, compound clip (double-click), clip effect, clip đổi tốc độ và chạy ngược. Media có sẵn của Filmora (project không mang theo) hiện thành một khung có nhãn.</li>
<li>VEGAS Pro (.veg): track, event, media và chữ của title, kèm pan / crop, fade và kiểu chữ của title. Bản render lưu cạnh project cùng tên (Intro.veg và Intro.mp4) phát bằng Play Render.</li>
<li>Project Apple Motion (.motn) và title, transition, effect của Final Cut Pro (.moti, .motr, .moef) mở trong trình xem After Effects: group dạng cây, layer kèm keyframe và behaviour, và các thông số template publish sang Inspector của Final Cut Pro.</li>
</ul>
<h3 id="ql-affinity">Affinity (.af, .afdesign, .afphoto, .afpub)</h3>
<p>File Affinity có thumbnail riêng. Space hiện hình lớn, kèm app và phiên bản, tác giả, colour profile, font, layer, file liên kết (có hay thiếu), trường data merge, style và chữ, kể cả khi máy không cài Affinity. File đời cũ hiện hình và thông tin file.</p>
<h3 id="ql-archives">File nén</h3>
<p>Space trên file .zip, .rar, .7z hoặc .tar.gz liệt kê nội dung bên trong mà không giải nén. Xem thêm ở <a href="#archives">File nén</a>.</p>
<h3 id="ql-3d">3D, Lottie và Rive</h3>
<p>Thumbnail cho model 3D (OBJ, STL, FBX, glTF / GLB, USD và ảnh lưu sẵn trong .blend, .c4d và các loại khác), Lottie (.json, .lottie) và Rive (.riv). Chúng chạy khi bạn để chuột lên. Model 3D còn có thẻ thông tin. Trong Space, xoay model 3D là ${PRO} và Rive là ${PRO} (state machine của nó phản hồi theo chuột). Lottie miễn phí.</p>
<p>Space trên animation Lottie mở một player: phát và dừng (nút hoặc Return), thanh tua có số khung và thời gian, ${k("←")} ${k("→")} bước một khung (${k("Shift")}: 10), Home và End, tốc độ từ 0.25× tới 4×, và lặp. Player hiện kích thước, fps, số khung, thời lượng và phiên bản Lottie; marker là các nút nhảy tới khung của nó. Chọn nền ô cờ, tối hoặc sáng, và chọn một animation trong file .lottie có nhiều animation. View JSON hiện dữ liệu trên thẻ code. File .json thường (không phải animation) hiện dạng code.</p>
<h3 id="ql-web">Trang web và SVG</h3>
<ul>
<li>Space trên trang .html hiện chính trang đó đang chạy: CSS animation, JavaScript, canvas và SVG animation, có dừng, phát và chạy lại. Gallery và Get Info cũng chạy trang, và thumbnail trong Grid là hình trang sau khoảng một giây.</li>
<li>Page, Split và Code ở trên cùng để đổi cách xem; Split hiện code cạnh trang. Sửa và lưu code là ${PRO}. Sửa code là trang chạy theo ngay khi bạn ngừng gõ. Chưa lưu gì cho tới khi nhấn ${k("⌘S")} / ${k("Ctrl+S")}; đóng khi còn thay đổi thì app hỏi trước. ${k("⌥")}-bấm / ${k("Alt")}-bấm vào một thứ trong trang để chọn code của nó. Swap Sides (${k("⌥⌘X")} / ${k("Ctrl+Alt+X")}) đưa trang sang bên trái.</li>
<li>Cỡ trang: một nút ở bên trái thanh công cụ ghi cỡ đang dùng và có Fit Pane (responsive, mặc định trong Split), Page Size (cỡ riêng của trang), Desktop 1440, Laptop 1280, Tablet 768, Mobile 390, cỡ tự nhập rộng × cao ${PRO} và các cỡ dùng gần đây. Cỡ rộng hơn khung được thu nhỏ cho vừa.</li>
<li>Ảnh SVG mở cùng cách đó, vừa khung và sắc nét: zoom bằng Fit và 100% trên thanh, ${k("⌘")} / ${k("Ctrl")} kèm ${k("+")}, ${k("-")} hoặc ${k("0")}, chụm hai ngón, hoặc cuộn kèm ${k("⌥")} / ${k("Alt")}; kéo để di chuyển. Nút ô cờ cho thấy phần trong suốt, và SVG động chạy được, có dừng và chạy lại.</li>
<li>Trang web và SVG chạy riêng: không có mạng, chỉ đọc file trong thư mục của chính nó. Trang cần font hay script trên mạng sẽ hiện Load Online Content cho riêng trang đó; Settings ▸ File Types ▸ Web Pages có thể cho mọi trang dùng mạng. Trang bị treo sẽ bị dừng.</li>
</ul>
<h3 id="ql-code">Code</h3>
<p>Space trên file code hiện nó trên một thẻ có tên, ngôn ngữ, số dòng và tô màu cú pháp: JavaScript, TypeScript, Python, Java, C#, C, C++, SQL, HTML, CSS, Shell, PHP, Go, Rust, Kotlin, Swift, JSON, YAML, XML, Markdown, TOML, Lua, Ruby và script After Effects (.jsx). Chọn theme (Auto, Dracula, One Dark, Monokai, Nord, Solarized Light và các theme khác), nền (gradient, mesh, màu trơn, ảnh của bạn, trong suốt hoặc không nền), kiểu cửa sổ (macOS, Windows, đơn giản hoặc không có), cỡ chữ, số dòng và xuống dòng. Copy chép code; Copy Image và Save PNG ${PRO} tạo ảnh của thẻ. JSON được định dạng sẵn, các khối thu gọn được. Lựa chọn của bạn được giữ.</p>
<h3 id="ql-other">File chữ và file khác</h3>
<p>Trên Mac, các file khác dùng Quick Look của macOS. Trên Windows và Linux, Quick Look của Better Explora tự hiện file chữ, font và ảnh.</p>` },

      // ------------------------------------------------------------------ Player and transcripts
      { id: "player", icon: "▶︎", t: { en: "Player, transcripts and AI", vi: "Player, transcript và AI" },
        en: `
<h3 id="player-basics">Player</h3>
<ul>
<li>Double-click a video or sound to play it. Select several and double-click (or Return) to play them in order as a Queue, with Repeat and Shuffle.</li>
<li>Mac keys: ${k("Space")} play / pause, ${k("J")} ${k("L")} 15 seconds back / forward, ${k("←")} ${k("→")} 5 seconds, ${k(",")} ${k(".")} one frame, ${k("[")} ${k("]")} speed, ${k("F")} full screen, ${k("Q")} queue, ${k("C")} transcript, ${k("S")} subtitles, ${k("E")} export the frame, ${k("Esc")} close. The full list is in <a href="#shortcuts">Keyboard shortcuts</a>.</li>
<li>Mini player that stays on top of other apps: ${k("⌥⌘P")} ${mac}, ${k("P")} ${win}.</li>
<li>Trim like QuickTime: ${k("⇧T")} trim mode, ${k("I")} and ${k("O")} set In and Out, ${k("⌘S")} saves that part as a new file ${mac}. On Windows and Linux: right-click a clip ▸ Quick Actions ▸ Trim…. The original is never changed.</li>
<li>Trim a GIF by frames: on Mac in the player's trim mode; on Windows and Linux with Quick Actions ▸ Trim… on a GIF. Keep the GIF's own frames, or save the exact frames as an MP4. On Windows and Linux the result is saved next to the GIF as <code>name_f12-48.gif</code> (first and last frame kept).</li>
<li>Arrange the control bar in Settings ▸ Player Look (Mac) or Media Player (Windows / Linux).</li>
</ul>
<h3 id="transcripts">Transcripts</h3>
<ul>
<li>Right-click a clip ▸ Transcribe… (${k("⌥⌘T")} on Mac). Transcribe 3 clips a month for free; more with ${PRO}. Engines: Whisper on your computer (download a model in Settings ▸ Transcribe, Large v3 Turbo 8-bit is suggested; on Mac also install whisper-cpp), macOS Speech on macOS 26 or later (nothing to install), or a cloud service with your own key (OpenAI, Groq or another).</li>
<li>Read, edit and export a transcript as .srt for free. You can translate the lines too. Burning the subtitles into a new video is ${PRO} (the look is in Settings ▸ Player Look on Mac, Media Player on Windows / Linux).</li>
<li>Settings ▸ Transcribe ▸ In the Background: clips of the folders you open get a transcript on their own, on this computer only (never sent to the cloud), and not while it runs on battery. Off until you switch it on. On Windows and Linux it uses a Whisper model, and network drives are skipped.</li>
</ul>
<h3 id="ai">AI</h3>
<ul>
<li>AI Review ${PRO} checks a transcript and suggests fixes beside the video; a Glossary keeps names spelled right. It uses the text model and the API key you set in Settings ▸ AI Services, which says exactly what is sent.</li>
<li>Made with AI? ${PRO}: a column that says Yes, Partly, Maybe or No from Content Credentials and the marks AI tools leave in files, read on your computer. An empty answer doesn't prove a person made the file.</li>
<li>Visual Search, Find Similar and Remove Background run on your computer: nothing is uploaded.</li>
</ul>
<h3 id="compare">Compare ${PRO}</h3>
<p>Select 2 to 9 videos or pictures, right-click ▸ Compare (${k("⌃⌘C")} / ${k("Ctrl+Shift+K")}). They play on one timeline. Click a tile to make it the reference (what differs is in orange), double-click or ${k("F")} to see one alone, ${k("I")} hides the names and details. Two files can also be compared with a Wipe line.</p>`,
        vi: `
<h3 id="player-basics">Player</h3>
<ul>
<li>Double-click video hay file âm thanh để phát. Chọn nhiều file rồi double-click (hoặc Return) để phát lần lượt thành hàng chờ (Queue), có Repeat và Shuffle.</li>
<li>Phím trên Mac: ${k("Space")} phát / dừng, ${k("J")} ${k("L")} lùi / tới 15 giây, ${k("←")} ${k("→")} 5 giây, ${k(",")} ${k(".")} một khung hình, ${k("[")} ${k("]")} tốc độ, ${k("F")} toàn màn hình, ${k("Q")} hàng chờ, ${k("C")} transcript, ${k("S")} phụ đề, ${k("E")} xuất khung hình, ${k("Esc")} đóng. Danh sách đầy đủ ở <a href="#shortcuts">Phím tắt</a>.</li>
<li>Player nhỏ nổi trên mọi app: ${k("⌥⌘P")} ${mac}, ${k("P")} ${win}.</li>
<li>Cắt kiểu QuickTime: ${k("⇧T")} bật chế độ trim, ${k("I")} và ${k("O")} đặt điểm vào / ra, ${k("⌘S")} lưu đoạn đó thành file mới ${mac}. Trên Windows và Linux: chuột phải vào clip ▸ Quick Actions ▸ Trim…. File gốc không bao giờ bị sửa.</li>
<li>Cắt GIF theo khung: trên Mac dùng chế độ trim của player; trên Windows và Linux dùng Quick Actions ▸ Trim… trên file GIF. Giữ nguyên các khung của GIF, hoặc lưu đúng các khung đó thành MP4. Trên Windows và Linux kết quả lưu cạnh file GIF với tên <code>name_f12-48.gif</code> (khung đầu và khung cuối được giữ).</li>
<li>Sắp xếp thanh điều khiển trong Settings ▸ Player Look (Mac) hoặc Media Player (Windows / Linux).</li>
</ul>
<h3 id="transcripts">Transcript</h3>
<ul>
<li>Chuột phải vào clip ▸ Transcribe… (${k("⌥⌘T")} trên Mac). Mỗi tháng tạo transcript miễn phí cho 3 clip; nhiều hơn cần ${PRO}. Engine: Whisper chạy trên máy (tải model trong Settings ▸ Transcribe, gợi ý Large v3 Turbo 8-bit; trên Mac cần cài thêm whisper-cpp), macOS Speech trên macOS 26 trở lên (không cần cài gì), hoặc dịch vụ cloud với API key của bạn (OpenAI, Groq hoặc dịch vụ khác).</li>
<li>Xem, sửa và xuất transcript ra .srt là miễn phí. Bạn cũng dịch được từng dòng. Đốt phụ đề vào video mới là ${PRO} (kiểu chữ chỉnh trong Settings ▸ Player Look trên Mac, Media Player trên Windows / Linux).</li>
<li>Settings ▸ Transcribe ▸ In the Background: clip trong các thư mục bạn mở tự có transcript, chỉ chạy trên máy này (không gửi lên cloud), và không chạy khi máy đang dùng pin. Mặc định tắt. Trên Windows và Linux dùng model Whisper, và bỏ qua ổ mạng.</li>
</ul>
<h3 id="ai">AI</h3>
<ul>
<li>AI Review ${PRO} đọc transcript và gợi ý sửa ngay cạnh video; Glossary giữ tên riêng viết đúng. Tính năng này dùng text model và API key bạn đặt trong Settings ▸ AI Services; trang đó ghi rõ dữ liệu nào được gửi đi.</li>
<li>Made with AI? ${PRO}: cột cho biết Yes, Partly, Maybe hoặc No dựa trên Content Credentials và dấu vết công cụ AI để lại trong file, đọc ngay trên máy. Ô trống không chứng minh file do người làm.</li>
<li>Visual Search, Find Similar và Remove Background chạy trên máy bạn: không tải gì lên.</li>
</ul>
<h3 id="compare">So sánh (Compare) ${PRO}</h3>
<p>Chọn 2 đến 9 video hoặc ảnh, chuột phải ▸ Compare (${k("⌃⌘C")} / ${k("Ctrl+Shift+K")}). Tất cả phát trên một timeline. Bấm vào một ô để làm mốc (chỗ khác nhau tô cam), double-click hoặc ${k("F")} để xem riêng một ô, ${k("I")} ẩn tên và thông số. Hai file còn so được bằng vạch Wipe.</p>` },

      // ------------------------------------------------------------------ Quick Actions
      { id: "quick-actions", icon: "⚡️", t: { en: "Quick Actions", vi: "Quick Actions" },
        en: `
<p>Right-click a file ▸ Quick Actions. New files go next to the original under a new name; nothing is overwritten, and Undo takes a new file away again. Up to 3 files at once is free; more at once is ${PRO}.</p>
<ul>
<li><b>Trim and Compress</b>: Trim, Remove Audio and Compress with its presets are free. Compress with your own settings, as a GIF or keeping HDR is ${PRO}; Remove Video ${PRO}.</li>
<li><b>Reframe</b>: turn a video into 9:16 or 4:5 for free, or 1:1, 16:9, 21:9 or a free shape with ${PRO}. Drag the crop frame, or put the whole picture over a blurred copy of itself. Saved as clip_9x16.mp4 next to the clip.</li>
<li><b>Crop</b>: crop a picture to Free, Original, 1:1, 4:5, 9:16, 16:9 or 21:9. Saved as photo_crop.jpg in the same format.</li>
<li><b>Convert Image</b> and <b>Create PDF</b> from pictures.</li>
<li><b>Rotate Left / Right</b>: JPEG and TIFF without compressing again, PNG and BMP too; HEIC and still GIF on Mac only.</li>
<li><b>Remove Background</b>: runs on your computer. One picture at a time with the small built-in model is free; many at once and the high-quality models are ${PRO}. Install it in Settings ▸ Remove Background on Mac, Settings ▸ Quick Actions on Windows / Linux (BiRefNet, IS-Net, U²-Net or your own .onnx model; on Mac also Apple Vision).</li>
<li><b>Transcribe</b> (3 clips a month free), <b>Render Preview</b> ${PRO} and <b>Check on SynthID</b> ${PRO} are here too.</li>
</ul>
<p>Compress, Reframe and Save Trim show their progress with Stop. Stopping leaves no half-made file.</p>`,
        vi: `
<p>Chuột phải vào file ▸ Quick Actions. File mới nằm cạnh file gốc với tên mới; không ghi đè file nào, và Undo xoá file mới đó đi. Mỗi lần tối đa 3 file là miễn phí; nhiều hơn cần ${PRO}.</p>
<ul>
<li><b>Trim và Compress</b>: Trim, Remove Audio và Compress theo preset có sẵn là miễn phí. Compress tuỳ chỉnh, ra GIF hoặc giữ HDR là ${PRO}; Remove Video ${PRO}.</li>
<li><b>Reframe</b>: đổi video sang 9:16 hoặc 4:5 miễn phí, hoặc 1:1, 16:9, 21:9 hay khung tự do với ${PRO}. Kéo khung cắt, hoặc đặt cả hình lên một bản sao làm mờ của chính nó. Lưu thành clip_9x16.mp4 cạnh clip.</li>
<li><b>Crop</b>: cắt ảnh theo Free, Original, 1:1, 4:5, 9:16, 16:9 hoặc 21:9. Lưu thành photo_crop.jpg, cùng định dạng.</li>
<li><b>Convert Image</b> và <b>Create PDF</b> từ ảnh.</li>
<li><b>Rotate Left / Right</b>: JPEG và TIFF không nén lại, cả PNG và BMP; HEIC và GIF tĩnh chỉ trên Mac.</li>
<li><b>Remove Background</b>: chạy ngay trên máy. Từng ảnh với model nhỏ có sẵn là miễn phí; xử lý hàng loạt và model chất lượng cao là ${PRO}. Cài trong Settings ▸ Remove Background trên Mac, Settings ▸ Quick Actions trên Windows / Linux (BiRefNet, IS-Net, U²-Net hoặc model .onnx của bạn; trên Mac có thêm Apple Vision).</li>
<li><b>Transcribe</b> (miễn phí 3 clip mỗi tháng), <b>Render Preview</b> ${PRO} và <b>Check on SynthID</b> ${PRO} cũng nằm ở đây.</li>
</ul>
<p>Compress, Reframe và Save Trim hiện tiến trình kèm nút Stop. Bấm Stop thì không để lại file làm dở.</p>` },

      // ------------------------------------------------------------------ Projects
      { id: "projects", icon: "🎬", t: { en: "Project and motion files", vi: "Project và file motion" },
        en: `
<h3 id="project-cards">Project cards</h3>
<p>Get Info, the Gallery and the Columns preview show what's inside a project, without opening its app: After Effects (.aep, .aet), Premiere Pro (.prproj), Cavalry (.cv), Caddis (.caddis), Blender (.blend), Cinema 4D (.c4d), Nuke (.nk), Fusion (.comp), Autograph (.agp, .agt) and Plate (.plate). You see the main composition or scene, size, frame rate, length, layers, fonts and the app version that saved it. Cavalry, Caddis, Autograph and Plate files are in the Motion chip, After Effects and Premiere in Projects &amp; Design, Blender and Cinema 4D in 3D. DaVinci Resolve, Final Cut Pro, Filmora, VEGAS Pro, Apple Motion and Affinity files get their own thumbnail and card too, and open in a viewer with Space (see <a href="#ql-editing">viewers</a>).</p>
<ul>
<li>Space on a Cavalry, Caddis, Autograph or Plate project opens its card: the picture it has (Autograph's viewer, Plate's first frame, the Caddis or Cavalry frame) above the composition, size, frame rate, length, footage (missing ones in red), fonts, author and licence. On Windows and Linux, Quick Look shows the picture with the main facts under it; the full card is in Get Info. A project with a preview video plays it instead.</li>
<li>Caddis (.caddis): a real frame as the thumbnail, drawn in the background by the Caddis app installed on your computer (once you are signed in to it). Without Caddis they keep the Caddis icon.</li>
<li>Cavalry (.cv): a real frame as the thumbnail and in Space, drawn by your own copy of Scene Group's Cavalry Web Player. Better Explora doesn't include it: download it (free, from Scene Group), unzip it and choose its folder in Settings ▸ File Types ▸ Cavalry. Without it, Cavalry scenes keep their icon. See <a href="#lim-cavalry">limitations</a>.</li>
<li>Cavalry, Caddis and Autograph: the thumbnail and card are free; the full viewer is ${PRO}.</li>
<li>Used Media ${PRO}: the footage a project uses, missing files in red, with Show in Folder.</li>
<li>Used in Projects ${PRO} (Get Info): which projects use this file.</li>
<li>Advanced Search's Project group ${PRO} finds projects that use a file or miss media.</li>
</ul>
<h3 id="render-preview">Render Preview ${PRO}</h3>
<p>Right-click a project ▸ Render Preview: a short video to skim in Grid and play, made in the background with progress and Stop. The project is never changed: the app renders a copy. It needs the project's app on your computer:</p>
<ul>
<li>After Effects (through aerender): the main composition, up to 30 seconds, 720 px. Render Preview of Composition… picks another one. Render Still Frame is quicker when one picture is enough.</li>
<li>Blender: up to 10 seconds, 720 px; pick the scene and camera. A .blend file's own scripts never run.</li>
<li>Cinema 4D (installed and signed in): pick the Take.</li>
<li>Nuke, or Fusion Render Node / Fusion Studio: pick the Write node or Saver. Your own Write nodes and Savers never write their files.</li>
</ul>
<p>No app? Choose Preview File… uses a video or picture you exported. Delete Preview removes it. Settings ▸ Storage ▸ Project previews ${PRO} lists them all. ${mac} Settings ▸ Storage ▸ Project viewers shows the working files of the project and template viewers, with their size and Clear.</p>`,
        vi: `
<h3 id="project-cards">Thẻ thông tin project</h3>
<p>Get Info, Gallery và ô xem trước của Columns cho biết bên trong project có gì mà không cần mở app: After Effects (.aep, .aet), Premiere Pro (.prproj), Cavalry (.cv), Caddis (.caddis), Blender (.blend), Cinema 4D (.c4d), Nuke (.nk), Fusion (.comp), Autograph (.agp, .agt) và Plate (.plate). Bạn thấy comp hoặc scene chính, kích thước, fps, thời lượng, layer, font và phiên bản app đã lưu file. File Cavalry, Caddis, Autograph và Plate nằm trong chip Motion, After Effects và Premiere trong Projects &amp; Design, Blender và Cinema 4D trong 3D. File DaVinci Resolve, Final Cut Pro, Filmora, VEGAS Pro, Apple Motion và Affinity cũng có thumbnail và thẻ thông tin riêng, và mở trong trình xem bằng Space (xem <a href="#ql-editing">trình xem</a>).</p>
<ul>
<li>Space trên project Cavalry, Caddis, Autograph hoặc Plate mở thẻ thông tin của nó: hình có sẵn (khung xem của Autograph, khung đầu của Plate, khung hình Caddis hoặc Cavalry) phía trên composition, kích thước, fps, thời lượng, footage (file thiếu tô đỏ), font, tác giả và giấy phép. Trên Windows và Linux, Quick Look hiện hình kèm các thông tin chính bên dưới; thẻ đầy đủ nằm trong Get Info. Project có video xem trước thì phát video đó.</li>
<li>Caddis (.caddis): thumbnail là khung hình thật, do app Caddis cài trên máy vẽ ở chế độ nền (khi bạn đã đăng nhập Caddis). Không có Caddis thì giữ icon Caddis.</li>
<li>Cavalry (.cv): thumbnail và hình trong Space là khung hình thật, vẽ bằng bản Cavalry Web Player của Scene Group mà bạn tự tải. Better Explora không kèm nó: tải về (miễn phí, từ Scene Group), giải nén rồi chọn thư mục của nó trong Settings ▸ File Types ▸ Cavalry. Không có player thì scene Cavalry giữ icon. Xem <a href="#lim-cavalry">giới hạn</a>.</li>
<li>Cavalry, Caddis và Autograph: thumbnail và thẻ thông tin miễn phí; trình xem đầy đủ là ${PRO}.</li>
<li>Used Media ${PRO}: footage project dùng, file thiếu tô đỏ, có nút Show in Folder.</li>
<li>Used in Projects ${PRO} (Get Info): project nào dùng file này.</li>
<li>Nhóm Project của Advanced Search ${PRO} tìm project dùng một file hoặc thiếu media.</li>
</ul>
<h3 id="render-preview">Render Preview ${PRO}</h3>
<p>Chuột phải vào project ▸ Render Preview: một video ngắn để rê xem trong Grid và phát, làm ở chế độ nền có tiến trình và nút Stop. Project không bao giờ bị sửa: app render trên bản sao. Cần có app của project trên máy:</p>
<ul>
<li>After Effects (qua aerender): comp chính, tối đa 30 giây, 720 px. Render Preview of Composition… để chọn comp khác. Render Still Frame nhanh hơn khi chỉ cần một hình.</li>
<li>Blender: tối đa 10 giây, 720 px; chọn scene và camera. Script trong file .blend không bao giờ được chạy.</li>
<li>Cinema 4D (đã cài và đăng nhập): chọn Take.</li>
<li>Nuke, hoặc Fusion Render Node / Fusion Studio: chọn Write node hoặc Saver. Write node và Saver của bạn không bao giờ ghi file.</li>
</ul>
<p>Không có app? Choose Preview File… dùng video hoặc ảnh bạn đã xuất. Delete Preview để xoá preview. Settings ▸ Storage ▸ Project previews ${PRO} liệt kê tất cả. ${mac} Settings ▸ Storage ▸ Project viewers hiện các file làm việc của trình xem project và template, kèm dung lượng và nút Clear.</p>` },

      // ------------------------------------------------------------------ Archives
      { id: "archives", icon: "🗜", t: { en: "Archives", vi: "File nén" },
        en: `
<ul>
<li>Space on a .zip, .rar, .7z, .tar.gz and other archives lists what's inside: folders open and close, with sizes, dates, the number of files and the unpacked size. Filter by name at the top.</li>
<li>Right-click ▸ Browse Archive ${PRO} (${k("⌥⌘↓")} on Mac) opens it like a folder in List, Grid or Columns. It is read-only. ${k("⌘↑")} (Mac), ${k("Alt+↑")} (Windows / Linux) or the path bar takes you back.</li>
<li>Inside, Space ${PRO} shows one file (picture, video, PDF, text, Figma, Lottie…) by reading out just that file.</li>
<li>Right-click ▸ Extract to Archive's Folder (Extract on Windows / Linux) copies the chosen files next to the archive. A double-click still extracts the whole archive.</li>
<li>To make an archive: right-click ▸ Compress.</li>
</ul>`,
        vi: `
<ul>
<li>Space trên file .zip, .rar, .7z, .tar.gz và các loại nén khác liệt kê nội dung bên trong: thư mục mở / đóng được, có dung lượng, ngày, số file và dung lượng khi giải nén. Lọc theo tên ở phía trên.</li>
<li>Chuột phải ▸ Browse Archive ${PRO} (${k("⌥⌘↓")} trên Mac) mở file nén như một thư mục ở List, Grid hoặc Columns. Chỉ xem, không sửa được. ${k("⌘↑")} (Mac), ${k("Alt+↑")} (Windows / Linux) hoặc thanh đường dẫn để quay lại.</li>
<li>Ở bên trong, Space ${PRO} hiện một file (ảnh, video, PDF, chữ, Figma, Lottie…) bằng cách chỉ đọc riêng file đó ra.</li>
<li>Chuột phải ▸ Extract to Archive's Folder (Extract trên Windows / Linux) chép các file đã chọn ra cạnh file nén. Double-click vẫn giải nén cả file như trước.</li>
<li>Muốn nén: chuột phải ▸ Compress.</li>
</ul>` },

      // ------------------------------------------------------------------ Settings
      { id: "settings", icon: "⚙️", t: { en: "Settings and right-click menus", vi: "Settings và menu chuột phải" },
        en: `
<ul>
<li>Open Settings with ${k("⌘,")} / ${k("Ctrl+,")}. Type in “Search settings…” to jump to any option.</li>
<li><b>Appearance</b>: Light, Dark or Midnight, and the style of macOS, Windows 11 or Linux GNOME on every system.</li>
<li><b>Right-Click Menus</b>: untick the menu items you never use. They keep their keyboard shortcuts.</li>
<li><b>Shortcuts</b>: give any command your own keys. On Mac you can switch to Windows-style keys here.</li>
<li><b>Views</b>: one page for Grid, List, Columns and Gallery (Large icons, Details, Columns and Gallery on Windows / Linux), each with its on / off, size and own options, such as the Columns connector line.</li>
<li><b>Search</b>: turn each kind of search on or off, see how many names the index holds (Rebuild, or turn it off), and pick the drives to index, with Index drives when they connect.</li>
<li><b>File Types</b>: which extensions go in each filter chip, sidecar files, whether PDFs open in Better Explora, whether web pages may go online (Web Pages), and where your Cavalry Web Player is (Cavalry).</li>
<li><b>Storage</b>: what the thumbnail and preview cache uses, with buttons to clear it.</li>
<li><b>Camera RAW</b>: which Blackmagic RAW decoder is used, and the ARRIRAW add-on (see <a href="#lim-raw">limitations</a>).</li>
</ul>
<p>Hold the pointer over any button to see its name and keys.</p>`,
        vi: `
<ul>
<li>Mở Settings bằng ${k("⌘,")} / ${k("Ctrl+,")}. Gõ vào ô “Search settings…” để tới thẳng một tuỳ chọn.</li>
<li><b>Appearance</b>: Light, Dark hoặc Midnight, và kiểu giao diện macOS, Windows 11 hoặc Linux GNOME trên mọi hệ điều hành.</li>
<li><b>Right-Click Menus</b>: bỏ tick các mục menu bạn không dùng. Phím tắt của chúng vẫn giữ.</li>
<li><b>Shortcuts</b>: đặt phím riêng cho bất kỳ lệnh nào. Trên Mac có thể chuyển sang phím kiểu Windows ở đây.</li>
<li><b>Views</b>: một trang cho Grid, List, Columns và Gallery (Large icons, Details, Columns và Gallery trên Windows / Linux), mỗi phần có công tắc bật / tắt, cỡ và tuỳ chọn riêng, như đường nối của Columns.</li>
<li><b>Search</b>: bật / tắt từng kiểu tìm, xem chỉ mục đang giữ bao nhiêu tên (Rebuild, hoặc tắt đi), và chọn ổ cần lập chỉ mục, kèm Index drives when they connect.</li>
<li><b>File Types</b>: đuôi file nào thuộc chip lọc nào, file đi kèm, có mở PDF trong Better Explora không, trang web có được dùng mạng không (Web Pages), và Cavalry Web Player của bạn nằm ở đâu (Cavalry).</li>
<li><b>Storage</b>: dung lượng cache thumbnail và preview, có nút xoá.</li>
<li><b>Camera RAW</b>: bộ giải mã Blackmagic RAW đang dùng và add-on ARRIRAW (xem <a href="#lim-raw">giới hạn</a>).</li>
</ul>
<p>Để chuột lên bất kỳ nút nào để xem tên và phím tắt của nó.</p>` },

      // ------------------------------------------------------------------ Shortcuts (generated)
      { id: "shortcuts", icon: "⌨️", t: { en: "Keyboard shortcuts", vi: "Phím tắt" },
        en: `<p>The default keys, read from the apps themselves. Change them in Settings ▸ Shortcuts; keys marked fixed can't be changed. On Windows and Linux, Copy, Paste, Delete and the arrows stay as they are; the player's one-letter keys are changed in Settings ▸ Media Player ▸ Player Keys.</p><div data-keys></div>`,
        vi: `<p>Phím mặc định, lấy trực tiếp từ app. Đổi trong Settings ▸ Shortcuts; phím ghi “cố định” thì không đổi được. Trên Windows và Linux, Copy, Paste, Delete và các phím mũi tên giữ nguyên; phím một chữ cái của player đổi trong Settings ▸ Media Player ▸ Player Keys.</p><div data-keys></div>` },

      // ------------------------------------------------------------------ Free vs Pro
      { id: "free-pro", icon: "⭐️", t: { en: "Free and Pro", vi: "Free và Pro" },
        en: `
<p>Better Explora has a free version you can use for as long as you like: a real Finder replacement. Better Explora Pro unlocks the features marked ${PRO} on this site and in the app. One list decides this for Mac, Windows and Linux alike.</p>
${note("Pro is not on sale yet: in the current versions every feature works for everyone.")}
<h3 id="free-list">Free</h3>
<ul>
<li>Browsing: List, Grid, Columns and Gallery, tabs, Path Bar, Recents, hover to scrub, 1 to 6 panes, sidebar groups.</li>
<li>Tags, ratings and XMP labels. Group By, sorting, filter chips, Tidy Up, Flatten. The basic info columns. Smart Folders.</li>
<li>Space on video, pictures, RAW, audio, PDF, text and code. HTML and SVG in Page and Split. Lottie (.json, .lottie).</li>
<li>Search names everywhere (${k("⌘K")} / ${k("⌘F")}) and on external drives. Advanced Search. Search what is said in your clips.</li>
<li>Transcripts: read, edit and export .srt.</li>
<li>Player: Mini player, Cast, Play Queue, Trim, Remove Audio. Image sequences. GIF trim by frame.</li>
<li>Convert Image, Create PDF, Crop.</li>
<li>Themes and styles, still and animated backgrounds, glass windows, sounds, the control bar.</li>
<li>Keeping your files safe is always free: Undo, sidecar files, cloud files never downloaded on their own, fast network drives.</li>
</ul>
<h3 id="split-list">Free has the basics, Pro the depth</h3>
<table class="doc-table"><thead><tr><th></th><th>Free</th><th>Pro</th></tr></thead><tbody>
<tr><th>Drop Zone</th><td>Collect files, drag to copy or move, Copy to, Move to</td><td>The bolt button and its Quick Actions</td></tr>
<tr><th>Workspaces</th><td>Standard only</td><td>The other Workspaces, saving new ones</td></tr>
<tr><th>Photoshop / Illustrator</th><td>Flat picture</td><td>Each layer, artboards</td></tr>
<tr><th>3D</th><td>Thumbnail and info card</td><td>Turn the model in Space</td></tr>
<tr><th>Figma, Sketch, Affinity</th><td>Picture saved in the file and info card</td><td>Page and frame viewer</td></tr>
<tr><th>Editing projects (After Effects, Premiere, Resolve, Final Cut, Filmora)</th><td>Info card and picture saved in the file</td><td>Comps, timelines and footage lists</td></tr>
<tr><th>Cavalry, Caddis, Autograph</th><td>Thumbnail and info card</td><td>Full viewer</td></tr>
<tr><th>Archives</th><td>List of the files inside</td><td>Browse inside, preview the files inside</td></tr>
<tr><th>Transcribe</th><td>3 clips a month</td><td>Unlimited</td></tr>
<tr><th>Compress</th><td>Presets</td><td>Your own settings, GIF, keep HDR</td></tr>
<tr><th>Playlists</th><td>1 playlist</td><td>Unlimited</td></tr>
<tr><th>Many files at once</th><td>Up to 3 files</td><td>Unlimited</td></tr>
<tr><th>Reframe</th><td>9:16, 4:5</td><td>1:1, 4:3, 16:9, your own</td></tr>
<tr><th>Remove Background</th><td>One picture at a time, small built-in model</td><td>Many at once, high-quality models</td></tr>
</tbody></table>
<h3 id="pro-list">Pro</h3>
<ul>
<li>AI, FPS and Aspect Ratio columns in List.</li>
<li>Version stacks.</li>
<li>HTML and SVG: edit the code and save, your own page sizes, export the code as a picture.</li>
<li>Rive (.riv) in Space. Its thumbnail in the grid stays free.</li>
<li>Render Preview for After Effects, Blender and Cinema 4D.</li>
<li>The Visual tab: Visual Search and search by colour. Find Similar. Ask AI.</li>
<li>AI Review and Glossary. Burning subtitles into a video.</li>
<li>Used Media, missing footage, Used in Projects.</li>
<li>Compare 2 to 9 files.</li>
<li>Made with AI? (the AI column, SynthID).</li>
</ul>`,
        vi: `
<p>Better Explora có bản miễn phí, dùng bao lâu cũng được, thay được Finder thật sự. Better Explora Pro mở khoá các tính năng có nhãn ${PRO} trên trang này và trong app. Một danh sách duy nhất quyết định điều này cho cả Mac, Windows và Linux.</p>
${note("Bản Pro chưa bán: ở các phiên bản hiện tại, mọi tính năng đều dùng được cho tất cả mọi người.")}
<h3 id="free-list">Free</h3>
<ul>
<li>Duyệt file: List, Grid, Columns và Gallery, tab, Path Bar, Recents, rê chuột xem lướt, chia 1 đến 6 khung, nhóm trên thanh bên.</li>
<li>Tag, sao và nhãn XMP. Group By, sắp xếp, chip lọc, Tidy Up, Flatten. Các cột thông tin cơ bản. Smart Folder.</li>
<li>Space trên video, ảnh, RAW, âm thanh, PDF, chữ và code. HTML và SVG ở chế độ Page và Split. Lottie (.json, .lottie).</li>
<li>Tìm tên khắp máy (${k("⌘K")} / ${k("⌘F")}) và trên ổ ngoài. Advanced Search. Tìm trong lời nói của clip.</li>
<li>Transcript: xem, sửa và xuất .srt.</li>
<li>Player: player nhỏ, Cast, Play Queue, Trim, Remove Audio. Chuỗi ảnh. Cắt GIF theo khung.</li>
<li>Convert Image, Create PDF, Crop.</li>
<li>Theme và kiểu giao diện, nền tĩnh và nền động, cửa sổ kính, âm thanh, thanh điều khiển.</li>
<li>An toàn dữ liệu luôn miễn phí: hoàn tác, file đi kèm, không tự tải file cloud, ổ mạng nhanh.</li>
</ul>
<h3 id="split-list">Free có phần cơ bản, Pro có phần sâu</h3>
<table class="doc-table"><thead><tr><th></th><th>Free</th><th>Pro</th></tr></thead><tbody>
<tr><th>Drop Zone</th><td>Gom file, kéo để chép hoặc chuyển, Copy to, Move to</td><td>Nút tia sét và các Quick Action</td></tr>
<tr><th>Workspace</th><td>Chỉ Standard</td><td>Các workspace khác, lưu workspace&nbsp;mới</td></tr>
<tr><th>Photoshop / Illustrator</th><td>Ảnh phẳng</td><td>Từng layer, artboard</td></tr>
<tr><th>3D</th><td>Thumbnail và thẻ thông tin</td><td>Xoay mô hình trong Space</td></tr>
<tr><th>Figma, Sketch, Affinity</th><td>Ảnh lưu sẵn trong file và thẻ thông tin</td><td>Trình xem từng trang, từng frame</td></tr>
<tr><th>Project dựng phim (After Effects, Premiere, Resolve, Final Cut, Filmora)</th><td>Thẻ thông tin và ảnh lưu sẵn trong file</td><td>Sơ đồ comp và timeline, footage dùng và thiếu</td></tr>
<tr><th>Cavalry, Caddis, Autograph</th><td>Thumbnail và thẻ thông tin</td><td>Trình xem đầy đủ</td></tr>
<tr><th>File nén</th><td>Danh sách file bên trong</td><td>Duyệt sâu, xem trước file bên trong</td></tr>
<tr><th>Tạo transcript</th><td>3 clip mỗi tháng</td><td>Không giới hạn</td></tr>
<tr><th>Compress</th><td>Preset có sẵn</td><td>Tuỳ chỉnh, GIF, giữ HDR</td></tr>
<tr><th>Playlist</th><td>1 playlist</td><td>Không giới hạn</td></tr>
<tr><th>Xử lý nhiều file một lúc</th><td>Tối đa 3 file</td><td>Không giới hạn</td></tr>
<tr><th>Reframe</th><td>9:16, 4:5</td><td>1:1, 4:3, 16:9, tuỳ chỉnh</td></tr>
<tr><th>Remove Background</th><td>Từng ảnh, model nhỏ có sẵn</td><td>Hàng loạt, model chất lượng cao</td></tr>
</tbody></table>
<h3 id="pro-list">Pro</h3>
<ul>
<li>Cột AI, FPS và Aspect Ratio trong List.</li>
<li>Gộp phiên bản (version stack).</li>
<li>HTML và SVG: sửa code và lưu, cỡ trang tự chọn, xuất code thành ảnh.</li>
<li>Rive (.riv) trong Space. Thumbnail trong lưới vẫn miễn phí.</li>
<li>Render Preview cho After Effects, Blender và Cinema 4D.</li>
<li>Tab Visual: Visual Search và tìm theo màu. Find Similar. Ask AI.</li>
<li>AI Review và Glossary. Đốt phụ đề vào video.</li>
<li>Used Media, footage thiếu, Used in Projects.</li>
<li>Compare 2 đến 9 file.</li>
<li>Made with AI? (cột AI, SynthID).</li>
</ul>` },

      // ------------------------------------------------------------------ Platforms
      { id: "platforms", icon: "💻", t: { en: "Mac, Windows and Linux", vi: "Mac, Windows và Linux" },
        en: `
<p>The Mac app is a native macOS app. The Windows and Linux app is a separate app that shares the same core, so files, previews and most features work the same. New features usually reach the Mac first. The names differ a little: List is Details, Grid is Large icons, and ${k("⌘")} is usually ${k("Ctrl")}. Viewers that open in their own window on Mac (After Effects, Premiere Pro, Photoshop, templates, Lottie, code) open inside Quick Look on Windows and Linux. The newest Windows and Linux features (the search palette, the Drop Zone, web page editing, the project and template viewers) haven't been tried on a real Windows or Linux computer yet.</p>
<h3 id="mac-only">Only on Mac for now</h3>
<ul>
<li>Finder's tags and sidebar, Spotlight search (text inside documents in the search palette), the Date Added column, AirDrop.</li>
<li>The full card on Space for Cavalry, Caddis, Autograph and Plate projects (Windows and Linux show the picture and main facts; the full card is in Get Info).</li>
<li>HEVC thumbnails and hover strips decoded on the Mac's media engine, so the fans stay quiet.</li>
<li>macOS Speech transcripts, Apple Vision for Remove Background.</li>
<li>Convert Image to HEIF, page size choices in Create PDF.</li>
<li>Rotating HEIC and still GIF pictures, your own sound files for Sounds, and some commands that have keys only on Mac (rating up and down, No label, Delete Immediately and others).</li>
</ul>
<h3 id="desktop-only">Only on Windows and Linux</h3>
<ul>
<li>Windows: Cut, Copy and Paste with Explorer both ways, “Open with Better Explora” in Explorer, a Version column for .exe files and a Security tab in Get Info.</li>
<li>Linux: Cut, Copy and Paste with Files (GNOME) and Dolphin, Open With Better Explora for folders.</li>
<li>The app updates itself (Windows installer and AppImage), and Settings can hide built-in places in the sidebar.</li>
</ul>
<h3 id="os-limits">What other systems can't do</h3>
<ul>
<li>Finder tags and comments, Spotlight, Date Added, macOS Speech and Apple Vision belong to macOS. Windows and Linux use Better Explora's own tags; ratings and labels (XMP) are the same everywhere.</li>
<li>After Effects and Cinema 4D have no Linux version, so their Render Preview works on Mac and Windows only.</li>
<li>Linux has no common “online only” flag, so a cloud folder mounted there may download a file when its thumbnail is read, and there is no Sync column or Download Now (Mac and Windows have them).</li>
<li>Glass windows: Mac, and Windows 11 (Mica, Mica Alt or Acrylic in Settings ▸ Appearance; takes a restart). Windows 10 and Linux keep a solid window.</li>
<li>Thumbnails from other apps: the Mac uses any Quick Look plug-in; Windows uses the system's thumbnail handlers for a list of document types (Office, OpenDocument, EPUB, DWG and others) when their program is installed; Linux has no common way.</li>
<li>On Linux with Wayland, the system decides whether the mini player stays on top. Remove Background runs on the processor on Linux (Mac and Windows use the graphics card); Whisper can use the graphics card (Vulkan) when the build includes it, and falls back to the processor.</li>
<li>Camera RAW photos (CR2, CR3, NEF, ARW): the Mac decodes the RAW itself; Windows and Linux show the JPEG the camera saved inside the file (see <a href="#lim-raw">Camera RAW</a>).</li>
<li>Background transcription on Windows and Linux waits while on battery (and in Windows battery saver), but can't tell when the computer is hot, which the Mac can.</li>
<li>Windows and Linux allow up to 6 panes per window, the Mac up to 32 (each desktop pane is its own web view).</li>
<li>Search: Windows and Linux have no Spotlight, so the palette doesn't look inside documents. The colour eyedropper works on Mac and Windows; on Linux use Custom…. Linux may watch only part of your Home folder for changes (Settings ▸ Search says so) and then reads it again every 30 minutes; drives on Windows are read again every hour instead of watched, so they can still be ejected.</li>
<li>The Drop Zone on Windows and Linux moves files only into this app's folders (or with Move to); other apps always get copies. A file that another app renames or moves is let go, and a folder in your own sidebar group that another app renames stays at its old path: Windows and Linux have no file bookmarks like macOS.</li>
</ul>
`,
        vi: `
<p>Bản Mac là app macOS gốc. Bản Windows và Linux là một app riêng dùng chung phần lõi, nên file, preview và phần lớn tính năng chạy như nhau. Tính năng mới thường có trên Mac trước. Tên gọi hơi khác: List là Details, Grid là Large icons, và ${k("⌘")} thường là ${k("Ctrl")}. Các trình xem mở trong cửa sổ riêng trên Mac (After Effects, Premiere Pro, Photoshop, template, Lottie, code) thì nằm trong Quick Look trên Windows và Linux. Các tính năng mới nhất của bản Windows và Linux (bảng tìm kiếm, Drop Zone, sửa trang web, trình xem project và template) chưa được thử trên máy Windows hay Linux thật.</p>
<h3 id="mac-only">Hiện chỉ có trên Mac</h3>
<ul>
<li>Tag và thanh bên của Finder, tìm bằng Spotlight (chữ bên trong tài liệu trong bảng tìm kiếm), cột Date Added, AirDrop.</li>
<li>Thẻ thông tin đầy đủ khi nhấn Space trên project Cavalry, Caddis, Autograph và Plate (Windows và Linux hiện hình và thông tin chính; thẻ đầy đủ nằm trong Get Info).</li>
<li>Thumbnail và dải rê xem của clip HEVC được giải mã bằng media engine của Mac, nên quạt chạy êm.</li>
<li>Transcript bằng macOS Speech, Apple Vision cho Remove Background.</li>
<li>Convert Image sang HEIF, chọn khổ trang trong Create PDF.</li>
<li>Xoay ảnh HEIC và GIF tĩnh, dùng file âm thanh của riêng bạn cho Sounds, và vài lệnh chỉ có phím tắt trên Mac (tăng / giảm sao, No label, Delete Immediately và một số lệnh khác).</li>
</ul>
<h3 id="desktop-only">Chỉ có trên Windows và Linux</h3>
<ul>
<li>Windows: Cut, Copy, Paste qua lại với Explorer, “Open with Better Explora” trong Explorer, cột Version cho file .exe và tab Security trong Get Info.</li>
<li>Linux: Cut, Copy, Paste với Files (GNOME) và Dolphin, Open With Better Explora cho thư mục.</li>
<li>App tự cập nhật (bộ cài Windows và AppImage), và Settings ẩn được các mục có sẵn trên thanh bên.</li>
</ul>
<h3 id="os-limits">Những gì hệ điều hành khác không làm được</h3>
<ul>
<li>Tag và comment của Finder, Spotlight, Date Added, macOS Speech và Apple Vision là của riêng macOS. Windows và Linux dùng tag riêng của Better Explora; sao và nhãn màu (XMP) thì giống nhau ở mọi nơi.</li>
<li>After Effects và Cinema 4D không có bản Linux, nên Render Preview của chúng chỉ chạy trên Mac và Windows.</li>
<li>Linux không có cờ “online only” chung, nên thư mục cloud gắn vào Linux có thể tải file về khi đọc thumbnail, và không có cột Sync hay Download Now (Mac và Windows có).</li>
<li>Cửa sổ kính: Mac, và Windows 11 (Mica, Mica Alt hoặc Acrylic trong Settings ▸ Appearance; cần mở lại app). Windows 10 và Linux giữ cửa sổ đặc.</li>
<li>Thumbnail từ app khác: Mac dùng mọi plug-in Quick Look; Windows dùng bộ tạo thumbnail của hệ thống cho một danh sách loại tài liệu (Office, OpenDocument, EPUB, DWG và vài loại khác) khi đã cài chương trình của chúng; Linux không có cách chung.</li>
<li>Trên Linux dùng Wayland, hệ thống quyết định player nhỏ có nổi trên cùng hay không. Remove Background trên Linux chạy bằng CPU (Mac và Windows dùng card đồ hoạ); Whisper dùng được card đồ hoạ (Vulkan) khi bản build có kèm, không thì chạy bằng CPU.</li>
<li>Ảnh RAW máy ảnh (CR2, CR3, NEF, ARW): Mac giải mã chính file RAW; Windows và Linux hiện ảnh JPEG mà máy ảnh lưu sẵn bên trong file (xem <a href="#lim-raw">Camera RAW</a>).</li>
<li>Chép lời chạy nền trên Windows và Linux tạm dừng khi máy dùng pin (và khi bật chế độ tiết kiệm pin của Windows), nhưng không biết khi máy đang nóng như trên Mac.</li>
<li>Windows và Linux cho tối đa 6 khung mỗi cửa sổ, Mac tối đa 32 (mỗi khung trên Windows / Linux là một web view riêng).</li>
<li>Tìm kiếm: Windows và Linux không có Spotlight, nên bảng tìm không tìm được chữ bên trong tài liệu. Ống hút màu chạy trên Mac và Windows; trên Linux dùng Custom…. Linux có thể chỉ theo dõi được một phần thư mục Home (Settings ▸ Search có báo) và khi đó đọc lại sau mỗi 30 phút; ổ đĩa trên Windows được đọc lại mỗi giờ thay vì theo dõi liên tục, để vẫn eject được.</li>
<li>Drop Zone trên Windows và Linux chỉ chuyển file vào thư mục của app này (hoặc qua Move to); app khác luôn nhận bản chép. File bị app khác đổi tên hay di chuyển sẽ bị bỏ khỏi Drop Zone, và thư mục trong nhóm tự tạo trên thanh bên mà app khác đổi tên thì vẫn trỏ về đường dẫn cũ: Windows và Linux không có bookmark file như macOS.</li>
</ul>
` },

      // ------------------------------------------------------------------ Pro formats at a glance
      { id: "pro-formats", icon: "🎞", t: { en: "Pro formats at a glance", vi: "Định dạng chuyên nghiệp" },
        en: `
<p>Press <kbd>Space</kbd> on a file to look at it, or rest the pointer on it in Grid to scrub through it (hover scrub). What you get for each kind of professional file:</p>
<ul>
<li><b>Blackmagic RAW (.braw)</b> ${mac}: picture, hover scrub and playback when Blackmagic RAW Player or DaVinci Resolve (both free from Blackmagic Design) is installed. Settings ▸ Camera RAW shows which one is used.</li>
<li><b>ARRI</b>: ProRes clips from ARRI cameras (MOV and MXF) have thumbnails, hover scrub and play. ARRIRAW (.ari, .arx) shows its size, frame rate and camera facts, and a card with Open in ARRI Reference Tool or DaVinci Resolve when one is on your Mac.</li>
<li><b>R3D</b>: listed with a card that opens the clip in DaVinci Resolve. Better Explora doesn't decode R3D.</li>
<li><b>MXF, MKV, AVI, MTS</b>: play in Better Explora's own viewer while a playback copy is made in the background (needs FFmpeg on Mac).</li>
<li><b>After Effects, Premiere Pro, Motion, Final Cut, Resolve and templates</b>: a sketch of the frame read from the project file, with its layers and comps. See <a href="#projects">Project and motion files</a>. Render Preview makes a real video when the app is installed.</li>
<li><b>3D</b>: glTF / GLB, OBJ, FBX and USDZ turn in a 3D view; Blender, Cinema 4D, SketchUp and 3MF show the picture saved in the file.</li>
<li><b>Vector</b>: SVG, PDF and Illustrator, EPS (drawn from the Illustrator data inside it, or exactly with Ghostscript), CorelDRAW, Windows metafiles, SVGZ and DXF.</li>
<li><b>Motion graphics</b>: Lottie, dotLottie, Rive, Telegram stickers (.tgs) and animated images play in the grid and in Space.</li>
</ul>
${note("What isn't drawn yet is listed in <a href=\"#limitations\">Limitations</a>.")}
<h3 id="hover-scrub">Hover scrub</h3>
<p>In Grid, move the pointer across a clip to see it from start to end; a thin line shows where you are. Scrub previews are made once and kept in the cache (Settings ▸ Storage). Clips that are only in the cloud don't scrub until they are on your computer.</p>
<h3 id="speech-search">Transcripts and search by speech</h3>
<p>Transcribe a clip (right-click ▸ Transcribe…, or Settings ▸ Transcribe to do it in the background) and its words become searchable. In the search palette, type <code>said:</code> followed by words to find the sentence and play the clip from there. Transcription runs on your Mac unless you choose a cloud service in Settings ▸ Transcribe.</p>`,
        vi: `
<p>Bấm <kbd>Space</kbd> trên một file để xem, hoặc để chuột trên file trong Grid để xem lướt (hover scrub). Từng loại file chuyên nghiệp được hỗ trợ thế này:</p>
<ul>
<li><b>Blackmagic RAW (.braw)</b> ${mac}: hình, xem lướt và phát khi máy có Blackmagic RAW Player hoặc DaVinci Resolve (cả hai miễn phí của Blackmagic Design). Settings ▸ Camera RAW cho biết đang dùng cái nào.</li>
<li><b>ARRI</b>: clip ProRes của máy ARRI (MOV và MXF) có thumbnail, xem lướt và phát được. ARRIRAW (.ari, .arx) hiện kích thước, frame rate, thông số máy quay và thẻ có nút mở bằng ARRI Reference Tool hoặc DaVinci Resolve nếu máy có.</li>
<li><b>R3D</b>: hiện trong danh sách với thẻ mở clip bằng DaVinci Resolve. Better Explora không giải mã R3D.</li>
<li><b>MXF, MKV, AVI, MTS</b>: phát trong trình xem riêng của Better Explora trong lúc bản phát được tạo ngầm (trên Mac cần FFmpeg).</li>
<li><b>After Effects, Premiere Pro, Motion, Final Cut, Resolve và template</b>: bản phác khung hình đọc từ file project, có layer và comp. Xem <a href="#projects">Project và file motion</a>. Render Preview tạo video thật khi máy có app đó.</li>
<li><b>3D</b>: glTF / GLB, OBJ, FBX và USDZ xoay được trong khung 3D; Blender, Cinema 4D, SketchUp và 3MF hiện hình lưu sẵn trong file.</li>
<li><b>Vector</b>: SVG, PDF và Illustrator, EPS (vẽ từ dữ liệu Illustrator bên trong, hoặc chính xác bằng Ghostscript), CorelDRAW, metafile Windows, SVGZ và DXF.</li>
<li><b>Motion graphics</b>: Lottie, dotLottie, Rive, sticker Telegram (.tgs) và ảnh động chạy ngay trong lưới và trong Space.</li>
</ul>
${note("Những gì chưa vẽ được có trong <a href=\"#limitations\">Giới hạn</a>.")}
<h3 id="hover-scrub">Xem lướt (hover scrub)</h3>
<p>Trong Grid, rê chuột ngang qua clip để xem từ đầu tới cuối; một vạch mảnh cho biết đang ở đâu. Ảnh xem lướt tạo một lần và lưu trong cache (Settings ▸ Storage). Clip chỉ có trên cloud không xem lướt được cho tới khi nó về máy.</p>
<h3 id="speech-search">Transcript và tìm theo lời nói</h3>
<p>Tạo transcript cho clip (chuột phải ▸ Transcribe…, hoặc Settings ▸ Transcribe để làm ngầm) là tìm được theo lời nói. Trong bảng tìm, gõ <code>said:</code> rồi các từ cần tìm để thấy câu đó và phát clip từ đúng chỗ. Transcript làm ngay trên máy, trừ khi bạn chọn dịch vụ cloud trong Settings ▸ Transcribe.</p>` },

      // ------------------------------------------------------------------ Styles and colours
      { id: "looks", icon: "🎨", t: { en: "Styles and background color", vi: "Kiểu giao diện và màu nền" },
        en: `
<p>Settings ▸ Appearance changes how Better Explora looks. Nothing here changes your files.</p>
<ul>
<li><b>Style</b>: macOS, Windows 11 or Linux GNOME, each in Light and Dark. Midnight is a pure black dark mode for grading suites.</li>
<li><b>Background Color</b> ${mac}: tint the browser window with one of 18 colours or Custom…. Light, Medium or Strong sets how much. <b>Use as accent color</b> also colours selected files, sidebar icons and the active tab.</li>
<li><b>Transparent window</b> ${mac}: Frosted, Liquid or Clear glass behind the files.</li>
<li><b>Increase contrast</b>: stronger lines and text; it turns the background tint off.</li>
</ul>
<p>View ▸ Show View Options (<kbd>⌘</kbd> <kbd>J</kbd>) can give a folder its own background picture or video.</p>`,
        vi: `
<p>Settings ▸ Appearance đổi vẻ ngoài của Better Explora. Không mục nào ở đây đụng tới file của bạn.</p>
<ul>
<li><b>Style</b>: macOS, Windows 11 hoặc Linux GNOME, mỗi kiểu có Light và Dark. Midnight là chế độ tối đen tuyền cho phòng chỉnh màu.</li>
<li><b>Background Color</b> ${mac}: phủ một màu lên cửa sổ duyệt file, chọn trong 18 màu hoặc Custom…. Light, Medium hay Strong là độ đậm. <b>Use as accent color</b> tô luôn file đang chọn, icon thanh bên và tab đang mở.</li>
<li><b>Transparent window</b> ${mac}: kính Frosted, Liquid hoặc Clear phía sau vùng file.</li>
<li><b>Increase contrast</b>: đường kẻ và chữ đậm hơn; tắt màu nền.</li>
</ul>
<p>View ▸ Show View Options (<kbd>⌘</kbd> <kbd>J</kbd>) cho mỗi thư mục một ảnh hay video nền riêng.</p>` },

      // ------------------------------------------------------------------ Privacy
      { id: "privacy", icon: "🔒", t: { en: "Privacy", vi: "Quyền riêng tư" },
        en: `
<p>Better Explora works on your computer. It has no account, no analytics and no server that collects anything.</p>
<h3 id="privacy-local">What stays on your computer</h3>
<p>Your files, the media index, thumbnails and scrub previews, tags and ratings, transcripts made on your Mac, Visual Search, Remove Background and the app's log. The index and cache live in <code>~/.mediaindex</code> on Mac.</p>
<h3 id="privacy-online">What goes online, and when</h3>
<ul>
<li><b>Update check</b>: once a day (Settings ▸ Updates can turn it off) the app downloads the update information from this website. Nothing about you or your files is sent. On Mac (0.397 and later) the update information is signed and the app checks the signature and the download's checksum before opening anything.</li>
<li><b>Model downloads</b>: the speech, Visual Search and Remove Background models are downloaded when you turn those features on.</li>
<li><b>Cloud transcription and AI features</b> (only if you set them up with your own key in Settings ▸ AI Services or Transcribe): audio of the clip you transcribe, or the transcript text you send to AI Review, goes to the service you chose. Ask AI sends the words you type (with dates and group names), never file names or pictures.</li>
</ul>
<h3 id="privacy-reports">Crash and bug reports</h3>
<p>Nothing is sent automatically. After a crash, the next launch shows macOS's crash report and lets you look at it, copy it or save it. Help ▸ Report a Bug… shows the whole report before anything leaves: your home folder appears as <code>~</code>, and file and folder names are replaced with [path] unless you tick <b>Include file and folder names</b>. You choose to copy it, save it, or open it in your email app.</p>`,
        vi: `
<p>Better Explora chạy trên máy của bạn. Không cần tài khoản, không thu thống kê, không có máy chủ nào thu thập gì.</p>
<h3 id="privacy-local">Những gì nằm lại trên máy</h3>
<p>File của bạn, chỉ mục media, thumbnail và ảnh xem lướt, tag và sao, transcript làm trên máy, Visual Search, Remove Background và log của app. Chỉ mục và cache nằm ở <code>~/.mediaindex</code> trên Mac.</p>
<h3 id="privacy-online">Những gì lên mạng, và khi nào</h3>
<ul>
<li><b>Kiểm tra cập nhật</b>: mỗi ngày một lần (tắt được trong Settings ▸ Updates) app tải thông tin cập nhật từ website này. Không gửi gì về bạn hay file của bạn. Trên Mac (từ 0.397) thông tin cập nhật có chữ ký, app kiểm chữ ký và mã kiểm của file tải về trước khi mở.</li>
<li><b>Tải model</b>: model nhận giọng nói, Visual Search và Remove Background được tải khi bạn bật các tính năng đó.</li>
<li><b>Transcript qua cloud và tính năng AI</b> (chỉ khi bạn tự cài key của mình trong Settings ▸ AI Services hoặc Transcribe): âm thanh của clip bạn transcript, hoặc chữ transcript bạn gửi cho AI Review, được gửi tới dịch vụ bạn chọn. Ask AI gửi câu bạn gõ (kèm ngày và tên nhóm), không bao giờ gửi tên file hay hình.</li>
</ul>
<h3 id="privacy-reports">Báo cáo crash và báo lỗi</h3>
<p>Không gì được gửi tự động. Sau một lần app bị thoát đột ngột, lần mở sau sẽ hiện báo cáo crash của macOS để bạn xem, chép hoặc lưu. Help ▸ Report a Bug… hiện toàn bộ báo cáo trước khi bạn gửi: thư mục Home hiện là <code>~</code>, tên file và thư mục được thay bằng [path] trừ khi bạn tick <b>Include file and folder names</b>. Bạn tự chọn chép, lưu, hay mở trong app email.</p>` },

      // ------------------------------------------------------------------ Troubleshooting and help
      { id: "troubleshooting", icon: "🛟", t: { en: "Troubleshooting and help", vi: "Khắc phục sự cố và hỗ trợ" },
        en: `
<h3 id="ts-cant-open">“Better Explora can't be opened” or “is damaged”</h3>
<p>The Mac app isn't notarized by Apple yet, so macOS blocks the first launch. Open the app once, then System Settings ▸ Privacy &amp; Security ▸ <b>Open Anyway</b> (macOS 15 or later), or Control-click the app ▸ Open (macOS 13 and 14). If macOS says the app is damaged, run <code>xattr -dr com.apple.quarantine "/Applications/Better Explora.app"</code> in Terminal. The same happens after each update until the app is notarized.</p>
<h3 id="ts-permissions">Permissions after the rename</h3>
<p>Better Finder is now Better Explora. Your permissions (Full Disk Access, folders, microphone) belong to the app itself, not its name, so they normally stay. If a folder can't be read or the Trash looks empty, open System Settings ▸ Privacy &amp; Security ▸ Full Disk Access, remove any old “Better Finder” entry, add Better Explora again with <b>+</b>, then quit and reopen the app. Delete the old Better Finder app if it is still in Applications.</p>
<h3 id="ts-cache">The cache is big</h3>
<p>Thumbnails, scrub previews and playback copies are kept so folders open fast. Settings ▸ Storage shows what uses space, clears each part, and can keep the cache under a size limit. Clearing the cache never touches your files, tags or transcripts; thumbnails are made again when needed.</p>
<h3 id="ts-index">Media info looks wrong or missing</h3>
<p>Go ▸ Reload (<kbd>⌘</kbd> <kbd>R</kbd>) reads the folder again. Go ▸ Index Subfolders reads a folder and everything in it. For wrong thumbnails, clear Thumbnails &amp; scrub previews in Settings ▸ Storage.</p>
<h3 id="ts-slow">Network and cloud folders are slow</h3>
<p>Better Explora reads only what is on screen on network drives, and never downloads cloud-only files while you browse. See <a href="#limitations">Limitations</a>.</p>
<h3 id="ts-crash">The app quit unexpectedly</h3>
<p>At the next launch Better Explora shows macOS's crash report. Click <b>Report…</b> to put it in a bug report, or <b>Save as File…</b> to keep it. Nothing is sent unless you send it.</p>
<h3 id="ts-report">Report a bug or get help</h3>
<p>Help ▸ Report a Bug… collects the app and system version and, if you want, recent log lines; you see everything first, then copy it, save it, or paste it into a new <a href="https://github.com/gmttuts/better-finder/issues">GitHub issue</a> (issues are public). Questions go to the Discord; see <a href="support.html">Support</a>. Ideas for new features go to the <a href="feedback.html">feedback board</a>.</p>`,
        vi: `
<h3 id="ts-cant-open">“Better Explora can't be opened” hoặc “is damaged”</h3>
<p>Bản Mac chưa được Apple notarize nên macOS chặn lần mở đầu. Mở app một lần, rồi vào System Settings ▸ Privacy &amp; Security ▸ <b>Open Anyway</b> (macOS 15 trở lên), hoặc Control-click vào app ▸ Open (macOS 13 và 14). Nếu macOS báo app bị hỏng (damaged), chạy <code>xattr -dr com.apple.quarantine "/Applications/Better Explora.app"</code> trong Terminal. Mỗi lần cập nhật sẽ gặp lại cho tới khi app được notarize.</p>
<h3 id="ts-permissions">Quyền truy cập sau khi đổi tên</h3>
<p>Better Finder giờ là Better Explora. Quyền (Full Disk Access, thư mục, micro) gắn với chính app chứ không với tên, nên thường vẫn còn. Nếu không đọc được thư mục hoặc Thùng rác trống trơn, mở System Settings ▸ Privacy &amp; Security ▸ Full Disk Access, xoá dòng “Better Finder” cũ nếu có, thêm lại Better Explora bằng <b>+</b>, rồi thoát và mở lại app. Xoá app Better Finder cũ nếu nó còn trong Applications.</p>
<h3 id="ts-cache">Cache chiếm nhiều chỗ</h3>
<p>Thumbnail, ảnh xem lướt và bản phát được giữ lại để thư mục mở nhanh. Settings ▸ Storage cho biết phần nào chiếm chỗ, xoá từng phần, và giữ cache dưới một giới hạn. Xoá cache không đụng tới file, tag hay transcript; thumbnail được tạo lại khi cần.</p>
<h3 id="ts-index">Thông tin media sai hoặc thiếu</h3>
<p>Go ▸ Reload (<kbd>⌘</kbd> <kbd>R</kbd>) đọc lại thư mục. Go ▸ Index Subfolders đọc lại thư mục và mọi thứ bên trong. Thumbnail sai thì xoá Thumbnails &amp; scrub previews trong Settings ▸ Storage.</p>
<h3 id="ts-slow">Thư mục mạng và cloud chậm</h3>
<p>Trên ổ mạng, Better Explora chỉ đọc những gì đang hiện, và không bao giờ tải file chỉ có trên cloud khi bạn duyệt. Xem <a href="#limitations">Giới hạn</a>.</p>
<h3 id="ts-crash">App bị thoát đột ngột</h3>
<p>Lần mở sau, Better Explora hiện báo cáo crash của macOS. Bấm <b>Report…</b> để đưa nó vào báo lỗi, hoặc <b>Save as File…</b> để lưu. Không gì được gửi nếu bạn không tự gửi.</p>
<h3 id="ts-report">Báo lỗi hoặc cần hỗ trợ</h3>
<p>Help ▸ Report a Bug… gom phiên bản app và hệ điều hành, thêm vài dòng log gần nhất nếu bạn muốn; bạn xem hết trước, rồi chép, lưu, hoặc dán vào một <a href="https://github.com/gmttuts/better-finder/issues">GitHub issue</a> mới (issue là công khai). Câu hỏi gửi lên Discord; xem trang <a href="support.html">Hỗ trợ</a>. Ý tưởng tính năng mới gửi lên <a href="feedback.html">bảng góp ý</a>.</p>` },

      // ------------------------------------------------------------------ Limitations
      { id: "limitations", icon: "⚠️", t: { en: "Limitations", vi: "Giới hạn" },
        en: `
<p>What Better Explora can't do, or only does approximately, and why. Differences between Mac, Windows and Linux are in <a href="#os-limits">Mac, Windows and Linux</a>.</p>
<h3 id="lim-aep">After Effects viewer</h3>
<p>The frame is a sketch read from the project file. Not drawn: effects other than Gaussian Blur, Fill and Drop Shadow, plugins, adjustment layers, motion blur, expressions other than simple and common rig ones (time, value, expression controls and effect sliders, linear / ease, loopOut / loopIn, framesToTime, simple maths), 3D layers, cameras and lights, luma mattes (drawn as alpha), shape operators such as Repeater and Trim Paths, text animators, and layer styles other than Stroke, Drop Shadow, Outer Glow and Color Overlay. Label colours are After Effects' defaults. <b>Why:</b> only After Effects can render its own projects; Better Explora draws what it can read from the file. To see the real picture, use Render Preview, which needs After Effects installed. The viewer has not been tried on a real Windows or Linux computer yet.</p>
<h3 id="lim-prproj">Premiere Pro viewer</h3>
<p>The frame is a sketch: effects, transitions, titles and graphics (a labelled box) and blending modes are not drawn, keyframes with ease are drawn straight, and label colours are Premiere's defaults. <b>Why:</b> Better Explora reads the project file without Premiere. Open the project in Premiere for the real picture. The viewer has not been tried on a real Windows or Linux computer yet.</p>
<h3 id="lim-psd">Photoshop viewer</h3>
<p>The canvas shows the picture Photoshop saved in the file. When you show or hide layers one by one, layer effects (drop shadow, stroke…) and adjustment layers aren't drawn. A file saved without Maximize Compatibility shows only its small preview, and says so. <b>Why:</b> Better Explora reads the file without Photoshop and can't redo Photoshop's effects. The viewer has not been tried on a real Windows or Linux computer yet.</p>
<h3 id="lim-projects">Resolve, Final Cut, Filmora, VEGAS, Motion and template viewers</h3>
<p>The frame is a sketch from the project file and its media. Not drawn: DaVinci Resolve's Inspector values, effects, Fusion, colour and transitions; Final Cut Pro's effects, title looks, colour, transitions and speed ramps (a library shows no timeline: export the project as XML); Filmora's effects, masks, transitions, titles and keyframes; VEGAS Pro's track motion, masks, compositing and effects; Apple Motion's behaviours (other than Ramp, Overshoot and Rig), filters, particles, replicators, 3D and text animation. Template stills have no animation, masks or effects, and fonts that aren't on your computer are replaced. The Premiere version a .mogrt needs is a guess: Adobe doesn't write it. <b>Why:</b> Better Explora reads these files without their apps, and much of what they keep is compressed or not published. Open the project in its app for the real picture.</p>
<h3 id="lim-cavalry">Cavalry scenes</h3>
<p>Cavalry pictures need your own copy of the Cavalry Web Player (Settings ▸ File Types ▸ Cavalry). Some Cavalry features aren't in the Web Player yet (JavaScript layers, some filters), so a few pictures can differ from Cavalry. Pictures a scene uses are found only beside the .cv file or in its assets folder, and a scene that takes more than 15 seconds is skipped. <b>Why:</b> the Web Player is Scene Group's, and its terms may not allow other apps to ship it. It runs hidden and offline, reading only its own files and the scene it draws.</p>
<h3 id="lim-web">Web pages and SVG</h3>
<p>Pages and SVGs run offline and can read only files in their own folder, so a page that needs fonts, scripts or pictures from the web looks different until you click Load Online Content. A page that stops responding is stopped. Cloud-only, locked and read-only files open read only. <b>Why:</b> a page is code; keeping it in its folder and off the internet keeps your other files safe.</p>
<h3 id="lim-search">Search</h3>
<p>The name index covers your Home folder (and the cloud folders in it) and the drives you choose to index; elsewhere the palette uses Spotlight on Mac or reads the folder you search. Visual Search needs its model (Settings ▸ Visual Search), and English words work best. Colours are read in the background as folders open, so a folder you never opened isn't found by colour yet, and cloud-only files are never downloaded for it. Ask AI needs your own API key. <b>Why:</b> everything is read on your computer, without uploading your files.</p>
<h3 id="lim-render">Render Preview</h3>
<p>Needs the project's app installed (After Effects, Blender, Cinema 4D signed in, Nuke or Fusion). Previews are short and small (After Effects up to 30 seconds, Blender up to 10 seconds, 720 px). <b>Why:</b> Better Explora asks that app to render a copy; it can't render projects by itself. Without the app, use Choose Preview File. On Linux only Blender, Nuke and Fusion can render previews: After Effects and Cinema 4D have no Linux version.</p>
<h3 id="lim-figma">Figma files</h3>
<p>Not drawn yet: variables and their modes, inner shadows and shadow spread, image filters (exposure, contrast…). Prototypes and FigJam boards don't open, and files over about 600,000 layers or 2 GB aren't opened. <b>Why:</b> Better Explora reads the .fig file itself, without Figma, and Figma's file format isn't published; these parts aren't decoded yet.</p>
<h3 id="lim-pptx">PowerPoint files</h3>
<p>Charts and SmartArt show as a labelled box; videos show as their still picture; animations and transitions don't play; fonts embedded in the file aren't used (similar fonts replace them). Old .ppt files and Keynote files don't open in the viewer. <b>Why:</b> Better Explora draws the slides itself from the .pptx file, without PowerPoint. Open sends the file to PowerPoint or Keynote for the real thing.</p>
<h3 id="lim-pdf">PDF viewer</h3>
<p>It is a viewer: forms and annotations are shown but can't be filled in or edited. Use Open in Preview (Mac) or your PDF app for that.</p>
<h3 id="lim-exr">EXR, DPX and TGA</h3>
<p>Only the main picture is shown, not other layers or channels. On Windows and Linux one frame is read through FFmpeg.</p>
<h3 id="lim-archives">Archives</h3>
<p>Read-only: nothing inside can be renamed, moved or deleted, and you can't drag a file out of a browsed archive (use Extract to Archive's Folder). A whole folder inside can't be extracted on its own, and a lone .xz or .bz2 file isn't listed. <b>Why:</b> Better Explora reads archives without unpacking them, to keep your disk clean.</p>
<h3 id="lim-cloud">Cloud-only files</h3>
<p>A file that is only in the cloud shows the thumbnail its cloud app gives (or none), with no hover-scrub or media details until it's on your computer. <b>Why:</b> reading it would make Dropbox, iCloud or OneDrive download it, and browsing should never fill your disk.</p>
<h3 id="lim-network">Network drives</h3>
<p>Folder sizes aren't added up, and media details come only for the files on screen. <b>Why:</b> asking a server about every file is slow; Better Explora reads what you look at.</p>
<h3 id="lim-raw">Camera RAW</h3>
<p>Blackmagic RAW clips need Blackmagic RAW Player or DaVinci Resolve on the Mac (both free); on Windows and Linux they aren't decoded yet. ARRIRAW pictures need an add-on that isn't released yet; the card offers ARRI Reference Tool or DaVinci Resolve. R3D isn't decoded at all: the card opens the clip in DaVinci Resolve. <b>Why:</b> each maker's decoder has its own licence, so Better Explora uses the maker's own software instead of bundling it.</p>
<p>Camera RAW photos (CR2, CR3, NEF, ARW and others) on Windows and Linux show the JPEG preview the camera saved inside the file, not the RAW itself: no change of white balance or exposure, and a smaller picture when the camera kept only a small preview (Canon CR3: about 1620 pixels wide; some old or rare formats have a small one or none). <b>Why:</b> the Mac uses macOS's own RAW decoder; Windows and Linux have no common one, so Better Explora reads the camera's preview.</p>
<h3 id="lim-ffmpeg">Without FFmpeg (Mac, Linux AppImage)</h3>
<p>MKV, WebM and AVI, burning subtitles, image sequences, trimming GIFs, Compare and cloud transcription need FFmpeg. <b>Why:</b> macOS can't decode these by itself, and FFmpeg isn't bundled with the Mac app or the AppImage (<a href="#extras">Mac</a>, <a href="#install-linux">Linux</a>).</p>
<h3 id="lim-ai">AI features</h3>
<p>Made with AI? can only find marks a file carries; many tools leave none and re-exporting removes them, so “No” doesn't prove anything. SynthID has no public interface: Check on SynthID opens its website for you to check by hand. AI Review, Ask AI and cloud transcription need your own API key and send the text or audio to that service.</p>
<h3 id="lim-signing">Unsigned apps</h3>
<p>The Mac app isn't notarized and the Windows app isn't signed with a paid certificate, so macOS and SmartScreen warn on first launch (<a href="#getting-started">see Getting started</a>).</p>`,
        vi: `
<p>Những gì Better Explora chưa làm được, hoặc chỉ làm gần đúng, và lý do. Khác biệt giữa Mac, Windows và Linux nằm ở <a href="#os-limits">Mac, Windows và Linux</a>.</p>
<h3 id="lim-aep">Trình xem After Effects</h3>
<p>Khung hình là bản phác đọc từ file project. Chưa vẽ: effect ngoài Gaussian Blur, Fill và Drop Shadow, plugin, adjustment layer, motion blur, expression ngoài loại đơn giản và loại rig thường gặp (time, value, expression control và slider của effect, linear / ease, loopOut / loopIn, framesToTime, phép tính đơn giản), layer 3D, camera và đèn, luma matte (vẽ như alpha), shape operator như Repeater và Trim Paths, text animator, và layer style ngoài Stroke, Drop Shadow, Outer Glow và Color Overlay. Màu nhãn là màu mặc định của After Effects. <b>Lý do:</b> chỉ After Effects render được project của chính nó; Better Explora vẽ những gì đọc được từ file. Muốn xem hình thật, dùng Render Preview, cần cài After Effects. Trình xem chưa được thử trên máy Windows hay Linux thật.</p>
<h3 id="lim-prproj">Trình xem Premiere Pro</h3>
<p>Khung hình là bản phác: effect, transition, title và graphic (một khung có nhãn) và blending mode chưa được vẽ, keyframe có ease được vẽ thẳng, màu nhãn là màu mặc định của Premiere. <b>Lý do:</b> Better Explora đọc file project mà không cần Premiere. Mở project bằng Premiere để xem hình thật. Trình xem chưa được thử trên máy Windows hay Linux thật.</p>
<h3 id="lim-psd">Trình xem Photoshop</h3>
<p>Canvas hiện hình mà Photoshop đã lưu trong file. Khi bật / tắt từng layer, layer effect (drop shadow, stroke…) và adjustment layer không được vẽ. File lưu mà không bật Maximize Compatibility chỉ hiện ảnh xem trước nhỏ, và app có báo. <b>Lý do:</b> Better Explora đọc file mà không cần Photoshop và không tự làm lại được effect của Photoshop. Trình xem chưa được thử trên máy Windows hay Linux thật.</p>
<h3 id="lim-projects">Trình xem Resolve, Final Cut, Filmora, VEGAS, Motion và template</h3>
<p>Khung hình là bản phác từ file project và media của nó. Chưa vẽ: giá trị Inspector, effect, Fusion, màu và transition của DaVinci Resolve; effect, kiểu title, màu, transition và speed ramp của Final Cut Pro (library không có timeline: hãy xuất project ra XML); effect, mask, transition, title và keyframe của Filmora; track motion, mask, compositing và effect của VEGAS Pro; behaviour (ngoài Ramp, Overshoot và Rig), filter, particle, replicator, 3D và text animation của Apple Motion. Hình tĩnh của template không có chuyển động, mask hay effect, và font không có trên máy được thay bằng font khác. Bản Premiere mà file .mogrt cần chỉ là phỏng đoán: Adobe không ghi thông tin này. <b>Lý do:</b> Better Explora đọc các file này mà không cần app của chúng, và phần lớn dữ liệu bên trong bị nén hoặc không công khai. Mở project bằng app của nó để xem hình thật.</p>
<h3 id="lim-cavalry">Scene Cavalry</h3>
<p>Hình của Cavalry cần bản Cavalry Web Player bạn tự tải (Settings ▸ File Types ▸ Cavalry). Một số tính năng của Cavalry chưa có trong Web Player (JavaScript layer, vài filter), nên vài hình có thể khác Cavalry. Ảnh mà scene dùng chỉ được tìm cạnh file .cv hoặc trong thư mục assets của nó, và scene vẽ quá 15 giây thì bị bỏ qua. <b>Lý do:</b> Web Player là của Scene Group, và điều khoản của họ có thể không cho app khác đóng gói kèm. Player chạy ẩn, không có mạng, chỉ đọc file của chính nó và scene đang vẽ.</p>
<h3 id="lim-web">Trang web và SVG</h3>
<p>Trang web và SVG chạy không có mạng và chỉ đọc được file trong thư mục của chính nó, nên trang cần font, script hay ảnh trên mạng sẽ trông khác cho tới khi bạn bấm Load Online Content. Trang bị treo sẽ bị dừng. File chỉ có trên cloud, file bị khoá và file chỉ đọc thì mở ở chế độ chỉ xem. <b>Lý do:</b> trang web là code; giữ nó trong thư mục của nó và không cho ra mạng thì các file khác của bạn an toàn.</p>
<h3 id="lim-search">Tìm kiếm</h3>
<p>Chỉ mục tên gồm thư mục Home (và các thư mục cloud trong đó) và những ổ bạn chọn lập chỉ mục; ở nơi khác, bảng tìm dùng Spotlight trên Mac hoặc đọc thư mục bạn đang tìm. Visual Search cần model của nó (Settings ▸ Visual Search), và gõ tiếng Anh cho kết quả tốt nhất. Màu được đọc ở chế độ nền khi bạn mở thư mục, nên thư mục chưa từng mở thì chưa tìm theo màu được, và file chỉ có trên cloud không bao giờ bị tải về để đọc màu. Ask AI cần API key của bạn. <b>Lý do:</b> mọi thứ được đọc ngay trên máy, không tải file của bạn lên đâu cả.</p>
<h3 id="lim-render">Render Preview</h3>
<p>Cần cài app của project (After Effects, Blender, Cinema 4D đã đăng nhập, Nuke hoặc Fusion). Preview ngắn và nhỏ (After Effects tối đa 30 giây, Blender tối đa 10 giây, 720 px). <b>Lý do:</b> Better Explora nhờ app đó render một bản sao; tự nó không render được project. Không có app thì dùng Choose Preview File. Trên Linux chỉ Blender, Nuke và Fusion render preview được: After Effects và Cinema 4D không có bản Linux.</p>
<h3 id="lim-figma">File Figma</h3>
<p>Chưa vẽ được: variables và mode của chúng, inner shadow và độ loang (spread) của bóng, filter ảnh (exposure, contrast…). Prototype và bảng FigJam không mở được, và file trên khoảng 600.000 layer hoặc 2 GB thì không mở. <b>Lý do:</b> Better Explora tự đọc file .fig, không cần Figma, mà định dạng file của Figma không công khai; các phần này chưa giải mã được.</p>
<h3 id="lim-pptx">File PowerPoint</h3>
<p>Chart và SmartArt hiện thành một khung có nhãn; video chỉ hiện hình tĩnh; hiệu ứng chuyển động và chuyển slide không chạy; font nhúng trong file không được dùng (thay bằng font tương tự). File .ppt cũ và file Keynote không mở được trong trình xem. <b>Lý do:</b> Better Explora tự vẽ slide từ file .pptx, không dùng PowerPoint. Nút Open mở file bằng PowerPoint hoặc Keynote để xem đúng như thật.</p>
<h3 id="lim-pdf">Trình xem PDF</h3>
<p>Chỉ để xem: form và ghi chú có hiện nhưng không điền hay sửa được. Muốn làm việc đó, dùng Open in Preview (Mac) hoặc app PDF của bạn.</p>
<h3 id="lim-exr">EXR, DPX và TGA</h3>
<p>Chỉ hiện hình chính, không hiện các layer hay kênh khác. Trên Windows và Linux, một khung hình được đọc qua FFmpeg.</p>
<h3 id="lim-archives">File nén</h3>
<p>Chỉ đọc: không đổi tên, di chuyển hay xoá được gì bên trong, và không kéo file ra khỏi file nén đang duyệt được (dùng Extract to Archive's Folder). Không giải nén riêng cả một thư mục bên trong, và file .xz hoặc .bz2 đứng riêng không liệt kê được. <b>Lý do:</b> Better Explora đọc file nén mà không bung ra, để ổ đĩa của bạn sạch.</p>
<h3 id="lim-cloud">File chỉ có trên cloud</h3>
<p>File chỉ nằm trên cloud hiện thumbnail do app cloud cung cấp (hoặc không có), không rê xem lướt và không có thông tin media cho tới khi file về máy. <b>Lý do:</b> đọc file sẽ khiến Dropbox, iCloud hay OneDrive tải nó về, mà duyệt file thì không bao giờ được làm đầy ổ đĩa.</p>
<h3 id="lim-network">Ổ mạng</h3>
<p>Không tính dung lượng thư mục, và chỉ đọc thông tin media cho các file đang thấy. <b>Lý do:</b> hỏi máy chủ về từng file rất chậm; Better Explora chỉ đọc thứ bạn đang xem.</p>
<h3 id="lim-raw">Camera RAW</h3>
<p>Clip Blackmagic RAW cần Blackmagic RAW Player hoặc DaVinci Resolve trên Mac (đều miễn phí); trên Windows và Linux chưa giải mã được. Hình ARRIRAW cần add-on chưa phát hành; thẻ của clip có nút mở bằng ARRI Reference Tool hoặc DaVinci Resolve. R3D hoàn toàn không giải mã: thẻ mở clip bằng DaVinci Resolve. <b>Lý do:</b> bộ giải mã của mỗi hãng có giấy phép riêng, nên Better Explora dùng phần mềm của chính hãng thay vì đóng gói kèm.</p>
<p>Ảnh RAW máy ảnh (CR2, CR3, NEF, ARW và các loại khác) trên Windows và Linux hiện ảnh JPEG xem trước mà máy ảnh lưu sẵn trong file, không phải chính file RAW: không chỉnh được cân bằng trắng hay độ sáng, và ảnh nhỏ hơn khi máy ảnh chỉ lưu ảnh xem trước nhỏ (Canon CR3: rộng khoảng 1620 pixel; vài định dạng cũ hoặc hiếm chỉ có ảnh nhỏ hoặc không có). <b>Lý do:</b> Mac dùng bộ giải mã RAW của macOS; Windows và Linux không có bộ chung nào, nên Better Explora đọc ảnh xem trước của máy ảnh.</p>
<h3 id="lim-ffmpeg">Khi không có FFmpeg (Mac, AppImage trên Linux)</h3>
<p>MKV, WebM, AVI, đốt phụ đề, chuỗi ảnh, cắt GIF, Compare và transcript qua cloud cần FFmpeg. <b>Lý do:</b> macOS không tự giải mã được các định dạng này, và FFmpeg không đi kèm app Mac hay AppImage (<a href="#extras">Mac</a>, <a href="#install-linux">Linux</a>).</p>
<h3 id="lim-ai">Tính năng AI</h3>
<p>Made with AI? chỉ tìm được dấu vết mà file mang theo; nhiều công cụ không để lại dấu, và xuất lại file sẽ xoá dấu, nên “No” không chứng minh được gì. SynthID không có giao diện công khai: Check on SynthID mở trang web của họ để bạn tự kiểm. AI Review, Ask AI và transcript qua cloud cần API key của bạn và gửi chữ hoặc âm thanh tới dịch vụ đó.</p>
<h3 id="lim-signing">App chưa ký</h3>
<p>Bản Mac chưa được notarize và bản Windows chưa ký bằng chứng chỉ trả phí, nên macOS và SmartScreen cảnh báo ở lần mở đầu (<a href="#getting-started">xem Bắt đầu</a>).</p>` },
    ],
  };
})();
