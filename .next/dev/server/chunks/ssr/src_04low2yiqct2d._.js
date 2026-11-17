module.exports = [
"[project]/src/app/browse/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrowsePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$LanguageContext$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/LanguageContext.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sampleProjects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sampleProjects.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/categories.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const SEARCH_ICON = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    children: [
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: "11",
            cy: "11",
            r: "7"
        }, void 0, false, {
            fileName: "[project]/src/app/browse/page.jsx",
            lineNumber: 11,
            columnNumber: 65
        }, ("TURBOPACK compile-time value", void 0)),
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20 20l-3.5-3.5"
        }, void 0, false, {
            fileName: "[project]/src/app/browse/page.jsx",
            lineNumber: 11,
            columnNumber: 97
        }, ("TURBOPACK compile-time value", void 0))
    ]
}, void 0, true, {
    fileName: "[project]/src/app/browse/page.jsx",
    lineNumber: 11,
    columnNumber: 21
}, ("TURBOPACK compile-time value", void 0));
const CHEVRON = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: "M6 9l6 6 6-6"
    }, void 0, false, {
        fileName: "[project]/src/app/browse/page.jsx",
        lineNumber: 12,
        columnNumber: 61
    }, ("TURBOPACK compile-time value", void 0))
}, void 0, false, {
    fileName: "[project]/src/app/browse/page.jsx",
    lineNumber: 12,
    columnNumber: 17
}, ("TURBOPACK compile-time value", void 0));
// Public "Browse projects" page. Every filter lives in the URL (?category=&sub=&type=&skill=&q=), so a filtered view can be
// bookmarked, shared and reached from the header menu. It runs on the labelled sample data in lib/sampleProjects.js.
function BrowseContent() {
    const { t, language } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$LanguageContext$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [openId, setOpenId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Only accept values we know; anything else in the URL is ignored.
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const get = (k)=>searchParams.get(k) || '';
        const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findCategory"])(get('category')) ? get('category') : '';
        const sub = category && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSub"])(category, get('sub')) ? get('sub') : '';
        const type = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROJECT_TYPES"].includes(get('type')) ? get('type') : '';
        return {
            category,
            sub,
            type,
            skill: get('skill'),
            q: get('q')
        };
    }, [
        searchParams
    ]);
    // The search box is typed into freely and written to the URL after a short pause.
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(params.q);
    const pushedQ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(params.q);
    const paramsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(params);
    paramsRef.current = params;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (params.q !== pushedQ.current) {
            pushedQ.current = params.q;
            setQ(params.q);
        }
    }, [
        params.q
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (q === pushedQ.current) return undefined;
        const id = setTimeout(()=>{
            pushedQ.current = q;
            router.replace((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["browseHref"])({
                ...paramsRef.current,
                q
            }), {
                scroll: false
            });
        }, 250);
        return ()=>clearTimeout(id);
    }, [
        q,
        router
    ]);
    const current = {
        ...params,
        q
    };
    const run = (over = {})=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterProjects"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sampleProjects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAMPLE_PROJECTS"], {
            ...current,
            ...over
        }, language);
    const results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(run, [
        params,
        q,
        language
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    const href = (over)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["browseHref"])({
            ...current,
            ...over
        });
    const go = (over)=>router.push(href(over), {
            scroll: false
        });
    // Skills offered as a filter: those in the projects that match everything except the skill itself.
    const skills = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const set = new Map();
        run({
            skill: ''
        }).forEach((p)=>p.skills.forEach((s)=>set.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(s), s)));
        if (params.skill && !set.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(params.skill))) set.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(params.skill), params.skill);
        return [
            ...set.values()
        ].sort((a, b)=>a.localeCompare(b));
    }, [
        params,
        q,
        language
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    const cat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findCategory"])(params.category);
    const sub = cat ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSub"])(cat.key, params.sub) : null;
    const heading = sub ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(sub.name, language) : cat ? t(`cat.${cat.key}`) : t('browse.title');
    const lead = sub ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(sub.desc, language) : t('browse.lead');
    const filtered = Boolean(params.category || params.type || params.skill || q.trim());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.title = `${heading} – VeriWork`;
    }, [
        heading
    ]);
    const typeLabel = {
        '': t('browse.typeAny'),
        fixed: t('browse.typeFixed'),
        hour: t('browse.typeHour')
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        id: "main",
        className: "browse",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "crumbs",
                    "aria-label": t('browse.breadcrumb'),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: cat ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/browse",
                                    children: t('browse.title')
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 79,
                                    columnNumber: 24
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-current": "page",
                                    children: t('browse.title')
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 79,
                                    columnNumber: 74
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/browse/page.jsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            cat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: sub ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["browseHref"])({
                                        category: cat.key
                                    }),
                                    children: t(`cat.${cat.key}`)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 80,
                                    columnNumber: 32
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-current": "page",
                                    children: t(`cat.${cat.key}`)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 80,
                                    columnNumber: 110
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/browse/page.jsx",
                                lineNumber: 80,
                                columnNumber: 21
                            }, this),
                            sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-current": "page",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(sub.name, language)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 81,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/browse/page.jsx",
                                lineNumber: 81,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/browse/page.jsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/browse/page.jsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "browse-head",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "browse-title",
                            children: heading
                        }, void 0, false, {
                            fileName: "[project]/src/app/browse/page.jsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "browse-lead",
                            children: lead
                        }, void 0, false, {
                            fileName: "[project]/src/app/browse/page.jsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/browse/page.jsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "browse-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "facets",
                            "aria-label": t('browse.filters'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "aria-labelledby": "facet-cats",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "facet-title",
                                            id: "facet-cats",
                                            children: t('menu.categories')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "facet-list",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        className: "facet-link",
                                                        scroll: false,
                                                        href: href({
                                                            category: '',
                                                            sub: '',
                                                            skill: ''
                                                        }),
                                                        "aria-current": !params.category ? 'true' : undefined,
                                                        children: [
                                                            t('cat.all'),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "facet-count",
                                                                children: run({
                                                                    category: '',
                                                                    sub: '',
                                                                    skill: ''
                                                                }).length
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/browse/page.jsx",
                                                                lineNumber: 97,
                                                                columnNumber: 35
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/browse/page.jsx",
                                                        lineNumber: 96,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                    lineNumber: 95,
                                                    columnNumber: 17
                                                }, this),
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            className: "facet-link",
                                                            scroll: false,
                                                            href: href({
                                                                category: c.key,
                                                                sub: '',
                                                                skill: ''
                                                            }),
                                                            "aria-current": params.category === c.key ? 'true' : undefined,
                                                            children: [
                                                                t(`cat.${c.key}`),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "facet-count",
                                                                    children: run({
                                                                        category: c.key,
                                                                        sub: '',
                                                                        skill: ''
                                                                    }).length
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                                    lineNumber: 103,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 102,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, c.key, false, {
                                                        fileName: "[project]/src/app/browse/page.jsx",
                                                        lineNumber: 101,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                cat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "aria-labelledby": "facet-subs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "facet-title",
                                            id: "facet-subs",
                                            children: t(`cat.${cat.key}`)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 112,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "facet-list",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        className: "facet-link",
                                                        scroll: false,
                                                        href: href({
                                                            sub: '',
                                                            skill: ''
                                                        }),
                                                        "aria-current": !params.sub ? 'true' : undefined,
                                                        children: [
                                                            t('browse.allSubs'),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "facet-count",
                                                                children: run({
                                                                    sub: '',
                                                                    skill: ''
                                                                }).length
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/browse/page.jsx",
                                                                lineNumber: 116,
                                                                columnNumber: 44
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/browse/page.jsx",
                                                        lineNumber: 115,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                    lineNumber: 114,
                                                    columnNumber: 19
                                                }, this),
                                                cat.subs.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            className: "facet-link",
                                                            scroll: false,
                                                            href: href({
                                                                sub: s.key,
                                                                skill: ''
                                                            }),
                                                            "aria-current": params.sub === s.key ? 'true' : undefined,
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(s.name, language),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "facet-count",
                                                                    children: run({
                                                                        sub: s.key,
                                                                        skill: ''
                                                                    }).length
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                                    lineNumber: 122,
                                                                    columnNumber: 48
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 121,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, s.key, false, {
                                                        fileName: "[project]/src/app/browse/page.jsx",
                                                        lineNumber: 120,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "aria-labelledby": "facet-type",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "facet-title",
                                            id: "facet-type",
                                            children: t('browse.type')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "facet-list",
                                            children: [
                                                '',
                                                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROJECT_TYPES"]
                                            ].map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        className: "facet-link",
                                                        scroll: false,
                                                        href: href({
                                                            type: v
                                                        }),
                                                        "aria-current": params.type === v ? 'true' : undefined,
                                                        children: [
                                                            typeLabel[v],
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "facet-count",
                                                                children: run({
                                                                    type: v
                                                                }).length
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/browse/page.jsx",
                                                                lineNumber: 136,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/browse/page.jsx",
                                                        lineNumber: 135,
                                                        columnNumber: 21
                                                    }, this)
                                                }, v || 'any', false, {
                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                    lineNumber: 134,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                skills.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    "aria-labelledby": "facet-skills",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "facet-title",
                                            id: "facet-skills",
                                            children: t('browse.skills')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "chips",
                                            children: skills.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "chip",
                                                        "aria-pressed": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(params.skill) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(s),
                                                        onClick: ()=>go({
                                                                skill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(params.skill) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(s) ? '' : s
                                                            }),
                                                        children: s
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/browse/page.jsx",
                                                        lineNumber: 149,
                                                        columnNumber: 23
                                                    }, this)
                                                }, s, false, {
                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                    lineNumber: 148,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 146,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 144,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/browse/page.jsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "browse-results",
                            "aria-label": t('browse.results'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    className: "browse-search",
                                    role: "search",
                                    onSubmit: (e)=>e.preventDefault(),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field",
                                        children: [
                                            SEARCH_ICON,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "visually-hidden",
                                                htmlFor: "browse-search",
                                                children: t('projects.searchLabel')
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/browse/page.jsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "browse-search",
                                                type: "search",
                                                value: q,
                                                onChange: (e)=>setQ(e.target.value),
                                                placeholder: t('projects.search'),
                                                autoComplete: "off"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/browse/page.jsx",
                                                lineNumber: 162,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/browse/page.jsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "browse-count-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "explorer-count",
                                            "aria-live": "polite",
                                            children: [
                                                results.length,
                                                " ",
                                                t('projects.count')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 167,
                                            columnNumber: 15
                                        }, this),
                                        filtered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-secondary btn-sm",
                                            onClick: ()=>{
                                                setQ('');
                                                pushedQ.current = '';
                                                router.push('/browse', {
                                                    scroll: false
                                                });
                                            },
                                            children: t('projects.clear')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 168,
                                            columnNumber: 28
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                results.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "explorer-empty",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: t('projects.empty')
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/browse/page.jsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "project-list",
                                    children: results.map((p)=>{
                                        const open = openId === p.id;
                                        const detailId = `browse-detail-${p.id}`;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "project",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "project-main",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "project-head",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                    className: "project-title",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(p.title, language)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                                    lineNumber: 184,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "project-budget",
                                                                    children: [
                                                                        `$${p.budget.min}–$${p.budget.max}`,
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: p.budget.unit === 'hour' ? t('projects.hourly') : t('projects.fixed')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                                            lineNumber: 187,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                                    lineNumber: 185,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 183,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "project-meta",
                                                            children: [
                                                                t(`cat.${p.category}`),
                                                                " · ",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(p.duration, language)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 190,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "project-summary",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(p.summary, language)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 191,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "tags",
                                                            children: p.skills.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        className: "tag tag-btn",
                                                                        "aria-pressed": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(params.skill) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(s),
                                                                        "aria-label": `${t('browse.filterSkill')}: ${s}`,
                                                                        onClick: ()=>go({
                                                                                skill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(params.skill) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fold"])(s) ? '' : s
                                                                            }),
                                                                        children: s
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/browse/page.jsx",
                                                                        lineNumber: 195,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, s, false, {
                                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                                    lineNumber: 194,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 192,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                    lineNumber: 182,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "project-actions",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            className: "project-toggle",
                                                            "aria-expanded": open,
                                                            "aria-controls": detailId,
                                                            onClick: ()=>setOpenId(open ? null : p.id),
                                                            children: [
                                                                open ? t('projects.hide') : t('projects.details'),
                                                                CHEVRON
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 202,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            className: "btn btn-primary btn-sm",
                                                            href: "/signup",
                                                            children: t('projects.apply')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 206,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                    lineNumber: 201,
                                                    columnNumber: 23
                                                }, this),
                                                open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    id: detailId,
                                                    className: "project-detail",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loc"])(p.detail, language)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 211,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "project-note",
                                                            children: t('projects.applyNote')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/browse/page.jsx",
                                                            lineNumber: 212,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/browse/page.jsx",
                                                    lineNumber: 210,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/src/app/browse/page.jsx",
                                            lineNumber: 181,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "sample-note",
                                    children: t('projects.sample')
                                }, void 0, false, {
                                    fileName: "[project]/src/app/browse/page.jsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/browse/page.jsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/browse/page.jsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/browse/page.jsx",
            lineNumber: 76,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/browse/page.jsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
function BrowsePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            id: "main",
            className: "browse",
            "aria-busy": "true"
        }, void 0, false, {
            fileName: "[project]/src/app/browse/page.jsx",
            lineNumber: 232,
            columnNumber: 25
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BrowseContent, {}, void 0, false, {
            fileName: "[project]/src/app/browse/page.jsx",
            lineNumber: 233,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/browse/page.jsx",
        lineNumber: 232,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/sampleProjects.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ILLUSTRATIVE DATA ONLY. These listings are samples for the landing-page explorer and are labelled as such in the UI.
// Replace this module with a real data source (API call) when project listings exist.
__turbopack_context__.s([
    "PROJECT_CATEGORIES",
    ()=>PROJECT_CATEGORIES,
    "SAMPLE_PROJECTS",
    ()=>SAMPLE_PROJECTS
]);
const PROJECT_CATEGORIES = [
    'writing',
    'design',
    'development',
    'marketing',
    'data'
];
const SAMPLE_PROJECTS = [
    {
        id: 'p1',
        category: 'writing',
        skills: [
            'Copywriting',
            'SEO'
        ],
        budget: {
            min: 120,
            max: 250,
            unit: 'fixed'
        },
        duration: {
            en: '3 weeks',
            vi: '3 tuần'
        },
        title: {
            en: 'Blog articles for a sustainable-fashion label',
            vi: 'Bài blog cho một thương hiệu thời trang bền vững'
        },
        summary: {
            en: 'Four researched articles on materials and care, written to rank for long-tail search terms.',
            vi: 'Bốn bài viết có nghiên cứu về chất liệu và cách bảo quản, tối ưu cho các từ khóa dài.'
        },
        detail: {
            en: 'You will receive a keyword brief and a style guide. Each article is about 900 words, with sources listed and one round of edits included.',
            vi: 'Bạn sẽ nhận bản brief từ khóa và hướng dẫn văn phong. Mỗi bài khoảng 900 từ, có nguồn tham khảo và gồm một lần chỉnh sửa.'
        }
    },
    {
        id: 'p2',
        category: 'design',
        skills: [
            'Figma',
            'Branding'
        ],
        budget: {
            min: 150,
            max: 300,
            unit: 'fixed'
        },
        duration: {
            en: '2 weeks',
            vi: '2 tuần'
        },
        title: {
            en: 'Social media templates for a language centre',
            vi: 'Mẫu thiết kế mạng xã hội cho một trung tâm ngoại ngữ'
        },
        summary: {
            en: 'A set of ten editable post and story templates that follow the centre’s existing colours.',
            vi: 'Bộ mười mẫu bài đăng và story có thể chỉnh sửa, theo màu sắc sẵn có của trung tâm.'
        },
        detail: {
            en: 'Deliver editable Figma files and exported PNGs. The centre will share its logo and colour palette at the start.',
            vi: 'Bàn giao file Figma có thể chỉnh sửa và ảnh PNG đã xuất. Trung tâm sẽ gửi logo và bảng màu ngay từ đầu.'
        }
    },
    {
        id: 'p3',
        category: 'development',
        skills: [
            'React',
            'CSS'
        ],
        budget: {
            min: 200,
            max: 400,
            unit: 'fixed'
        },
        duration: {
            en: '4 weeks',
            vi: '4 tuần'
        },
        title: {
            en: 'Landing page for a student club',
            vi: 'Landing page cho một câu lạc bộ sinh viên'
        },
        summary: {
            en: 'A responsive single-page site with an events section and a sign-up link.',
            vi: 'Trang một cột responsive có phần sự kiện và liên kết đăng ký.'
        },
        detail: {
            en: 'Design is provided. You build and deploy it, and hand over a short README so club members can update the events list.',
            vi: 'Thiết kế được cung cấp sẵn. Bạn xây dựng và triển khai, đồng thời bàn giao README ngắn để thành viên câu lạc bộ cập nhật danh sách sự kiện.'
        }
    },
    {
        id: 'p4',
        category: 'marketing',
        skills: [
            'Video scripting',
            'Social media'
        ],
        budget: {
            min: 10,
            max: 18,
            unit: 'hour'
        },
        duration: {
            en: 'Ongoing, 5 hrs/week',
            vi: 'Liên tục, 5 giờ/tuần'
        },
        title: {
            en: 'Short-form video scripts for a coffee shop',
            vi: 'Kịch bản video ngắn cho một quán cà phê'
        },
        summary: {
            en: 'Weekly scripts for 30-second videos that show the menu, the staff and the neighbourhood.',
            vi: 'Kịch bản hằng tuần cho video 30 giây giới thiệu thực đơn, nhân viên và khu phố.'
        },
        detail: {
            en: 'Two scripts per week with shot lists. The shop films and posts; you write and adjust based on what performs.',
            vi: 'Hai kịch bản mỗi tuần kèm danh sách cảnh quay. Quán tự quay và đăng; bạn viết và điều chỉnh dựa trên hiệu quả.'
        }
    },
    {
        id: 'p5',
        category: 'data',
        skills: [
            'Excel',
            'Data analysis'
        ],
        budget: {
            min: 180,
            max: 350,
            unit: 'fixed'
        },
        duration: {
            en: '3 weeks',
            vi: '3 tuần'
        },
        title: {
            en: 'Survey analysis for a campus research team',
            vi: 'Phân tích khảo sát cho một nhóm nghiên cứu sinh viên'
        },
        summary: {
            en: 'Clean about 600 survey responses and summarise the main patterns in a short report.',
            vi: 'Làm sạch khoảng 600 phản hồi khảo sát và tóm tắt các xu hướng chính trong một báo cáo ngắn.'
        },
        detail: {
            en: 'Raw responses arrive as a spreadsheet. Deliver a cleaned dataset, five charts and a two-page summary of findings.',
            vi: 'Dữ liệu thô được gửi dưới dạng bảng tính. Bàn giao bộ dữ liệu đã làm sạch, năm biểu đồ và bản tóm tắt kết quả hai trang.'
        }
    },
    {
        id: 'p6',
        category: 'writing',
        skills: [
            'Translation',
            'Proofreading'
        ],
        budget: {
            min: 8,
            max: 14,
            unit: 'hour'
        },
        duration: {
            en: '2 weeks',
            vi: '2 tuần'
        },
        title: {
            en: 'English–Vietnamese translation of onboarding guides',
            vi: 'Dịch hướng dẫn nhập môn Anh–Việt'
        },
        summary: {
            en: 'Translate six short staff onboarding guides and keep the tone friendly and clear.',
            vi: 'Dịch sáu tài liệu hướng dẫn nhân viên mới, giữ giọng văn thân thiện và rõ ràng.'
        },
        detail: {
            en: 'Each guide is two to three pages. A glossary of company terms is provided, and a bilingual reviewer checks the final text.',
            vi: 'Mỗi tài liệu dài hai đến ba trang. Có sẵn bảng thuật ngữ của công ty và một người song ngữ sẽ rà soát bản cuối.'
        }
    }
];
}),
];

//# sourceMappingURL=src_04low2yiqct2d._.js.map