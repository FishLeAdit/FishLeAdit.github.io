import { Folder } from "@/types";

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
    name: "About98.portfolio",
    message: "Opens the 98.portfolio document.",
  },
];

export const folders: Folder[] = [
  {
    id: 4,
    name: "Projects",
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
    { label: "About 98.portfolio" },
  ],
};
