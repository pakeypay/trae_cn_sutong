(function () {
  function icon(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }

  const icons = {
    home: icon('<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>'),
    grid: icon('<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>'),
    book: icon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>'),
    calendar: icon('<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>'),
    package: icon('<path d="m21 8-9-5-9 5 9 5 9-5Z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path>'),
    space: icon('<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path><path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path>'),
    chart: icon('<path d="M3 3v18h18"></path><path d="M7 16l4-4 3 3 5-7"></path>'),
    users: icon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'),
    check: icon('<path d="M20 6 9 17l-5-5"></path>'),
    edit: icon('<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>'),
    settings: icon('<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.4-1.68 1.7 1.7 0 0 0-1.52.47l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.8a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.47-1.52l-.06-.06A2 2 0 1 1 6.9 3.59l.06.06A1.7 1.7 0 0 0 8.8 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.8a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.6 4.6a1.7 1.7 0 0 0 1.52-.47l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 8.8c.16.4.47.73.88.92.2.1.42.16.65.18H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.1z"></path>'),
    chevron: icon('<path d="m6 9 6 6 6-6"></path>'),
    menuFold: icon('<path d="M4 6h16"></path><path d="M4 12h10"></path><path d="M4 18h16"></path><path d="m18 9 3 3-3 3"></path>'),
    award: icon('<circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>'),
    folder: icon('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>'),
    stethoscope: icon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>'),
    star: icon('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>'),
    target: icon('<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>'),
    user: icon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'),
    building: icon('<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>'),
    box: icon('<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>'),
    clipboardList: icon('<rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path>'),
    list: icon('<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>'),
    database: icon('<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>'),
    table: icon('<path d="M12 3v18"></path><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path>'),
    refresh: icon('<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path>'),
    userPlus: icon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line>'),
    trophy: icon('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>'),
    clipboard: icon('<rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>'),
    presentation: icon('<path d="M2 3h20"></path><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path><path d="m7 21 5-5 5 5"></path>'),
    clock: icon('<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'),
    graduationCap: icon('<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>'),
    flask: icon('<path d="M9 3h6"></path><path d="M10 3v6L4 19a1 1 0 0 0 .87 1.5h14.26A1 1 0 0 0 20 19l-6-10V3"></path><path d="M6 15h12"></path>'),
    pieChart: icon('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>'),
    userCircle: icon('<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"></path>'),
    exclamationCircle: icon('<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'),
    shoppingCart: icon('<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>'),
    folderOpen: icon('<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6.5A2 2 0 0 1 18.46 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"></path>'),
    chalkboardTeacher: icon('<path d="M2 4h20v12H2z"></path><path d="M2 16h20"></path><path d="M6 20h12"></path><circle cx="8" cy="10" r="2"></circle><path d="M14 8h4"></path><path d="M14 12h4"></path>'),
    doorClosed: icon('<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path><path d="M2 20h20"></path><path d="M14 12v.01"></path>'),
    boxOpen: icon('<path d="M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"></path><path d="M2 9l10-6 10 6"></path><path d="M12 3v10"></path>'),
    play: icon('<polygon points="5 3 19 12 5 21 5 3"></polygon>'),
    mapMarkerAlt: icon('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle>'),
    timesCircle: icon('<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'),
    sync: icon('<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path>'),
    search: icon('<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>'),
    bell: icon('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>'),
    alertTriangle: icon('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>'),
    userChart: icon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21V8"></path><path d="m19 11 3 3-3 3"></path>'),
    fileVideo: icon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m10 11 5 3-5 3v-6z"></path>'),
    lightbulb: icon('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path>'),
    checkCircle: icon('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'),
    hourglassHalf: icon('<path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>'),
    userCheck: icon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline>'),
    heart: icon('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>'),
    poll: icon('<path d="M3 3v18h18"></path><rect x="7" y="10" width="3" height="8"></rect><rect x="13" y="6" width="3" height="12"></rect>'),
    userMd: icon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M12 14h.01"></path><path d="M8 14h8"></path>'),
    userGraduate: icon('<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>'),
    bookMedical: icon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path><path d="M12 6v6"></path><path d="M9 9h6"></path>'),
    boxes: icon('<path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path>'),
    doorOpen: icon('<path d="M13 4h3a2 2 0 0 1 2 2v14"></path><path d="M2 20h3"></path><path d="M13 20h9"></path><path d="M10 12v.01"></path><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"></path>'),
    plus: icon('<path d="M5 12h14"></path><path d="M12 5v14"></path>'),
    chevronRight: icon('<path d="m9 18 6-6-6-6"></path>'),
    chevronLeft: icon('<path d="m15 18-6-6 6-6"></path>'),
    wrench: icon('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>'),
    calendarCheck: icon('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path>'),
    tasks: icon('<path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>'),
    history: icon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path>'),
    infoCircle: icon('<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'),
    send: icon('<path d="M22 2 11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path>'),
    qrcode: icon('<rect x="2" y="2" width="8" height="8" rx="1"></rect><path d="M7 2v8"></path><path d="M2 7h8"></path><rect x="14" y="2" width="8" height="8" rx="1"></rect><path d="M19 2v8"></path><path d="M14 7h8"></path><rect x="2" y="14" width="8" height="8" rx="1"></rect><path d="M7 14v8"></path><path d="M2 19h8"></path><path d="M14 14h2v2h-2z"></path><path d="M20 14h2v2h-2z"></path><path d="M14 20h2v2h-2z"></path><path d="M20 20h2v2h-2z"></path>'),
    undo: icon('<path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>'),
    camera: icon('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle>'),
    userShield: icon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M12 11v2"></path><path d="M12 17h.01"></path>'),
    usersClass: icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'),
    userTie: icon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M12 11l-2 4h4l-2-4z"></path>'),
    exchange: icon('<path d="M7 16V4m0 0L3 8m4-4l4 4"></path><path d="M17 8v12m0 0l4-4m-4 4l-4-4"></path>'),
    info: icon('<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'),
    alertCircle: icon('<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path>'),
    trendingUp: icon('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>'),
    smartphone: icon('<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path>'),
    arrowLeft: icon('<path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path>'),
    arrowRight: icon('<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>'),
    medal: icon('<path d="M7.21 15 2.61 7.54a2 2 0 0 1 .06-2.22l.15-.21a2 2 0 0 1 2.22-.06L12.5 9l-5.29 6Z"></path><path d="M14.5 9 17.04 5.1a2 2 0 0 1 2.22-.06l.15.21a2 2 0 0 1 .06 2.22L14.79 15"></path><path d="M12 9 16.5 15H7.5L12 9Z"></path><path d="M12 15v7"></path>'),
    idCard: icon('<rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path d="M15 8h2"></path><path d="M15 12h2"></path><path d="M7 16h10"></path>'),
  };

  const roles = {
    teacher: {
      roleName: '授课老师 / 助教老师', userName: '张老师', userRole: '授课老师', avatar: '张', defaultActive: '工作台',
      notes: ['课程准备、排课确认放在首页待办或课程详情中。', '签到互动、课后记录进入具体课次后处理。', '教学资源放在课程开发或课程详情，不单独进入左侧导航。', '“服务大厅”提供场地、物资及教研相关线上自助审批申请。'],
      moduleEntrances: {
        '工作台': ['今日课表', '待办任务', '最新通知', '快速应用'],
        '我的教学': ['我的授课'],
        '课程开发': ['课程草稿', '已提交课程', '已发布课程', '新建课程', '上传 / 生成教案'],
        '教学资源库': ['个人云盘', '科室云盘', '教学示范库', '院级公共库'],
        '评估任务': ['成绩录入', '学生评价', '课程反馈', '作业批改'],
        '我的成果': ['成果申报', '我的学员画像', '我的画像']
      },
      navItems: [
        { label: '工作台', icon: icons.home },
        { label: '我的教学', icon: icons.calendar, children: ['我的授课'] },
        { label: '课程开发', icon: icons.edit },
        { label: '教学资源库', icon: icons.folder },
        { label: '评估任务', icon: icons.check },
        { label: '我的成果', icon: icons.award, children: ['成果申报', '我的学员画像', '我的画像'] }
      ]
    },

    student: {
      roleName: '学生', userName: '王同学', userRole: '住培学员', avatar: '王', defaultActive: '工作台',
      notes: ['待完成任务、课程进度和学习数据放在首页。', '签到和课堂互动放在课程详情或课次页。', '消息通知使用顶部入口，不进入左侧导航。', '“服务大厅”可自助预约自主实训教室、模型及查询申请状态。'],
      moduleEntrances: {
        '工作台': ['待完成任务', '学习进度', '今日日程', '快捷应用'],
        '我的学习': ['我的轮转', '我的课程', '自适应学习 ⚡'],
        '选课报名': ['可选课程', '我的报名', '候补状态', '报名审核状态'],
        '训练与考试': ['自主训练', 'OSCE'],
        '评估任务': ['作业考试', '成绩评价', '课程评价', '老师评价'],
        '我的成果': ['成果申报', '我的证书', '我的画像']
      },
      navItems: [
        { label: '工作台', icon: icons.home },
        { label: '我的学习', icon: icons.book, children: ['我的轮转', '我的课程', '自适应学习 ⚡'] },
        { label: '选课报名', icon: icons.calendar },
        { label: '训练与考试', icon: icons.edit, children: ['自主训练', 'OSCE'] },
        { label: '评估任务', icon: icons.check },
        { label: '我的成果', icon: icons.award, children: ['成果申报', '我的证书', '我的画像'] }
      ]
    },

    admin: {
      roleName: '超级管理员 / 院长', userName: '王院长', userRole: '超级管理员', avatar: '王', defaultActive: '工作台',
      notes: ['数据大屏展示全院的核心教学、物资与空间运行指标。', '首页承载全局数据、质量风险 and 待办。', '课程中心管理全量课程池、课程开发 and 课程审核。'],
      moduleEntrances: {
        '工作台': ['今日待办', '重点工作', '工作推进'],
        '数据大屏': ['师资情况', '学员情况', '课程情况', '评估情况', '物资情况', '空间情况'],
        '轮转管理': ['轮转安排', '教学活动'],
        '课程管理': ['课程开发', '课程池', '课程实施'],
        '排课管理': ['开课条件总览', '已排课表', '报名情况'],
        '空间管理': ['空间预约审批', '班牌和大屏管理'],
        '物资管理': ['物资工作台', '物资档案', '维修管理', '盘点管理', '课程使用和临时借用', '归还签收'],
        '教学资源库': ['个人云盘', '科室云盘', '公共库'],
        '师生管理': ['师资管理', '学员管理'],
        '成果管理': ['科研成果', '教学奖励'],
        '评估管理': ['学员评价体系配置', '教师评价体系配置', '评估工具库', '评估任务中心', '评估结果与分析']
      },
      navItems: [
        { label: '工作台', icon: icons.home },
        { label: '数据大屏', icon: icons.chart },
        { label: '轮转管理', icon: icons.stethoscope, children: ['轮转安排', '教学活动'] },
        { label: '课程管理', icon: icons.book, children: ['课程开发', '课程池', '课程实施'] },
        { label: '排课管理', icon: icons.calendar, children: ['开课条件总览', '已排课表', '报名情况'] },
        { label: '空间管理', icon: icons.space, children: ['空间预约审批', '班牌和大屏管理'] },
        { label: '物资管理', icon: icons.package, children: ['物资工作台', '物资档案', '维修管理', '盘点管理', '课程使用和临时借用', '归还签收'] },
        { label: '教学资源库', icon: icons.folder },
        { label: '师生管理', icon: icons.users, children: ['师资管理', '学员管理'] },
        { label: '成果管理', icon: icons.award },
        { label: '评估管理', icon: icons.check, children: ['学员评价体系配置', '教师评价体系配置', '评估工具库', '评估任务中心', '评估结果与分析'] }
      ]
    },

    scheduler: {
      roleName: '排课 + 场地管理员', userName: '刘老师', userRole: '排课场地管理员', avatar: '刘', defaultActive: '服务大厅',
      notes: ['待排课程、冲突检查、教师确认 and 通知发送放在排课管理页面内。', '空间统计 and 空间冲突放在空间管理首页或工作台侧栏。', '不单独设置通知发布或数据看板导航。'],
      moduleEntrances: {
        '服务大厅': ['场地预约（含物资）', '我的申请'],
        '排课管理': ['待排课程', '可视化排课', '开课条件总览', '冲突检查', '教师确认', '通知发送', '调课 / 改课记录', '报名情况'],
        '空间管理': ['预约审核', '占用日历', '空间冲突', '临时场地调整', '使用记录', '空间利用率']
      },
      navItems: [
        { label: '服务大厅', icon: icons.folder },
        { label: '排课管理', icon: icons.calendar, children: ['可视化排课', '开课条件总览', '已排课程管理', '报名情况'] },
        { label: '空间管理', icon: icons.space, children: ['空间预约审批', '空间资产管理', '班牌和大屏管理'] }
      ]
    },

    material: {
      roleName: '物资管理员', userName: '陈老师', userRole: '物资管理员', avatar: '陈', defaultActive: '服务大厅',
      notes: ['今日课程物资、异常 and 超期归还放在物资工作台。', '课程相关使用与归还签收放在物资准备模块。', '运营数据放首页，不进入左侧导航。'],
      moduleEntrances: {
        '服务大厅': ['物资申请（不包含场地）', '我的申请'],
        '物资管理': ['物资工作台', '物资档案', '维修管理', '盘点管理'],
        '物资准备': ['课程使用和临时借用', '归还签收']
      },
      navItems: [
        { label: '服务大厅', icon: icons.folder },
        { label: '物资管理', icon: icons.package, children: ['物资工作台', '物资档案', '维修管理', '盘点管理'] },
        { label: '物资准备', icon: icons.package, children: ['课程使用和临时借用', '归还签收'] }
      ]
    },

    external: {
      roleName: '校外学生', userName: '陈同学', userRole: '校外学生', avatar: '陈', defaultActive: '服务大厅',
      notes: ['只能看到 and 选修标注为"校外开放"的课程。', '课程均为短期项目制（1-2天），集中在周末。', '学分认定方式与校内 student 不同，证书有独立编号体系。', '不需要学分/绩点管理，主要关注证书获取。'],
      moduleEntrances: {
        '服务大厅': ['场地预约（含物资）', '我的申请'],
        '选课中心': ['校外开放课程', '我的报名', '候补状态'],
        '我的课程': ['已报名', '进行中', '已完成', '课次详情'],
        '我的证书': ['我的证书', '证书查询', '证书下载']
      },
      navItems: [
        { label: '服务大厅', icon: icons.folder },
        { label: '选课中心', icon: icons.book },
        { label: '我的课程', icon: icons.calendar },
        { label: '我的证书', icon: icons.award }
      ]
    },

    'academic-affairs': {
      roleName: '学院教务管理员', userName: '刘国强', userRole: '管理员 / 教务主任', avatar: '刘', defaultActive: '首页',
      notes: ['首页承载全局数据、质量风险及今日待办。', '课程中心管理全量课程池、课程开发与课程实施。', '评估管理含学员/教师评价体系、评估工具库、评估任务中心、评估结果与分析。'],
      moduleEntrances: {
        '首页': ['今日待办', '重点工作', '工作推进'],
        '轮转管理': ['轮转安排', '教学活动'],
        '课程管理': ['课程开发', '课程池', '课程实施'],
        '排课管理': ['已排课表', '报名情况'],
        '空间管理': ['空间预约审批', '空间资产管理', '班牌和大屏管理'],
        '物资管理': ['物资工作台', '物资档案', '维修管理', '盘点管理'],
        '教学资源库': ['个人云盘', '科室云盘', '公共库'],
        '师生管理': ['师资管理', '学员管理'],
        '成果管理': ['科研成果', '教学奖励'],
        '评估管理': ['学员评价体系配置', '教师评价体系配置', '评估工具库', '评估任务中心', '评估结果与分析']
      },
      navItems: [
        { label: '首页', icon: icons.home },
        { label: '轮转管理', icon: icons.stethoscope, children: ['轮转安排', '教学活动'] },
        { label: '课程管理', icon: icons.book, children: ['课程开发', '课程池', '课程实施'] },
        { label: '排课管理', icon: icons.calendar, children: ['已排课表', '报名情况'] },
        { label: '空间管理', icon: icons.space },
        { label: '物资管理', icon: icons.package },
        { label: '教学资源库', icon: icons.folder },
        { label: '师生管理', icon: icons.users, children: ['师资管理', '学员管理'] },
        { label: '成果管理', icon: icons.award },
        {
          label: '评估管理', icon: icons.check,
          children: [
            {
              label: '学员评价体系配置',
              children: ['胜任力框架配置', 'EPA 评价框架', '培训目标管理']
            },
            '教师评价体系配置',
            {
              label: '评估工具库',
              children: ['评估表单', '理论题库', '实操录评']
            },
            {
              label: '评估任务中心',
              children: ['评估学员', '评估教师', '评估教学活动', '评估课程']
            },
            {
              label: '评估结果与分析',
              children: ['综合数据看板', '学员画像', '教师画像', '教学质量分析']
            }
          ]
        }
      ]
    },

    backend: {
      roleName: '后台管理员', userName: '赵管理员', userRole: '后台管理员', avatar: '赵', defaultActive: '工作台',
      notes: ['首页监控包含大模型调用、全站备份及系统流量监控指标。', '后台管理员主要负责基础数据维护、用户权限分配、大模型参数调优、标签归类及网站日常发布更新管理。'],
      moduleEntrances: {
        '工作台': ['今日待办', '重点工作', '工作推进'],
        '标签管理': ['基础标签', '业务标签', '系统规则标签'],
        '大模型管理': ['模型配置', 'API Key 授权', '调用日志'],
        '用户权限管理': ['用户管理', '角色权限'],
        '网站管理': ['内容发布', '公告配置', '流量统计'],
        '系统设置': ['安全加固', '备份恢复', '第三方集成']
      },
      navItems: [
        { label: '工作台', icon: icons.home },
        { label: '标签管理', icon: icons.folder },
        { label: '大模型管理', icon: icons.award },
        { label: '用户权限管理', icon: icons.users },
        { label: '网站管理', icon: icons.space },
        { label: '系统设置', icon: icons.settings }
      ]
    }
  };

  window.RoleNav = { icons, roles };
}());
