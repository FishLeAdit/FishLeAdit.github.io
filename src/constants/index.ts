import { Folder } from "@/types";

export const OWNER = {
  name: "Jawad Adit Chowdhury",
  role: "Full-stack & ML Developer",
  stacks: "React, Node, MongoDB, PyTorch",
  languages: "English, Bengali, French",
  email: "jawadadit05@gmail.com",
  phone: "+8801535848853",
  github: "https://github.com/FishLeAdit",
  linkedin: "https://www.linkedin.com/in/jawad-adit-chowdhury-b24b53239",
};

// Initials in the "ANSI Shadow" style the boot screens use.
export const LOGO_ASCII = `
     ██╗ █████╗  ██████╗
     ██║██╔══██╗██╔════╝
     ██║███████║██║
██   ██║██╔══██║██║
╚█████╔╝██║  ██║╚██████╗
 ╚════╝ ╚═╝  ╚═╝ ╚═════╝`;

export const TEMPLATE = {
  name: "98.portfolio",
  author: "Alexandre Dresch",
  repo: "https://github.com/AlexandreDresch/98.portfolio",
  authorGithub: "https://github.com/AlexandreDresch",
};

export const RESUME = {
  title: "My Resume",
  documentPath: "/Jawad_Adit_Chowdhury_CV.pdf",
  documentType: "pdf" as const,
  folderName: "My Resume",
  icon: "/icons/notepad.png",
};

// Pixel-art icons per project, keyed by Project.name (drawn by
// scripts/icons/generate-project-icons.mjs). Projects without one fall back to
// a generic icon for their type.
export const PROJECT_ICONS: Record<string, string> = {
  Stackwise: "/icons/projects/stackwise.svg",
  ECOTRACK: "/icons/projects/ecotrack.svg",
  "Pediatric Brain Tumor Segmentation": "/icons/projects/brain-tumor.svg",
  "git-why": "/icons/projects/git-why.svg",
};

// Label for a project's live-site shortcut, keyed by Project.name; the
// project's own name is used when there is no entry.
export const PROJECT_LINK_LABELS: Record<string, string> = {
  "git-why": "git-why.io",
};

// Static 90s-style write-up pages in /public, keyed by Project.writeup.
export const WRITEUPS: Record<string, { title: string; path: string }> = {
  "brain-tumor": {
    title: "HSRD: Pediatric Brain Tumor Segmentation",
    path: "/brain-tumor/index.html",
  },
  // Not "/git-why/": that path is the live git-why site (its own repository).
  "git-why": {
    title: "git-why: Ask Why a Repo Changed",
    path: "/git-why-writeup/index.html",
  },
};

export const FooterMessages = [
  {
    name: "Folder",
    message: "Creates a new folder.",
  },
  {
    name: "Shortcut",
    message: "Creates a shortcut to quickly access your files or applications.",
  },
  {
    name: "TextDocument",
    message: "Creates a new text document for your notes and simple writings.",
  },
  {
    name: "WordPadDocument",
    message: "Creates a new WordPad document for rich text editing.",
  },
  {
    name: "BitmapImage",
    message: "Creates a new bitmap image for your drawings and graphics.",
  },
  {
    name: "WaveSound",
    message: "Creates a new wave sound file for your audio recordings.",
  },
  {
    name: "CreateShortcut",
    message: "Creates shortcuts to the selected items.",
  },
  {
    name: "Delete",
    message: "Deletes the selected item.",
  },
  {
    name: "Rename",
    message: "Renames the selected item.",
  },
  {
    name: "Properties",
    message: "Displays the properties of the selected items.",
  },
  {
    name: "WorkOffline",
    message: "Shows Web pages without downloading them.",
  },
  {
    name: "Close",
    message: "Closes the current window.",
  },
  {
    name: "Undo",
    message: "Undo the last action.",
  },
  {
    name: "CutCtrl+X",
    message: "Removes the selected items and copies them onto the Clipboard.",
  },
  {
    name: "CopyCtrl+C",
    message:
      "Copies the selected items to the Clipboard. To put them in the new location, use the Paste command.",
  },
  {
    name: "PasteCtrl+V",
    message:
      "Inserts the items you have copied or cut into the selected location.",
  },
  {
    name: "PasteShortcut",
    message:
      "Creates shortcuts to the items you have copied or cut into the selected location.",
  },
  {
    name: "SelectAllCtrl+A",
    message: "Select all items in window.",
  },
  {
    name: "InvertSelection",
    message: "Reverses which items are selected and which are not.",
  },
  {
    name: "StandardButtons",
    message: "Displays the Standard Buttons toolbar.",
  },
  {
    name: "AddressBar",
    message: "Displays the Address bar.",
  },
  {
    name: "Links",
    message: "Displays the Quick Links bar.",
  },
  {
    name: "Radio",
    message: "Displays the Radio bar.",
  },
  {
    name: "TextLabels",
    message: "Adds a text label under each toolbar button.",
  },
  {
    name: "StatusBar",
    message: "Shows or hides the status bar.",
  },
  {
    name: "SearchCtrl+E",
    message: "Shows the Search bar.",
  },
  {
    name: "FavoritesCtrl+I",
    message: "Shows the Favorites bar.",
  },
  {
    name: "HistoryCtrl+H",
    message: "Shows the History bar.",
  },
  {
    name: "Folders",
    message: "Shows the Folders bar.",
  },
  {
    name: "TipoftheDay",
    message: "Shows a tip about the system.",
  },
  {
    name: "asWebPage",
    message: "Displays items in Web View.",
  },
  {
    name: "LargeIcons",
    message: "Displays items by using large icons.",
  },
  {
    name: "SmallIcons",
    message: "Displays items by using small icons.",
  },
  {
    name: "List",
    message: "Displays items in a list.",
  },
  {
    name: "Details",
    message: "Displays information about each item in the window.",
  },
  {
    name: "byName",
    message: "Sorts items alphabetically by name.",
  },
  {
    name: "byType",
    message: "Sorts items by type.",
  },
  {
    name: "bySize",
    message: "Sorts items by size, from smallest to largest.",
  },
  {
    name: "byDate",
    message: "Sorts items by date, from oldest to most recent.",
  },
  {
    name: "AutoArrange",
    message: "Arranges the icons automatically.",
  },
  {
    name: "LineUpIcons",
    message: "Arranges icons in a grid.",
  },
  {
    name: "RefreshF5",
    message: "Refreshes the content of current page.",
  },
  {
    name: "FolderOptions...",
    message: "Enables you to change settings.",
  },
  {
    name: "BackAlt+LeftArrow",
    message: "Goes to the previous page.",
  },
  {
    name: "ForwardAlt+RightArrow",
    message: "Goes to the next page.",
  },
  {
    name: "UpOneLevel",
    message: "Goes up one level.",
  },
  {
    name: "HomePageAlt+Home",
    message: "Goes to your home page.",
  },
  {
    name: "ChannelGuide",
    message: "Opens the Channel Guide page.",
  },
  {
    name: "SearchtheWeb",
    message: "Opens Internet Explorer.",
  },
  {
    name: "MyComputer",
    message: "Opens My Computer.",
  },
  {
    name: "InternetCall",
    message: "Opens your Internet call and meeting program.",
  },
  {
    name: "AddtoFavorites...",
    message: "Adds the current page to your Favorites list.",
  },
  {
    name: "OrganizeFavorites...",
    message: "Opens the Favorites folder.",
  },
  {
    name: "(empty)",
    message: "I'm just an empty space.",
  },
  {
    name: "FilesorFolders...",
    message: "Searches for Files or Folders.",
  },
  {
    name: "Computer...",
    message: "Searches on Computer settings.",
  },
  {
    name: "OntheInternet...",
    message: "Searches on the Internet.",
  },
  {
    name: "MapNetworkDrive...",
    message: "Connects to a network drive.",
  },
  {
    name: "DisconnectNetworkDrive...",
    message: "Disconnects from a network drive.",
  },
  {
    name: "Synchronize...",
    message: "Updates all offline content.",
  },
  {
    name: "HelpTopics",
    message: "Opens Help.",
  },
  {
    name: "About",
    message: "Shows who made the original desktop template.",
  },
];

export const folders: Folder[] = [
  {
    id: 4,
    name: "Projects",
    description:
      "Things I have built. Double-click a project to open it: README, live site, source code and write-ups.",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/folder.png",
    isDocument: false,
    documentType: null,
    documentPath: null,
  },
  {
    id: 8,
    name: "Contact me",
    description: "E-mail, phone, GitHub and LinkedIn. My inbox is always open.",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/modem.png",
    isDocument: false,
    documentType: null,
    documentPath: null,
  },
];

export const programs = [
  {
    id: 10,
    name: "Internet Explorer",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/icons/internet-explorer.png",
  },
  {
    id: 11,
    name: "Image Viewer",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/icons/kodak-image.png",
  },
  {
    id: 19,
    name: "Display",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/icons/display.png",
    description: "Adjust display settings such as resolution and color depth.",
  },
  {
    id: 25,
    name: "Document Viewer",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/icons/file.png",
    description: "View and read documents in various formats.",
  },
  {
    id: 30,
    name: "About",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/icons/help-book.png",
    description: "Credits for the desktop template this portfolio is built on.",
  },
  {
    id: 31,
    name: "Solitaire",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    image: "/icons/solitaire.svg",
    description: "Klondike Solitaire, just like Windows 98.",
  },
];

export const folderNavigationMenuItems = {
  file: [
    {
      label: "New",
      items: [
        { label: "Folder", disabled: true },
        { label: "Shortcut", disabled: true },
        { label: "Text Document", disabled: true },
        { label: "WordPad Document", disabled: true },
        { label: "Bitmap Image", disabled: true },
        { label: "Wave Sound", disabled: true },
      ],
    },
    { label: "Create Shortcut", disabled: true },
    { label: "Delete" },
    { label: "Rename" },
    { label: "Properties", disabled: true },
    { label: "Work Offline" },
    { label: "Close" },
  ],
  edit: [
    { label: "Undo", disabled: true },
    { label: "Cut", disabled: true, shortcut: "Ctrl+X" },
    { label: "Copy", disabled: true, shortcut: "Ctrl+C" },
    { label: "Paste", disabled: true, shortcut: "Ctrl+V" },
    { label: "Paste Shortcut", disabled: true },
    { label: "Select All", shortcut: "Ctrl+A" },
    { label: "Invert Selection" },
  ],
  view: [
    {
      label: "Toolbars",
      items: [
        { label: "Standard Buttons" },
        { label: "Address Bar" },
        { label: "Links", disabled: true },
        { label: "Radio", disabled: true },
        { label: "Text Labels" },
      ],
    },
    { label: "Status Bar" },
    {
      label: "Explorer Bar",
      items: [
        { label: "Search", disabled: true, shortcut: "Ctrl+E" },
        { label: "Favorites", disabled: true, shortcut: "Ctrl+I" },
        { label: "History", disabled: true, shortcut: "Ctrl+H" },
        { label: "Folders", disabled: true },
        { label: "Tip of the Day", disabled: true },
      ],
    },
    { label: "as Web Page" },
    { label: "Large Icons" },
    { label: "Small Icons" },
    { label: "List" },
    { label: "Details", disabled: true },
    {
      label: "Arrange Icons",
      items: [
        { label: "by Name" },
        { label: "by Type" },
        { label: "by Size" },
        { label: "by Date" },
        { label: "Auto Arrange", disabled: true },
      ],
    },
    { label: "Line Up Icons", disabled: true },
    { label: "Refresh", shortcut: "F5" },
    { label: "Folder Options...", disabled: true },
  ],
  go: [
    { label: "Back", disabled: true, shortcut: "Alt+Left Arrow" },
    { label: "Forward", disabled: true, shortcut: "Alt+Right Arrow" },
    { label: "Up One Level" },
    { label: "Home Page", shortcut: "Alt+Home" },
    { label: "Channel Guide" },
    { label: "Search the Web" },
    { label: "My Computer" },
    { label: "Internet Call" },
  ],
  favorites: [
    { label: "Add to Favorites...", disabled: true },
    { label: "Organize Favorites...", disabled: true },
    { label: "(empty)", disabled: true },
  ],
  tools: [
    {
      label: "Find",
      items: [
        { label: "Files or Folders...", disabled: true },
        { label: "Computer...", disabled: true },
        { label: "On the Internet...", disabled: true },
      ],
    },
    { label: "Map Network Drive..." },
    { label: "Disconnect Network Drive..." },
    { label: "Synchronize..." },
  ],
  help: [
    { label: "Help Topics", disabled: true },
    { label: "About", opensWindow: 30 },
  ],
};
