const quickSearch = {'tc':'快速搜尋', 'sc':'快速搜尋', 'en':'Quick Search'};
const generalSearch = {'tc':'一般搜尋', 'sc':'一般搜尋', 'en':'General Search'};
const enterMultipleRoutes = {'tc':'輸入多條路線，以 / 分隔', 'sc':'輸入多條路線，以 / 分隔', 'en':'Enter Multiple Routes Divide By /'};
const from = {'tc':'由', 'sc':'由', 'en':'From'};
const start = {'tc':'開出', 'sc':'開出', 'en':''};
const to = {'tc':'往', 'sc':'往', 'en':'To'};
const minute = {'tc':'分鐘', 'sc':'分鐘', 'en':'Min'};
const pleaseAllowBrowserToAccessLocation = {'tc':'請允許瀏覽器獲取你的位置', 'sc':'請允許瀏覽器獲取你的位置', 'en':'Please Allow Browser To Access Your Location'};
const pleaseInputRoutes = {'tc':'未有輸入搜尋路線', 'sc':'未有輸入搜尋路線', 'en':'Please Input Routes To Search'};
const kmb = {'tc':'九巴', 'sc':'九巴', 'en':'KMB'};
const ctb = {'tc':'城巴', 'sc':'城巴', 'en':'CTB'};
const kmbctb = {'tc':'九巴/城巴', 'sc':'九巴/城巴', 'en':'KMB/CTB'};
const mtrbus = {'tc':'港鐵巴士', 'sc':'港鐵巴士', 'en':'MTR Bus'};
const mtr = {'tc':'港鐵', 'sc':'港鐵', 'en':'MTR'};
const unableToDownloadETA = {'tc':'未能下載到站預報', 'sc':'未能下載到站預報', 'en':'Unable To Dwonload ETA'};
const downloadData = {'tc':'下載資料', 'sc':'下載資料', 'en':'Download Data'};
const downloadingData = {'tc':'正在下載路線資料', 'sc':'正在下載路線資料', 'en':'Download Route Data In Progress'};
const downloadComplete = {'tc':'下載完成', 'sc':'下載完成', 'en':'Download Complete'};
const deviceVersionText = {'tc':'現有資料版本', 'sc':'現有資料版本', 'en':'Device Version'};
const serverVersionText = {'tc':'最新版本', 'sc':'最新版本', 'en':'Latest Version'};
const dayCode = {
    '31':{'tc':'星期一至五 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Mon - Fri (Except Public Holiday)'},
    '63':{'tc':'星期一至六 (公眾假期除外)', 'ts':'星期一至六 (公眾假期除外)', 'ts':'Mon - Sat (Except Public Holiday)'},
    '266':{'tc':'星期二至四 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Tue - Thu (Except Public Holiday)'},
    '271':{'tc':'星期一至四 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Mon - Thu (Except Public Holiday)'},
    '272':{'tc':'星期五 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Fri (Except Public Holiday)'},
    '287':{'tc':'星期一至五 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Mon - Fri (Except Public Holiday)'},
    '288':{'tc':'星期六 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Sat (Except Public Holiday)'},
    '319':{'tc':'星期一至六 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Mon - Sat (Except Public Holiday)'},
    '320':{'tc':'星期日 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Sun (Except Public Holiday)'},
    '415':{'tc':'星期一至五 (公眾假期除外)', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Mon - Fri (Except Public Holiday)'},
    '416':{'tc':'星期六及公眾假期', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Sat and Public Holiday'},
    '447':{'tc':'星期一至六', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Mon - Sat'},
    '448':{'tc':'星期日及公眾假期', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Sun and Public Holiday'},
    '480':{'tc':'星期六、日、公眾假期', 'ts':'星期一至五 (公眾假期除外)', 'ts':'Sat, Sun and Public Holiday'},
    '511':{'tc':'星期一至日及公眾假期', 'ts':'星期一至五 (公眾假期除外)', 'ts':'All Days'},
};
const routeTab = {'tc':'路線', 'sc':'路線', 'en':'Route'};
const scheduleTab = {'tc':'班次', 'sc':'班次', 'en':'Schedule'};

export { quickSearch, generalSearch, enterMultipleRoutes, from, start, to, minute, pleaseAllowBrowserToAccessLocation, 
    kmb, ctb, kmbctb, mtrbus, mtr, pleaseInputRoutes, unableToDownloadETA, downloadData, downloadingData, downloadComplete,
    deviceVersionText, serverVersionText, dayCode, routeTab, scheduleTab }