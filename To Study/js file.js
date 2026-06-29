(function() {
    const s = document.createElement("link").relList;
    if (s && s.supports && s.supports("modulepreload"))
        return;
    for (const S of document.querySelectorAll('link[rel="modulepreload"]'))
        o(S);
    new MutationObserver(S => {
        for (const A of S)
            if (A.type === "childList")
                for (const D of A.addedNodes)
                    D.tagName === "LINK" && D.rel === "modulepreload" && o(D)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function y(S) {
        const A = {};
        return S.integrity && (A.integrity = S.integrity),
        S.referrerPolicy && (A.referrerPolicy = S.referrerPolicy),
        S.crossOrigin === "use-credentials" ? A.credentials = "include" : S.crossOrigin === "anonymous" ? A.credentials = "omit" : A.credentials = "same-origin",
        A
    }
    function o(S) {
        if (S.ep)
            return;
        S.ep = !0;
        const A = y(S);
        fetch(S.href, A)
    }
}
)();
function Ly(i) {
    return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i
}
var Kf = {
    exports: {}
}
  , fn = {};
var ld;
function jy() {
    if (ld)
        return fn;
    ld = 1;
    var i = Symbol.for("react.transitional.element")
      , s = Symbol.for("react.fragment");
    function y(o, S, A) {
        var D = null;
        if (A !== void 0 && (D = "" + A),
        S.key !== void 0 && (D = "" + S.key),
        "key"in S) {
            A = {};
            for (var Y in S)
                Y !== "key" && (A[Y] = S[Y])
        } else
            A = S;
        return S = A.ref,
        {
            $$typeof: i,
            type: o,
            key: D,
            ref: S !== void 0 ? S : null,
            props: A
        }
    }
    return fn.Fragment = s,
    fn.jsx = y,
    fn.jsxs = y,
    fn
}
var ed;
function Xy() {
    return ed || (ed = 1,
    Kf.exports = jy()),
    Kf.exports
}
var lt = Xy()
  , Jf = {
    exports: {}
}
  , tt = {};
var ad;
function Vy() {
    if (ad)
        return tt;
    ad = 1;
    var i = Symbol.for("react.transitional.element")
      , s = Symbol.for("react.portal")
      , y = Symbol.for("react.fragment")
      , o = Symbol.for("react.strict_mode")
      , S = Symbol.for("react.profiler")
      , A = Symbol.for("react.consumer")
      , D = Symbol.for("react.context")
      , Y = Symbol.for("react.forward_ref")
      , p = Symbol.for("react.suspense")
      , v = Symbol.for("react.memo")
      , N = Symbol.for("react.lazy")
      , U = Symbol.for("react.activity")
      , V = Symbol.iterator;
    function J(m) {
        return m === null || typeof m != "object" ? null : (m = V && m[V] || m["@@iterator"],
        typeof m == "function" ? m : null)
    }
    var ct = {
        isMounted: function() {
            return !1
        },
        enqueueForceUpdate: function() {},
        enqueueReplaceState: function() {},
        enqueueSetState: function() {}
    }
      , ht = Object.assign
      , nt = {};
    function I(m, R, q) {
        this.props = m,
        this.context = R,
        this.refs = nt,
        this.updater = q || ct
    }
    I.prototype.isReactComponent = {},
    I.prototype.setState = function(m, R) {
        if (typeof m != "object" && typeof m != "function" && m != null)
            throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, m, R, "setState")
    }
    ,
    I.prototype.forceUpdate = function(m) {
        this.updater.enqueueForceUpdate(this, m, "forceUpdate")
    }
    ;
    function qt() {}
    qt.prototype = I.prototype;
    function bt(m, R, q) {
        this.props = m,
        this.context = R,
        this.refs = nt,
        this.updater = q || ct
    }
    var Ct = bt.prototype = new qt;
    Ct.constructor = bt,
    ht(Ct, I.prototype),
    Ct.isPureReactComponent = !0;
    var pt = Array.isArray;
    function rt() {}
    var F = {
        H: null,
        A: null,
        T: null,
        S: null
    }
      , Ut = Object.prototype.hasOwnProperty;
    function wt(m, R, q) {
        var X = q.ref;
        return {
            $$typeof: i,
            type: m,
            key: R,
            ref: X !== void 0 ? X : null,
            props: q
        }
    }
    function Ml(m, R) {
        return wt(m.type, R, m.props)
    }
    function il(m) {
        return typeof m == "object" && m !== null && m.$$typeof === i
    }
    function Gt(m) {
        var R = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + m.replace(/[=:]/g, function(q) {
            return R[q]
        })
    }
    var yl = /\/+/g;
    function kt(m, R) {
        return typeof m == "object" && m !== null && m.key != null ? Gt("" + m.key) : R.toString(36)
    }
    function Wt(m) {
        switch (m.status) {
        case "fulfilled":
            return m.value;
        case "rejected":
            throw m.reason;
        default:
            switch (typeof m.status == "string" ? m.then(rt, rt) : (m.status = "pending",
            m.then(function(R) {
                m.status === "pending" && (m.status = "fulfilled",
                m.value = R)
            }, function(R) {
                m.status === "pending" && (m.status = "rejected",
                m.reason = R)
            })),
            m.status) {
            case "fulfilled":
                return m.value;
            case "rejected":
                throw m.reason
            }
        }
        throw m
    }
    function O(m, R, q, X, P) {
        var it = typeof m;
        (it === "undefined" || it === "boolean") && (m = null);
        var vt = !1;
        if (m === null)
            vt = !0;
        else
            switch (it) {
            case "bigint":
            case "string":
            case "number":
                vt = !0;
                break;
            case "object":
                switch (m.$$typeof) {
                case i:
                case s:
                    vt = !0;
                    break;
                case N:
                    return vt = m._init,
                    O(vt(m._payload), R, q, X, P)
                }
            }
        if (vt)
            return P = P(m),
            vt = X === "" ? "." + kt(m, 0) : X,
            pt(P) ? (q = "",
            vt != null && (q = vt.replace(yl, "$&/") + "/"),
            O(P, R, q, "", function($) {
                return $
            })) : P != null && (il(P) && (P = Ml(P, q + (P.key == null || m && m.key === P.key ? "" : ("" + P.key).replace(yl, "$&/") + "/") + vt)),
            R.push(P)),
            1;
        vt = 0;
        var B = X === "" ? "." : X + ":";
        if (pt(m))
            for (var L = 0; L < m.length; L++)
                X = m[L],
                it = B + kt(X, L),
                vt += O(X, R, q, it, P);
        else if (L = J(m),
        typeof L == "function")
            for (m = L.call(m),
            L = 0; !(X = m.next()).done; )
                X = X.value,
                it = B + kt(X, L++),
                vt += O(X, R, q, it, P);
        else if (it === "object") {
            if (typeof m.then == "function")
                return O(Wt(m), R, q, X, P);
            throw R = String(m),
            Error("Objects are not valid as a React child (found: " + (R === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : R) + "). If you meant to render a collection of children, use an array instead.")
        }
        return vt
    }
    function H(m, R, q) {
        if (m == null)
            return m;
        var X = []
          , P = 0;
        return O(m, X, "", "", function(it) {
            return R.call(q, it, P++)
        }),
        X
    }
    function k(m) {
        if (m._status === -1) {
            var R = m._result;
            R = R(),
            R.then(function(q) {
                (m._status === 0 || m._status === -1) && (m._status = 1,
                m._result = q)
            }, function(q) {
                (m._status === 0 || m._status === -1) && (m._status = 2,
                m._result = q)
            }),
            m._status === -1 && (m._status = 0,
            m._result = R)
        }
        if (m._status === 1)
            return m._result.default;
        throw m._result
    }
    var Et = typeof reportError == "function" ? reportError : function(m) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var R = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof m == "object" && m !== null && typeof m.message == "string" ? String(m.message) : String(m),
                error: m
            });
            if (!window.dispatchEvent(R))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", m);
            return
        }
        console.error(m)
    }
      , At = {
        map: H,
        forEach: function(m, R, q) {
            H(m, function() {
                R.apply(this, arguments)
            }, q)
        },
        count: function(m) {
            var R = 0;
            return H(m, function() {
                R++
            }),
            R
        },
        toArray: function(m) {
            return H(m, function(R) {
                return R
            }) || []
        },
        only: function(m) {
            if (!il(m))
                throw Error("React.Children.only expected to receive a single React element child.");
            return m
        }
    };
    return tt.Activity = U,
    tt.Children = At,
    tt.Component = I,
    tt.Fragment = y,
    tt.Profiler = S,
    tt.PureComponent = bt,
    tt.StrictMode = o,
    tt.Suspense = p,
    tt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F,
    tt.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(m) {
            return F.H.useMemoCache(m)
        }
    },
    tt.cache = function(m) {
        return function() {
            return m.apply(null, arguments)
        }
    }
    ,
    tt.cacheSignal = function() {
        return null
    }
    ,
    tt.cloneElement = function(m, R, q) {
        if (m == null)
            throw Error("The argument must be a React element, but you passed " + m + ".");
        var X = ht({}, m.props)
          , P = m.key;
        if (R != null)
            for (it in R.key !== void 0 && (P = "" + R.key),
            R)
                !Ut.call(R, it) || it === "key" || it === "__self" || it === "__source" || it === "ref" && R.ref === void 0 || (X[it] = R[it]);
        var it = arguments.length - 2;
        if (it === 1)
            X.children = q;
        else if (1 < it) {
            for (var vt = Array(it), B = 0; B < it; B++)
                vt[B] = arguments[B + 2];
            X.children = vt
        }
        return wt(m.type, P, X)
    }
    ,
    tt.createContext = function(m) {
        return m = {
            $$typeof: D,
            _currentValue: m,
            _currentValue2: m,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        },
        m.Provider = m,
        m.Consumer = {
            $$typeof: A,
            _context: m
        },
        m
    }
    ,
    tt.createElement = function(m, R, q) {
        var X, P = {}, it = null;
        if (R != null)
            for (X in R.key !== void 0 && (it = "" + R.key),
            R)
                Ut.call(R, X) && X !== "key" && X !== "__self" && X !== "__source" && (P[X] = R[X]);
        var vt = arguments.length - 2;
        if (vt === 1)
            P.children = q;
        else if (1 < vt) {
            for (var B = Array(vt), L = 0; L < vt; L++)
                B[L] = arguments[L + 2];
            P.children = B
        }
        if (m && m.defaultProps)
            for (X in vt = m.defaultProps,
            vt)
                P[X] === void 0 && (P[X] = vt[X]);
        return wt(m, it, P)
    }
    ,
    tt.createRef = function() {
        return {
            current: null
        }
    }
    ,
    tt.forwardRef = function(m) {
        return {
            $$typeof: Y,
            render: m
        }
    }
    ,
    tt.isValidElement = il,
    tt.lazy = function(m) {
        return {
            $$typeof: N,
            _payload: {
                _status: -1,
                _result: m
            },
            _init: k
        }
    }
    ,
    tt.memo = function(m, R) {
        return {
            $$typeof: v,
            type: m,
            compare: R === void 0 ? null : R
        }
    }
    ,
    tt.startTransition = function(m) {
        var R = F.T
          , q = {};
        F.T = q;
        try {
            var X = m()
              , P = F.S;
            P !== null && P(q, X),
            typeof X == "object" && X !== null && typeof X.then == "function" && X.then(rt, Et)
        } catch (it) {
            Et(it)
        } finally {
            R !== null && q.types !== null && (R.types = q.types),
            F.T = R
        }
    }
    ,
    tt.unstable_useCacheRefresh = function() {
        return F.H.useCacheRefresh()
    }
    ,
    tt.use = function(m) {
        return F.H.use(m)
    }
    ,
    tt.useActionState = function(m, R, q) {
        return F.H.useActionState(m, R, q)
    }
    ,
    tt.useCallback = function(m, R) {
        return F.H.useCallback(m, R)
    }
    ,
    tt.useContext = function(m) {
        return F.H.useContext(m)
    }
    ,
    tt.useDebugValue = function() {}
    ,
    tt.useDeferredValue = function(m, R) {
        return F.H.useDeferredValue(m, R)
    }
    ,
    tt.useEffect = function(m, R) {
        return F.H.useEffect(m, R)
    }
    ,
    tt.useEffectEvent = function(m) {
        return F.H.useEffectEvent(m)
    }
    ,
    tt.useId = function() {
        return F.H.useId()
    }
    ,
    tt.useImperativeHandle = function(m, R, q) {
        return F.H.useImperativeHandle(m, R, q)
    }
    ,
    tt.useInsertionEffect = function(m, R) {
        return F.H.useInsertionEffect(m, R)
    }
    ,
    tt.useLayoutEffect = function(m, R) {
        return F.H.useLayoutEffect(m, R)
    }
    ,
    tt.useMemo = function(m, R) {
        return F.H.useMemo(m, R)
    }
    ,
    tt.useOptimistic = function(m, R) {
        return F.H.useOptimistic(m, R)
    }
    ,
    tt.useReducer = function(m, R, q) {
        return F.H.useReducer(m, R, q)
    }
    ,
    tt.useRef = function(m) {
        return F.H.useRef(m)
    }
    ,
    tt.useState = function(m) {
        return F.H.useState(m)
    }
    ,
    tt.useSyncExternalStore = function(m, R, q) {
        return F.H.useSyncExternalStore(m, R, q)
    }
    ,
    tt.useTransition = function() {
        return F.H.useTransition()
    }
    ,
    tt.version = "19.2.6",
    tt
}
var ud;
function uo() {
    return ud || (ud = 1,
    Jf.exports = Vy()),
    Jf.exports
}
var W = uo();
const Qy = Ly(W);
var wf = {
    exports: {}
}
  , on = {}
  , kf = {
    exports: {}
}
  , Wf = {};
var nd;
function Zy() {
    return nd || (nd = 1,
    (function(i) {
        function s(O, H) {
            var k = O.length;
            O.push(H);
            t: for (; 0 < k; ) {
                var Et = k - 1 >>> 1
                  , At = O[Et];
                if (0 < S(At, H))
                    O[Et] = H,
                    O[k] = At,
                    k = Et;
                else
                    break t
            }
        }
        function y(O) {
            return O.length === 0 ? null : O[0]
        }
        function o(O) {
            if (O.length === 0)
                return null;
            var H = O[0]
              , k = O.pop();
            if (k !== H) {
                O[0] = k;
                t: for (var Et = 0, At = O.length, m = At >>> 1; Et < m; ) {
                    var R = 2 * (Et + 1) - 1
                      , q = O[R]
                      , X = R + 1
                      , P = O[X];
                    if (0 > S(q, k))
                        X < At && 0 > S(P, q) ? (O[Et] = P,
                        O[X] = k,
                        Et = X) : (O[Et] = q,
                        O[R] = k,
                        Et = R);
                    else if (X < At && 0 > S(P, k))
                        O[Et] = P,
                        O[X] = k,
                        Et = X;
                    else
                        break t
                }
            }
            return H
        }
        function S(O, H) {
            var k = O.sortIndex - H.sortIndex;
            return k !== 0 ? k : O.id - H.id
        }
        if (i.unstable_now = void 0,
        typeof performance == "object" && typeof performance.now == "function") {
            var A = performance;
            i.unstable_now = function() {
                return A.now()
            }
        } else {
            var D = Date
              , Y = D.now();
            i.unstable_now = function() {
                return D.now() - Y
            }
        }
        var p = []
          , v = []
          , N = 1
          , U = null
          , V = 3
          , J = !1
          , ct = !1
          , ht = !1
          , nt = !1
          , I = typeof setTimeout == "function" ? setTimeout : null
          , qt = typeof clearTimeout == "function" ? clearTimeout : null
          , bt = typeof setImmediate < "u" ? setImmediate : null;
        function Ct(O) {
            for (var H = y(v); H !== null; ) {
                if (H.callback === null)
                    o(v);
                else if (H.startTime <= O)
                    o(v),
                    H.sortIndex = H.expirationTime,
                    s(p, H);
                else
                    break;
                H = y(v)
            }
        }
        function pt(O) {
            if (ht = !1,
            Ct(O),
            !ct)
                if (y(p) !== null)
                    ct = !0,
                    rt || (rt = !0,
                    Gt());
                else {
                    var H = y(v);
                    H !== null && Wt(pt, H.startTime - O)
                }
        }
        var rt = !1
          , F = -1
          , Ut = 5
          , wt = -1;
        function Ml() {
            return nt ? !0 : !(i.unstable_now() - wt < Ut)
        }
        function il() {
            if (nt = !1,
            rt) {
                var O = i.unstable_now();
                wt = O;
                var H = !0;
                try {
                    t: {
                        ct = !1,
                        ht && (ht = !1,
                        qt(F),
                        F = -1),
                        J = !0;
                        var k = V;
                        try {
                            l: {
                                for (Ct(O),
                                U = y(p); U !== null && !(U.expirationTime > O && Ml()); ) {
                                    var Et = U.callback;
                                    if (typeof Et == "function") {
                                        U.callback = null,
                                        V = U.priorityLevel;
                                        var At = Et(U.expirationTime <= O);
                                        if (O = i.unstable_now(),
                                        typeof At == "function") {
                                            U.callback = At,
                                            Ct(O),
                                            H = !0;
                                            break l
                                        }
                                        U === y(p) && o(p),
                                        Ct(O)
                                    } else
                                        o(p);
                                    U = y(p)
                                }
                                if (U !== null)
                                    H = !0;
                                else {
                                    var m = y(v);
                                    m !== null && Wt(pt, m.startTime - O),
                                    H = !1
                                }
                            }
                            break t
                        } finally {
                            U = null,
                            V = k,
                            J = !1
                        }
                        H = void 0
                    }
                } finally {
                    H ? Gt() : rt = !1
                }
            }
        }
        var Gt;
        if (typeof bt == "function")
            Gt = function() {
                bt(il)
            }
            ;
        else if (typeof MessageChannel < "u") {
            var yl = new MessageChannel
              , kt = yl.port2;
            yl.port1.onmessage = il,
            Gt = function() {
                kt.postMessage(null)
            }
        } else
            Gt = function() {
                I(il, 0)
            }
            ;
        function Wt(O, H) {
            F = I(function() {
                O(i.unstable_now())
            }, H)
        }
        i.unstable_IdlePriority = 5,
        i.unstable_ImmediatePriority = 1,
        i.unstable_LowPriority = 4,
        i.unstable_NormalPriority = 3,
        i.unstable_Profiling = null,
        i.unstable_UserBlockingPriority = 2,
        i.unstable_cancelCallback = function(O) {
            O.callback = null
        }
        ,
        i.unstable_forceFrameRate = function(O) {
            0 > O || 125 < O ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ut = 0 < O ? Math.floor(1e3 / O) : 5
        }
        ,
        i.unstable_getCurrentPriorityLevel = function() {
            return V
        }
        ,
        i.unstable_next = function(O) {
            switch (V) {
            case 1:
            case 2:
            case 3:
                var H = 3;
                break;
            default:
                H = V
            }
            var k = V;
            V = H;
            try {
                return O()
            } finally {
                V = k
            }
        }
        ,
        i.unstable_requestPaint = function() {
            nt = !0
        }
        ,
        i.unstable_runWithPriority = function(O, H) {
            switch (O) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                O = 3
            }
            var k = V;
            V = O;
            try {
                return H()
            } finally {
                V = k
            }
        }
        ,
        i.unstable_scheduleCallback = function(O, H, k) {
            var Et = i.unstable_now();
            switch (typeof k == "object" && k !== null ? (k = k.delay,
            k = typeof k == "number" && 0 < k ? Et + k : Et) : k = Et,
            O) {
            case 1:
                var At = -1;
                break;
            case 2:
                At = 250;
                break;
            case 5:
                At = 1073741823;
                break;
            case 4:
                At = 1e4;
                break;
            default:
                At = 5e3
            }
            return At = k + At,
            O = {
                id: N++,
                callback: H,
                priorityLevel: O,
                startTime: k,
                expirationTime: At,
                sortIndex: -1
            },
            k > Et ? (O.sortIndex = k,
            s(v, O),
            y(p) === null && O === y(v) && (ht ? (qt(F),
            F = -1) : ht = !0,
            Wt(pt, k - Et))) : (O.sortIndex = At,
            s(p, O),
            ct || J || (ct = !0,
            rt || (rt = !0,
            Gt()))),
            O
        }
        ,
        i.unstable_shouldYield = Ml,
        i.unstable_wrapCallback = function(O) {
            var H = V;
            return function() {
                var k = V;
                V = H;
                try {
                    return O.apply(this, arguments)
                } finally {
                    V = k
                }
            }
        }
    }
    )(Wf)),
    Wf
}
var id;
function xy() {
    return id || (id = 1,
    kf.exports = Zy()),
    kf.exports
}
var Ff = {
    exports: {}
}
  , hl = {};
var cd;
function Ky() {
    if (cd)
        return hl;
    cd = 1;
    var i = uo();
    function s(p) {
        var v = "https://react.dev/errors/" + p;
        if (1 < arguments.length) {
            v += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var N = 2; N < arguments.length; N++)
                v += "&args[]=" + encodeURIComponent(arguments[N])
        }
        return "Minified React error #" + p + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function y() {}
    var o = {
        d: {
            f: y,
            r: function() {
                throw Error(s(522))
            },
            D: y,
            C: y,
            L: y,
            m: y,
            X: y,
            S: y,
            M: y
        },
        p: 0,
        findDOMNode: null
    }
      , S = Symbol.for("react.portal");
    function A(p, v, N) {
        var U = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
        return {
            $$typeof: S,
            key: U == null ? null : "" + U,
            children: p,
            containerInfo: v,
            implementation: N
        }
    }
    var D = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function Y(p, v) {
        if (p === "font")
            return "";
        if (typeof v == "string")
            return v === "use-credentials" ? v : ""
    }
    return hl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o,
    hl.createPortal = function(p, v) {
        var N = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
            throw Error(s(299));
        return A(p, v, null, N)
    }
    ,
    hl.flushSync = function(p) {
        var v = D.T
          , N = o.p;
        try {
            if (D.T = null,
            o.p = 2,
            p)
                return p()
        } finally {
            D.T = v,
            o.p = N,
            o.d.f()
        }
    }
    ,
    hl.preconnect = function(p, v) {
        typeof p == "string" && (v ? (v = v.crossOrigin,
        v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null,
        o.d.C(p, v))
    }
    ,
    hl.prefetchDNS = function(p) {
        typeof p == "string" && o.d.D(p)
    }
    ,
    hl.preinit = function(p, v) {
        if (typeof p == "string" && v && typeof v.as == "string") {
            var N = v.as
              , U = Y(N, v.crossOrigin)
              , V = typeof v.integrity == "string" ? v.integrity : void 0
              , J = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
            N === "style" ? o.d.S(p, typeof v.precedence == "string" ? v.precedence : void 0, {
                crossOrigin: U,
                integrity: V,
                fetchPriority: J
            }) : N === "script" && o.d.X(p, {
                crossOrigin: U,
                integrity: V,
                fetchPriority: J,
                nonce: typeof v.nonce == "string" ? v.nonce : void 0
            })
        }
    }
    ,
    hl.preinitModule = function(p, v) {
        if (typeof p == "string")
            if (typeof v == "object" && v !== null) {
                if (v.as == null || v.as === "script") {
                    var N = Y(v.as, v.crossOrigin);
                    o.d.M(p, {
                        crossOrigin: N,
                        integrity: typeof v.integrity == "string" ? v.integrity : void 0,
                        nonce: typeof v.nonce == "string" ? v.nonce : void 0
                    })
                }
            } else
                v == null && o.d.M(p)
    }
    ,
    hl.preload = function(p, v) {
        if (typeof p == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
            var N = v.as
              , U = Y(N, v.crossOrigin);
            o.d.L(p, N, {
                crossOrigin: U,
                integrity: typeof v.integrity == "string" ? v.integrity : void 0,
                nonce: typeof v.nonce == "string" ? v.nonce : void 0,
                type: typeof v.type == "string" ? v.type : void 0,
                fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
                referrerPolicy: typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
                imageSrcSet: typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
                imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
                media: typeof v.media == "string" ? v.media : void 0
            })
        }
    }
    ,
    hl.preloadModule = function(p, v) {
        if (typeof p == "string")
            if (v) {
                var N = Y(v.as, v.crossOrigin);
                o.d.m(p, {
                    as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
                    crossOrigin: N,
                    integrity: typeof v.integrity == "string" ? v.integrity : void 0
                })
            } else
                o.d.m(p)
    }
    ,
    hl.requestFormReset = function(p) {
        o.d.r(p)
    }
    ,
    hl.unstable_batchedUpdates = function(p, v) {
        return p(v)
    }
    ,
    hl.useFormState = function(p, v, N) {
        return D.H.useFormState(p, v, N)
    }
    ,
    hl.useFormStatus = function() {
        return D.H.useHostTransitionStatus()
    }
    ,
    hl.version = "19.2.6",
    hl
}
var fd;
function Jy() {
    if (fd)
        return Ff.exports;
    fd = 1;
    function i() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)
            } catch (s) {
                console.error(s)
            }
    }
    return i(),
    Ff.exports = Ky(),
    Ff.exports
}
var od;
function wy() {
    if (od)
        return on;
    od = 1;
    var i = xy()
      , s = uo()
      , y = Jy();
    function o(t) {
        var l = "https://react.dev/errors/" + t;
        if (1 < arguments.length) {
            l += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var e = 2; e < arguments.length; e++)
                l += "&args[]=" + encodeURIComponent(arguments[e])
        }
        return "Minified React error #" + t + "; visit " + l + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function S(t) {
        return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)
    }
    function A(t) {
        var l = t
          , e = t;
        if (t.alternate)
            for (; l.return; )
                l = l.return;
        else {
            t = l;
            do
                l = t,
                (l.flags & 4098) !== 0 && (e = l.return),
                t = l.return;
            while (t)
        }
        return l.tag === 3 ? e : null
    }
    function D(t) {
        if (t.tag === 13) {
            var l = t.memoizedState;
            if (l === null && (t = t.alternate,
            t !== null && (l = t.memoizedState)),
            l !== null)
                return l.dehydrated
        }
        return null
    }
    function Y(t) {
        if (t.tag === 31) {
            var l = t.memoizedState;
            if (l === null && (t = t.alternate,
            t !== null && (l = t.memoizedState)),
            l !== null)
                return l.dehydrated
        }
        return null
    }
    function p(t) {
        if (A(t) !== t)
            throw Error(o(188))
    }
    function v(t) {
        var l = t.alternate;
        if (!l) {
            if (l = A(t),
            l === null)
                throw Error(o(188));
            return l !== t ? null : t
        }
        for (var e = t, a = l; ; ) {
            var u = e.return;
            if (u === null)
                break;
            var n = u.alternate;
            if (n === null) {
                if (a = u.return,
                a !== null) {
                    e = a;
                    continue
                }
                break
            }
            if (u.child === n.child) {
                for (n = u.child; n; ) {
                    if (n === e)
                        return p(u),
                        t;
                    if (n === a)
                        return p(u),
                        l;
                    n = n.sibling
                }
                throw Error(o(188))
            }
            if (e.return !== a.return)
                e = u,
                a = n;
            else {
                for (var c = !1, f = u.child; f; ) {
                    if (f === e) {
                        c = !0,
                        e = u,
                        a = n;
                        break
                    }
                    if (f === a) {
                        c = !0,
                        a = u,
                        e = n;
                        break
                    }
                    f = f.sibling
                }
                if (!c) {
                    for (f = n.child; f; ) {
                        if (f === e) {
                            c = !0,
                            e = n,
                            a = u;
                            break
                        }
                        if (f === a) {
                            c = !0,
                            a = n,
                            e = u;
                            break
                        }
                        f = f.sibling
                    }
                    if (!c)
                        throw Error(o(189))
                }
            }
            if (e.alternate !== a)
                throw Error(o(190))
        }
        if (e.tag !== 3)
            throw Error(o(188));
        return e.stateNode.current === e ? t : l
    }
    function N(t) {
        var l = t.tag;
        if (l === 5 || l === 26 || l === 27 || l === 6)
            return t;
        for (t = t.child; t !== null; ) {
            if (l = N(t),
            l !== null)
                return l;
            t = t.sibling
        }
        return null
    }
    var U = Object.assign
      , V = Symbol.for("react.element")
      , J = Symbol.for("react.transitional.element")
      , ct = Symbol.for("react.portal")
      , ht = Symbol.for("react.fragment")
      , nt = Symbol.for("react.strict_mode")
      , I = Symbol.for("react.profiler")
      , qt = Symbol.for("react.consumer")
      , bt = Symbol.for("react.context")
      , Ct = Symbol.for("react.forward_ref")
      , pt = Symbol.for("react.suspense")
      , rt = Symbol.for("react.suspense_list")
      , F = Symbol.for("react.memo")
      , Ut = Symbol.for("react.lazy")
      , wt = Symbol.for("react.activity")
      , Ml = Symbol.for("react.memo_cache_sentinel")
      , il = Symbol.iterator;
    function Gt(t) {
        return t === null || typeof t != "object" ? null : (t = il && t[il] || t["@@iterator"],
        typeof t == "function" ? t : null)
    }
    var yl = Symbol.for("react.client.reference");
    function kt(t) {
        if (t == null)
            return null;
        if (typeof t == "function")
            return t.$$typeof === yl ? null : t.displayName || t.name || null;
        if (typeof t == "string")
            return t;
        switch (t) {
        case ht:
            return "Fragment";
        case I:
            return "Profiler";
        case nt:
            return "StrictMode";
        case pt:
            return "Suspense";
        case rt:
            return "SuspenseList";
        case wt:
            return "Activity"
        }
        if (typeof t == "object")
            switch (t.$$typeof) {
            case ct:
                return "Portal";
            case bt:
                return t.displayName || "Context";
            case qt:
                return (t._context.displayName || "Context") + ".Consumer";
            case Ct:
                var l = t.render;
                return t = t.displayName,
                t || (t = l.displayName || l.name || "",
                t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"),
                t;
            case F:
                return l = t.displayName || null,
                l !== null ? l : kt(t.type) || "Memo";
            case Ut:
                l = t._payload,
                t = t._init;
                try {
                    return kt(t(l))
                } catch {}
            }
        return null
    }
    var Wt = Array.isArray
      , O = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , H = y.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , k = {
        pending: !1,
        data: null,
        method: null,
        action: null
    }
      , Et = []
      , At = -1;
    function m(t) {
        return {
            current: t
        }
    }
    function R(t) {
        0 > At || (t.current = Et[At],
        Et[At] = null,
        At--)
    }
    function q(t, l) {
        At++,
        Et[At] = t.current,
        t.current = l
    }
    var X = m(null)
      , P = m(null)
      , it = m(null)
      , vt = m(null);
    function B(t, l) {
        switch (q(it, l),
        q(P, t),
        q(X, null),
        l.nodeType) {
        case 9:
        case 11:
            t = (t = l.documentElement) && (t = t.namespaceURI) ? O0(t) : 0;
            break;
        default:
            if (t = l.tagName,
            l = l.namespaceURI)
                l = O0(l),
                t = _0(l, t);
            else
                switch (t) {
                case "svg":
                    t = 1;
                    break;
                case "math":
                    t = 2;
                    break;
                default:
                    t = 0
                }
        }
        R(X),
        q(X, t)
    }
    function L() {
        R(X),
        R(P),
        R(it)
    }
    function $(t) {
        t.memoizedState !== null && q(vt, t);
        var l = X.current
          , e = _0(l, t.type);
        l !== e && (q(P, t),
        q(X, e))
    }
    function Ht(t) {
        P.current === t && (R(X),
        R(P)),
        vt.current === t && (R(vt),
        an._currentValue = k)
    }
    var Xt, Vt;
    function al(t) {
        if (Xt === void 0)
            try {
                throw Error()
            } catch (e) {
                var l = e.stack.trim().match(/\n( *(at )?)/);
                Xt = l && l[1] || "",
                Vt = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : ""
            }
        return `
` + Xt + t + Vt
    }
    var Lt = !1;
    function Rl(t, l) {
        if (!t || Lt)
            return "";
        Lt = !0;
        var e = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            var a = {
                DetermineComponentFrameRoot: function() {
                    try {
                        if (l) {
                            var M = function() {
                                throw Error()
                            };
                            if (Object.defineProperty(M.prototype, "props", {
                                set: function() {
                                    throw Error()
                                }
                            }),
                            typeof Reflect == "object" && Reflect.construct) {
                                try {
                                    Reflect.construct(M, [])
                                } catch (E) {
                                    var T = E
                                }
                                Reflect.construct(t, [], M)
                            } else {
                                try {
                                    M.call()
                                } catch (E) {
                                    T = E
                                }
                                t.call(M.prototype)
                            }
                        } else {
                            try {
                                throw Error()
                            } catch (E) {
                                T = E
                            }
                            (M = t()) && typeof M.catch == "function" && M.catch(function() {})
                        }
                    } catch (E) {
                        if (E && T && typeof E.stack == "string")
                            return [E.stack, T.stack]
                    }
                    return [null, null]
                }
            };
            a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
            var u = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, "name");
            u && u.configurable && Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
                value: "DetermineComponentFrameRoot"
            });
            var n = a.DetermineComponentFrameRoot()
              , c = n[0]
              , f = n[1];
            if (c && f) {
                var r = c.split(`
`)
                  , b = f.split(`
`);
                for (u = a = 0; a < r.length && !r[a].includes("DetermineComponentFrameRoot"); )
                    a++;
                for (; u < b.length && !b[u].includes("DetermineComponentFrameRoot"); )
                    u++;
                if (a === r.length || u === b.length)
                    for (a = r.length - 1,
                    u = b.length - 1; 1 <= a && 0 <= u && r[a] !== b[u]; )
                        u--;
                for (; 1 <= a && 0 <= u; a--,
                u--)
                    if (r[a] !== b[u]) {
                        if (a !== 1 || u !== 1)
                            do
                                if (a--,
                                u--,
                                0 > u || r[a] !== b[u]) {
                                    var _ = `
` + r[a].replace(" at new ", " at ");
                                    return t.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", t.displayName)),
                                    _
                                }
                            while (1 <= a && 0 <= u);
                        break
                    }
            }
        } finally {
            Lt = !1,
            Error.prepareStackTrace = e
        }
        return (e = t ? t.displayName || t.name : "") ? al(e) : ""
    }
    function oe(t, l) {
        switch (t.tag) {
        case 26:
        case 27:
        case 5:
            return al(t.type);
        case 16:
            return al("Lazy");
        case 13:
            return t.child !== l && l !== null ? al("Suspense Fallback") : al("Suspense");
        case 19:
            return al("SuspenseList");
        case 0:
        case 15:
            return Rl(t.type, !1);
        case 11:
            return Rl(t.type.render, !1);
        case 1:
            return Rl(t.type, !0);
        case 31:
            return al("Activity");
        default:
            return ""
        }
    }
    function se(t) {
        try {
            var l = ""
              , e = null;
            do
                l += oe(t, e),
                e = t,
                t = t.return;
            while (t);
            return l
        } catch (a) {
            return `
Error generating stack: ` + a.message + `
` + a.stack
        }
    }
    var tl = Object.prototype.hasOwnProperty
      , ee = i.unstable_scheduleCallback
      , hu = i.unstable_cancelCallback
      , Ra = i.unstable_shouldYield
      , mn = i.unstable_requestPaint
      , x = i.unstable_now
      , G = i.unstable_getCurrentPriorityLevel
      , C = i.unstable_ImmediatePriority
      , et = i.unstable_UserBlockingPriority
      , Gl = i.unstable_NormalPriority
      , re = i.unstable_LowPriority
      , cl = i.unstable_IdlePriority
      , de = i.log
      , Da = i.unstable_setDisableYieldValue
      , ae = null
      , ft = null;
    function Wl(t) {
        if (typeof de == "function" && Da(t),
        ft && typeof ft.setStrictMode == "function")
            try {
                ft.setStrictMode(ae, t)
            } catch {}
    }
    var vl = Math.clz32 ? Math.clz32 : He
      , Ni = Math.log
      , Ci = Math.LN2;
    function He(t) {
        return t >>>= 0,
        t === 0 ? 32 : 31 - (Ni(t) / Ci | 0) | 0
    }
    var gl = 256
      , Sl = 262144
      , Ll = 4194304;
    function Dl(t) {
        var l = t & 42;
        if (l !== 0)
            return l;
        switch (t & -t) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
            return 64;
        case 128:
            return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
            return t & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return t & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return t & 62914560;
        case 67108864:
            return 67108864;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 0;
        default:
            return t
        }
    }
    function ue(t, l, e) {
        var a = t.pendingLanes;
        if (a === 0)
            return 0;
        var u = 0
          , n = t.suspendedLanes
          , c = t.pingedLanes;
        t = t.warmLanes;
        var f = a & 134217727;
        return f !== 0 ? (a = f & ~n,
        a !== 0 ? u = Dl(a) : (c &= f,
        c !== 0 ? u = Dl(c) : e || (e = f & ~t,
        e !== 0 && (u = Dl(e))))) : (f = a & ~n,
        f !== 0 ? u = Dl(f) : c !== 0 ? u = Dl(c) : e || (e = a & ~t,
        e !== 0 && (u = Dl(e)))),
        u === 0 ? 0 : l !== 0 && l !== u && (l & n) === 0 && (n = u & -u,
        e = l & -l,
        n >= e || n === 32 && (e & 4194048) !== 0) ? l : u
    }
    function me(t, l) {
        return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & l) === 0
    }
    function Ui(t, l) {
        switch (t) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
            return l + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return l + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1;
        default:
            return -1
        }
    }
    function yn() {
        var t = Ll;
        return Ll <<= 1,
        (Ll & 62914560) === 0 && (Ll = 4194304),
        t
    }
    function vu(t) {
        for (var l = [], e = 0; 31 > e; e++)
            l.push(t);
        return l
    }
    function gu(t, l) {
        t.pendingLanes |= l,
        l !== 268435456 && (t.suspendedLanes = 0,
        t.pingedLanes = 0,
        t.warmLanes = 0)
    }
    function zd(t, l, e, a, u, n) {
        var c = t.pendingLanes;
        t.pendingLanes = e,
        t.suspendedLanes = 0,
        t.pingedLanes = 0,
        t.warmLanes = 0,
        t.expiredLanes &= e,
        t.entangledLanes &= e,
        t.errorRecoveryDisabledLanes &= e,
        t.shellSuspendCounter = 0;
        var f = t.entanglements
          , r = t.expirationTimes
          , b = t.hiddenUpdates;
        for (e = c & ~e; 0 < e; ) {
            var _ = 31 - vl(e)
              , M = 1 << _;
            f[_] = 0,
            r[_] = -1;
            var T = b[_];
            if (T !== null)
                for (b[_] = null,
                _ = 0; _ < T.length; _++) {
                    var E = T[_];
                    E !== null && (E.lane &= -536870913)
                }
            e &= ~M
        }
        a !== 0 && no(t, a, 0),
        n !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= n & ~(c & ~l))
    }
    function no(t, l, e) {
        t.pendingLanes |= l,
        t.suspendedLanes &= ~l;
        var a = 31 - vl(l);
        t.entangledLanes |= l,
        t.entanglements[a] = t.entanglements[a] | 1073741824 | e & 261930
    }
    function io(t, l) {
        var e = t.entangledLanes |= l;
        for (t = t.entanglements; e; ) {
            var a = 31 - vl(e)
              , u = 1 << a;
            u & l | t[a] & l && (t[a] |= l),
            e &= ~u
        }
    }
    function co(t, l) {
        var e = l & -l;
        return e = (e & 42) !== 0 ? 1 : Hi(e),
        (e & (t.suspendedLanes | l)) !== 0 ? 0 : e
    }
    function Hi(t) {
        switch (t) {
        case 2:
            t = 1;
            break;
        case 8:
            t = 4;
            break;
        case 32:
            t = 16;
            break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            t = 128;
            break;
        case 268435456:
            t = 134217728;
            break;
        default:
            t = 0
        }
        return t
    }
    function Bi(t) {
        return t &= -t,
        2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2
    }
    function fo() {
        var t = H.p;
        return t !== 0 ? t : (t = window.event,
        t === void 0 ? 32 : k0(t.type))
    }
    function oo(t, l) {
        var e = H.p;
        try {
            return H.p = t,
            l()
        } finally {
            H.p = e
        }
    }
    var Be = Math.random().toString(36).slice(2)
      , fl = "__reactFiber$" + Be
      , Tl = "__reactProps$" + Be
      , Na = "__reactContainer$" + Be
      , Yi = "__reactEvents$" + Be
      , Md = "__reactListeners$" + Be
      , Rd = "__reactHandles$" + Be
      , so = "__reactResources$" + Be
      , Su = "__reactMarker$" + Be;
    function qi(t) {
        delete t[fl],
        delete t[Tl],
        delete t[Yi],
        delete t[Md],
        delete t[Rd]
    }
    function Ca(t) {
        var l = t[fl];
        if (l)
            return l;
        for (var e = t.parentNode; e; ) {
            if (l = e[Na] || e[fl]) {
                if (e = l.alternate,
                l.child !== null || e !== null && e.child !== null)
                    for (t = U0(t); t !== null; ) {
                        if (e = t[fl])
                            return e;
                        t = U0(t)
                    }
                return l
            }
            t = e,
            e = t.parentNode
        }
        return null
    }
    function Ua(t) {
        if (t = t[fl] || t[Na]) {
            var l = t.tag;
            if (l === 5 || l === 6 || l === 13 || l === 31 || l === 26 || l === 27 || l === 3)
                return t
        }
        return null
    }
    function bu(t) {
        var l = t.tag;
        if (l === 5 || l === 26 || l === 27 || l === 6)
            return t.stateNode;
        throw Error(o(33))
    }
    function Ha(t) {
        var l = t[so];
        return l || (l = t[so] = {
            hoistableStyles: new Map,
            hoistableScripts: new Map
        }),
        l
    }
    function ul(t) {
        t[Su] = !0
    }
    var ro = new Set
      , mo = {};
    function fa(t, l) {
        Ba(t, l),
        Ba(t + "Capture", l)
    }
    function Ba(t, l) {
        for (mo[t] = l,
        t = 0; t < l.length; t++)
            ro.add(l[t])
    }
    var Dd = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$")
      , yo = {}
      , ho = {};
    function Nd(t) {
        return tl.call(ho, t) ? !0 : tl.call(yo, t) ? !1 : Dd.test(t) ? ho[t] = !0 : (yo[t] = !0,
        !1)
    }
    function hn(t, l, e) {
        if (Nd(l))
            if (e === null)
                t.removeAttribute(l);
            else {
                switch (typeof e) {
                case "undefined":
                case "function":
                case "symbol":
                    t.removeAttribute(l);
                    return;
                case "boolean":
                    var a = l.toLowerCase().slice(0, 5);
                    if (a !== "data-" && a !== "aria-") {
                        t.removeAttribute(l);
                        return
                    }
                }
                t.setAttribute(l, "" + e)
            }
    }
    function vn(t, l, e) {
        if (e === null)
            t.removeAttribute(l);
        else {
            switch (typeof e) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                t.removeAttribute(l);
                return
            }
            t.setAttribute(l, "" + e)
        }
    }
    function ye(t, l, e, a) {
        if (a === null)
            t.removeAttribute(e);
        else {
            switch (typeof a) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                t.removeAttribute(e);
                return
            }
            t.setAttributeNS(l, e, "" + a)
        }
    }
    function jl(t) {
        switch (typeof t) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
            return t;
        case "object":
            return t;
        default:
            return ""
        }
    }
    function vo(t) {
        var l = t.type;
        return (t = t.nodeName) && t.toLowerCase() === "input" && (l === "checkbox" || l === "radio")
    }
    function Cd(t, l, e) {
        var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, l);
        if (!t.hasOwnProperty(l) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
            var u = a.get
              , n = a.set;
            return Object.defineProperty(t, l, {
                configurable: !0,
                get: function() {
                    return u.call(this)
                },
                set: function(c) {
                    e = "" + c,
                    n.call(this, c)
                }
            }),
            Object.defineProperty(t, l, {
                enumerable: a.enumerable
            }),
            {
                getValue: function() {
                    return e
                },
                setValue: function(c) {
                    e = "" + c
                },
                stopTracking: function() {
                    t._valueTracker = null,
                    delete t[l]
                }
            }
        }
    }
    function Gi(t) {
        if (!t._valueTracker) {
            var l = vo(t) ? "checked" : "value";
            t._valueTracker = Cd(t, l, "" + t[l])
        }
    }
    function go(t) {
        if (!t)
            return !1;
        var l = t._valueTracker;
        if (!l)
            return !0;
        var e = l.getValue()
          , a = "";
        return t && (a = vo(t) ? t.checked ? "true" : "false" : t.value),
        t = a,
        t !== e ? (l.setValue(t),
        !0) : !1
    }
    function gn(t) {
        if (t = t || (typeof document < "u" ? document : void 0),
        typeof t > "u")
            return null;
        try {
            return t.activeElement || t.body
        } catch {
            return t.body
        }
    }
    var Ud = /[\n"\\]/g;
    function Xl(t) {
        return t.replace(Ud, function(l) {
            return "\\" + l.charCodeAt(0).toString(16) + " "
        })
    }
    function Li(t, l, e, a, u, n, c, f) {
        t.name = "",
        c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.type = c : t.removeAttribute("type"),
        l != null ? c === "number" ? (l === 0 && t.value === "" || t.value != l) && (t.value = "" + jl(l)) : t.value !== "" + jl(l) && (t.value = "" + jl(l)) : c !== "submit" && c !== "reset" || t.removeAttribute("value"),
        l != null ? ji(t, c, jl(l)) : e != null ? ji(t, c, jl(e)) : a != null && t.removeAttribute("value"),
        u == null && n != null && (t.defaultChecked = !!n),
        u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"),
        f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? t.name = "" + jl(f) : t.removeAttribute("name")
    }
    function So(t, l, e, a, u, n, c, f) {
        if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (t.type = n),
        l != null || e != null) {
            if (!(n !== "submit" && n !== "reset" || l != null)) {
                Gi(t);
                return
            }
            e = e != null ? "" + jl(e) : "",
            l = l != null ? "" + jl(l) : e,
            f || l === t.value || (t.value = l),
            t.defaultValue = l
        }
        a = a ?? u,
        a = typeof a != "function" && typeof a != "symbol" && !!a,
        t.checked = f ? t.checked : !!a,
        t.defaultChecked = !!a,
        c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.name = c),
        Gi(t)
    }
    function ji(t, l, e) {
        l === "number" && gn(t.ownerDocument) === t || t.defaultValue === "" + e || (t.defaultValue = "" + e)
    }
    function Ya(t, l, e, a) {
        if (t = t.options,
        l) {
            l = {};
            for (var u = 0; u < e.length; u++)
                l["$" + e[u]] = !0;
            for (e = 0; e < t.length; e++)
                u = l.hasOwnProperty("$" + t[e].value),
                t[e].selected !== u && (t[e].selected = u),
                u && a && (t[e].defaultSelected = !0)
        } else {
            for (e = "" + jl(e),
            l = null,
            u = 0; u < t.length; u++) {
                if (t[u].value === e) {
                    t[u].selected = !0,
                    a && (t[u].defaultSelected = !0);
                    return
                }
                l !== null || t[u].disabled || (l = t[u])
            }
            l !== null && (l.selected = !0)
        }
    }
    function bo(t, l, e) {
        if (l != null && (l = "" + jl(l),
        l !== t.value && (t.value = l),
        e == null)) {
            t.defaultValue !== l && (t.defaultValue = l);
            return
        }
        t.defaultValue = e != null ? "" + jl(e) : ""
    }
    function To(t, l, e, a) {
        if (l == null) {
            if (a != null) {
                if (e != null)
                    throw Error(o(92));
                if (Wt(a)) {
                    if (1 < a.length)
                        throw Error(o(93));
                    a = a[0]
                }
                e = a
            }
            e == null && (e = ""),
            l = e
        }
        e = jl(l),
        t.defaultValue = e,
        a = t.textContent,
        a === e && a !== "" && a !== null && (t.value = a),
        Gi(t)
    }
    function qa(t, l) {
        if (l) {
            var e = t.firstChild;
            if (e && e === t.lastChild && e.nodeType === 3) {
                e.nodeValue = l;
                return
            }
        }
        t.textContent = l
    }
    var Hd = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function po(t, l, e) {
        var a = l.indexOf("--") === 0;
        e == null || typeof e == "boolean" || e === "" ? a ? t.setProperty(l, "") : l === "float" ? t.cssFloat = "" : t[l] = "" : a ? t.setProperty(l, e) : typeof e != "number" || e === 0 || Hd.has(l) ? l === "float" ? t.cssFloat = e : t[l] = ("" + e).trim() : t[l] = e + "px"
    }
    function Eo(t, l, e) {
        if (l != null && typeof l != "object")
            throw Error(o(62));
        if (t = t.style,
        e != null) {
            for (var a in e)
                !e.hasOwnProperty(a) || l != null && l.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "");
            for (var u in l)
                a = l[u],
                l.hasOwnProperty(u) && e[u] !== a && po(t, u, a)
        } else
            for (var n in l)
                l.hasOwnProperty(n) && po(t, n, l[n])
    }
    function Xi(t) {
        if (t.indexOf("-") === -1)
            return !1;
        switch (t) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return !1;
        default:
            return !0
        }
    }
    var Bd = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]])
      , Yd = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Sn(t) {
        return Yd.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t
    }
    function he() {}
    var Vi = null;
    function Qi(t) {
        return t = t.target || t.srcElement || window,
        t.correspondingUseElement && (t = t.correspondingUseElement),
        t.nodeType === 3 ? t.parentNode : t
    }
    var Ga = null
      , La = null;
    function Ao(t) {
        var l = Ua(t);
        if (l && (t = l.stateNode)) {
            var e = t[Tl] || null;
            t: switch (t = l.stateNode,
            l.type) {
            case "input":
                if (Li(t, e.value, e.defaultValue, e.defaultValue, e.checked, e.defaultChecked, e.type, e.name),
                l = e.name,
                e.type === "radio" && l != null) {
                    for (e = t; e.parentNode; )
                        e = e.parentNode;
                    for (e = e.querySelectorAll('input[name="' + Xl("" + l) + '"][type="radio"]'),
                    l = 0; l < e.length; l++) {
                        var a = e[l];
                        if (a !== t && a.form === t.form) {
                            var u = a[Tl] || null;
                            if (!u)
                                throw Error(o(90));
                            Li(a, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name)
                        }
                    }
                    for (l = 0; l < e.length; l++)
                        a = e[l],
                        a.form === t.form && go(a)
                }
                break t;
            case "textarea":
                bo(t, e.value, e.defaultValue);
                break t;
            case "select":
                l = e.value,
                l != null && Ya(t, !!e.multiple, l, !1)
            }
        }
    }
    var Zi = !1;
    function Oo(t, l, e) {
        if (Zi)
            return t(l, e);
        Zi = !0;
        try {
            var a = t(l);
            return a
        } finally {
            if (Zi = !1,
            (Ga !== null || La !== null) && (ni(),
            Ga && (l = Ga,
            t = La,
            La = Ga = null,
            Ao(l),
            t)))
                for (l = 0; l < t.length; l++)
                    Ao(t[l])
        }
    }
    function Tu(t, l) {
        var e = t.stateNode;
        if (e === null)
            return null;
        var a = e[Tl] || null;
        if (a === null)
            return null;
        e = a[l];
        t: switch (l) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (a = !a.disabled) || (t = t.type,
            a = !(t === "button" || t === "input" || t === "select" || t === "textarea")),
            t = !a;
            break t;
        default:
            t = !1
        }
        if (t)
            return null;
        if (e && typeof e != "function")
            throw Error(o(231, l, typeof e));
        return e
    }
    var ve = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u")
      , xi = !1;
    if (ve)
        try {
            var pu = {};
            Object.defineProperty(pu, "passive", {
                get: function() {
                    xi = !0
                }
            }),
            window.addEventListener("test", pu, pu),
            window.removeEventListener("test", pu, pu)
        } catch {
            xi = !1
        }
    var Ye = null
      , Ki = null
      , bn = null;
    function _o() {
        if (bn)
            return bn;
        var t, l = Ki, e = l.length, a, u = "value"in Ye ? Ye.value : Ye.textContent, n = u.length;
        for (t = 0; t < e && l[t] === u[t]; t++)
            ;
        var c = e - t;
        for (a = 1; a <= c && l[e - a] === u[n - a]; a++)
            ;
        return bn = u.slice(t, 1 < a ? 1 - a : void 0)
    }
    function Tn(t) {
        var l = t.keyCode;
        return "charCode"in t ? (t = t.charCode,
        t === 0 && l === 13 && (t = 13)) : t = l,
        t === 10 && (t = 13),
        32 <= t || t === 13 ? t : 0
    }
    function pn() {
        return !0
    }
    function zo() {
        return !1
    }
    function pl(t) {
        function l(e, a, u, n, c) {
            this._reactName = e,
            this._targetInst = u,
            this.type = a,
            this.nativeEvent = n,
            this.target = c,
            this.currentTarget = null;
            for (var f in t)
                t.hasOwnProperty(f) && (e = t[f],
                this[f] = e ? e(n) : n[f]);
            return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? pn : zo,
            this.isPropagationStopped = zo,
            this
        }
        return U(l.prototype, {
            preventDefault: function() {
                this.defaultPrevented = !0;
                var e = this.nativeEvent;
                e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1),
                this.isDefaultPrevented = pn)
            },
            stopPropagation: function() {
                var e = this.nativeEvent;
                e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0),
                this.isPropagationStopped = pn)
            },
            persist: function() {},
            isPersistent: pn
        }),
        l
    }
    var oa = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(t) {
            return t.timeStamp || Date.now()
        },
        defaultPrevented: 0,
        isTrusted: 0
    }, En = pl(oa), Eu = U({}, oa, {
        view: 0,
        detail: 0
    }), qd = pl(Eu), Ji, wi, Au, An = U({}, Eu, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Wi,
        button: 0,
        buttons: 0,
        relatedTarget: function(t) {
            return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget
        },
        movementX: function(t) {
            return "movementX"in t ? t.movementX : (t !== Au && (Au && t.type === "mousemove" ? (Ji = t.screenX - Au.screenX,
            wi = t.screenY - Au.screenY) : wi = Ji = 0,
            Au = t),
            Ji)
        },
        movementY: function(t) {
            return "movementY"in t ? t.movementY : wi
        }
    }), Mo = pl(An), Gd = U({}, An, {
        dataTransfer: 0
    }), Ld = pl(Gd), jd = U({}, Eu, {
        relatedTarget: 0
    }), ki = pl(jd), Xd = U({}, oa, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), Vd = pl(Xd), Qd = U({}, oa, {
        clipboardData: function(t) {
            return "clipboardData"in t ? t.clipboardData : window.clipboardData
        }
    }), Zd = pl(Qd), xd = U({}, oa, {
        data: 0
    }), Ro = pl(xd), Kd = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, Jd = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, wd = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    function kd(t) {
        var l = this.nativeEvent;
        return l.getModifierState ? l.getModifierState(t) : (t = wd[t]) ? !!l[t] : !1
    }
    function Wi() {
        return kd
    }
    var Wd = U({}, Eu, {
        key: function(t) {
            if (t.key) {
                var l = Kd[t.key] || t.key;
                if (l !== "Unidentified")
                    return l
            }
            return t.type === "keypress" ? (t = Tn(t),
            t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Jd[t.keyCode] || "Unidentified" : ""
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: Wi,
        charCode: function(t) {
            return t.type === "keypress" ? Tn(t) : 0
        },
        keyCode: function(t) {
            return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
        },
        which: function(t) {
            return t.type === "keypress" ? Tn(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
        }
    })
      , Fd = pl(Wd)
      , $d = U({}, An, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    })
      , Do = pl($d)
      , Id = U({}, Eu, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: Wi
    })
      , Pd = pl(Id)
      , tm = U({}, oa, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    })
      , lm = pl(tm)
      , em = U({}, An, {
        deltaX: function(t) {
            return "deltaX"in t ? t.deltaX : "wheelDeltaX"in t ? -t.wheelDeltaX : 0
        },
        deltaY: function(t) {
            return "deltaY"in t ? t.deltaY : "wheelDeltaY"in t ? -t.wheelDeltaY : "wheelDelta"in t ? -t.wheelDelta : 0
        },
        deltaZ: 0,
        deltaMode: 0
    })
      , am = pl(em)
      , um = U({}, oa, {
        newState: 0,
        oldState: 0
    })
      , nm = pl(um)
      , im = [9, 13, 27, 32]
      , Fi = ve && "CompositionEvent"in window
      , Ou = null;
    ve && "documentMode"in document && (Ou = document.documentMode);
    var cm = ve && "TextEvent"in window && !Ou
      , No = ve && (!Fi || Ou && 8 < Ou && 11 >= Ou)
      , Co = " "
      , Uo = !1;
    function Ho(t, l) {
        switch (t) {
        case "keyup":
            return im.indexOf(l.keyCode) !== -1;
        case "keydown":
            return l.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
            return !0;
        default:
            return !1
        }
    }
    function Bo(t) {
        return t = t.detail,
        typeof t == "object" && "data"in t ? t.data : null
    }
    var ja = !1;
    function fm(t, l) {
        switch (t) {
        case "compositionend":
            return Bo(l);
        case "keypress":
            return l.which !== 32 ? null : (Uo = !0,
            Co);
        case "textInput":
            return t = l.data,
            t === Co && Uo ? null : t;
        default:
            return null
        }
    }
    function om(t, l) {
        if (ja)
            return t === "compositionend" || !Fi && Ho(t, l) ? (t = _o(),
            bn = Ki = Ye = null,
            ja = !1,
            t) : null;
        switch (t) {
        case "paste":
            return null;
        case "keypress":
            if (!(l.ctrlKey || l.altKey || l.metaKey) || l.ctrlKey && l.altKey) {
                if (l.char && 1 < l.char.length)
                    return l.char;
                if (l.which)
                    return String.fromCharCode(l.which)
            }
            return null;
        case "compositionend":
            return No && l.locale !== "ko" ? null : l.data;
        default:
            return null
        }
    }
    var sm = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    };
    function Yo(t) {
        var l = t && t.nodeName && t.nodeName.toLowerCase();
        return l === "input" ? !!sm[t.type] : l === "textarea"
    }
    function qo(t, l, e, a) {
        Ga ? La ? La.push(a) : La = [a] : Ga = a,
        l = di(l, "onChange"),
        0 < l.length && (e = new En("onChange","change",null,e,a),
        t.push({
            event: e,
            listeners: l
        }))
    }
    var _u = null
      , zu = null;
    function rm(t) {
        S0(t, 0)
    }
    function On(t) {
        var l = bu(t);
        if (go(l))
            return t
    }
    function Go(t, l) {
        if (t === "change")
            return l
    }
    var Lo = !1;
    if (ve) {
        var $i;
        if (ve) {
            var Ii = "oninput"in document;
            if (!Ii) {
                var jo = document.createElement("div");
                jo.setAttribute("oninput", "return;"),
                Ii = typeof jo.oninput == "function"
            }
            $i = Ii
        } else
            $i = !1;
        Lo = $i && (!document.documentMode || 9 < document.documentMode)
    }
    function Xo() {
        _u && (_u.detachEvent("onpropertychange", Vo),
        zu = _u = null)
    }
    function Vo(t) {
        if (t.propertyName === "value" && On(zu)) {
            var l = [];
            qo(l, zu, t, Qi(t)),
            Oo(rm, l)
        }
    }
    function dm(t, l, e) {
        t === "focusin" ? (Xo(),
        _u = l,
        zu = e,
        _u.attachEvent("onpropertychange", Vo)) : t === "focusout" && Xo()
    }
    function mm(t) {
        if (t === "selectionchange" || t === "keyup" || t === "keydown")
            return On(zu)
    }
    function ym(t, l) {
        if (t === "click")
            return On(l)
    }
    function hm(t, l) {
        if (t === "input" || t === "change")
            return On(l)
    }
    function vm(t, l) {
        return t === l && (t !== 0 || 1 / t === 1 / l) || t !== t && l !== l
    }
    var Nl = typeof Object.is == "function" ? Object.is : vm;
    function Mu(t, l) {
        if (Nl(t, l))
            return !0;
        if (typeof t != "object" || t === null || typeof l != "object" || l === null)
            return !1;
        var e = Object.keys(t)
          , a = Object.keys(l);
        if (e.length !== a.length)
            return !1;
        for (a = 0; a < e.length; a++) {
            var u = e[a];
            if (!tl.call(l, u) || !Nl(t[u], l[u]))
                return !1
        }
        return !0
    }
    function Qo(t) {
        for (; t && t.firstChild; )
            t = t.firstChild;
        return t
    }
    function Zo(t, l) {
        var e = Qo(t);
        t = 0;
        for (var a; e; ) {
            if (e.nodeType === 3) {
                if (a = t + e.textContent.length,
                t <= l && a >= l)
                    return {
                        node: e,
                        offset: l - t
                    };
                t = a
            }
            t: {
                for (; e; ) {
                    if (e.nextSibling) {
                        e = e.nextSibling;
                        break t
                    }
                    e = e.parentNode
                }
                e = void 0
            }
            e = Qo(e)
        }
    }
    function xo(t, l) {
        return t && l ? t === l ? !0 : t && t.nodeType === 3 ? !1 : l && l.nodeType === 3 ? xo(t, l.parentNode) : "contains"in t ? t.contains(l) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(l) & 16) : !1 : !1
    }
    function Ko(t) {
        t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
        for (var l = gn(t.document); l instanceof t.HTMLIFrameElement; ) {
            try {
                var e = typeof l.contentWindow.location.href == "string"
            } catch {
                e = !1
            }
            if (e)
                t = l.contentWindow;
            else
                break;
            l = gn(t.document)
        }
        return l
    }
    function Pi(t) {
        var l = t && t.nodeName && t.nodeName.toLowerCase();
        return l && (l === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || l === "textarea" || t.contentEditable === "true")
    }
    var gm = ve && "documentMode"in document && 11 >= document.documentMode
      , Xa = null
      , tc = null
      , Ru = null
      , lc = !1;
    function Jo(t, l, e) {
        var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
        lc || Xa == null || Xa !== gn(a) || (a = Xa,
        "selectionStart"in a && Pi(a) ? a = {
            start: a.selectionStart,
            end: a.selectionEnd
        } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(),
        a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset
        }),
        Ru && Mu(Ru, a) || (Ru = a,
        a = di(tc, "onSelect"),
        0 < a.length && (l = new En("onSelect","select",null,l,e),
        t.push({
            event: l,
            listeners: a
        }),
        l.target = Xa)))
    }
    function sa(t, l) {
        var e = {};
        return e[t.toLowerCase()] = l.toLowerCase(),
        e["Webkit" + t] = "webkit" + l,
        e["Moz" + t] = "moz" + l,
        e
    }
    var Va = {
        animationend: sa("Animation", "AnimationEnd"),
        animationiteration: sa("Animation", "AnimationIteration"),
        animationstart: sa("Animation", "AnimationStart"),
        transitionrun: sa("Transition", "TransitionRun"),
        transitionstart: sa("Transition", "TransitionStart"),
        transitioncancel: sa("Transition", "TransitionCancel"),
        transitionend: sa("Transition", "TransitionEnd")
    }
      , ec = {}
      , wo = {};
    ve && (wo = document.createElement("div").style,
    "AnimationEvent"in window || (delete Va.animationend.animation,
    delete Va.animationiteration.animation,
    delete Va.animationstart.animation),
    "TransitionEvent"in window || delete Va.transitionend.transition);
    function ra(t) {
        if (ec[t])
            return ec[t];
        if (!Va[t])
            return t;
        var l = Va[t], e;
        for (e in l)
            if (l.hasOwnProperty(e) && e in wo)
                return ec[t] = l[e];
        return t
    }
    var ko = ra("animationend")
      , Wo = ra("animationiteration")
      , Fo = ra("animationstart")
      , Sm = ra("transitionrun")
      , bm = ra("transitionstart")
      , Tm = ra("transitioncancel")
      , $o = ra("transitionend")
      , Io = new Map
      , ac = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    ac.push("scrollEnd");
    function Fl(t, l) {
        Io.set(t, l),
        fa(l, [t])
    }
    var _n = typeof reportError == "function" ? reportError : function(t) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var l = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
                error: t
            });
            if (!window.dispatchEvent(l))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", t);
            return
        }
        console.error(t)
    }
      , Vl = []
      , Qa = 0
      , uc = 0;
    function zn() {
        for (var t = Qa, l = uc = Qa = 0; l < t; ) {
            var e = Vl[l];
            Vl[l++] = null;
            var a = Vl[l];
            Vl[l++] = null;
            var u = Vl[l];
            Vl[l++] = null;
            var n = Vl[l];
            if (Vl[l++] = null,
            a !== null && u !== null) {
                var c = a.pending;
                c === null ? u.next = u : (u.next = c.next,
                c.next = u),
                a.pending = u
            }
            n !== 0 && Po(e, u, n)
        }
    }
    function Mn(t, l, e, a) {
        Vl[Qa++] = t,
        Vl[Qa++] = l,
        Vl[Qa++] = e,
        Vl[Qa++] = a,
        uc |= a,
        t.lanes |= a,
        t = t.alternate,
        t !== null && (t.lanes |= a)
    }
    function nc(t, l, e, a) {
        return Mn(t, l, e, a),
        Rn(t)
    }
    function da(t, l) {
        return Mn(t, null, null, l),
        Rn(t)
    }
    function Po(t, l, e) {
        t.lanes |= e;
        var a = t.alternate;
        a !== null && (a.lanes |= e);
        for (var u = !1, n = t.return; n !== null; )
            n.childLanes |= e,
            a = n.alternate,
            a !== null && (a.childLanes |= e),
            n.tag === 22 && (t = n.stateNode,
            t === null || t._visibility & 1 || (u = !0)),
            t = n,
            n = n.return;
        return t.tag === 3 ? (n = t.stateNode,
        u && l !== null && (u = 31 - vl(e),
        t = n.hiddenUpdates,
        a = t[u],
        a === null ? t[u] = [l] : a.push(l),
        l.lane = e | 536870912),
        n) : null
    }
    function Rn(t) {
        if (50 < Fu)
            throw Fu = 0,
            hf = null,
            Error(o(185));
        for (var l = t.return; l !== null; )
            t = l,
            l = t.return;
        return t.tag === 3 ? t.stateNode : null
    }
    var Za = {};
    function pm(t, l, e, a) {
        this.tag = t,
        this.key = e,
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null,
        this.index = 0,
        this.refCleanup = this.ref = null,
        this.pendingProps = l,
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null,
        this.mode = a,
        this.subtreeFlags = this.flags = 0,
        this.deletions = null,
        this.childLanes = this.lanes = 0,
        this.alternate = null
    }
    function Cl(t, l, e, a) {
        return new pm(t,l,e,a)
    }
    function ic(t) {
        return t = t.prototype,
        !(!t || !t.isReactComponent)
    }
    function ge(t, l) {
        var e = t.alternate;
        return e === null ? (e = Cl(t.tag, l, t.key, t.mode),
        e.elementType = t.elementType,
        e.type = t.type,
        e.stateNode = t.stateNode,
        e.alternate = t,
        t.alternate = e) : (e.pendingProps = l,
        e.type = t.type,
        e.flags = 0,
        e.subtreeFlags = 0,
        e.deletions = null),
        e.flags = t.flags & 65011712,
        e.childLanes = t.childLanes,
        e.lanes = t.lanes,
        e.child = t.child,
        e.memoizedProps = t.memoizedProps,
        e.memoizedState = t.memoizedState,
        e.updateQueue = t.updateQueue,
        l = t.dependencies,
        e.dependencies = l === null ? null : {
            lanes: l.lanes,
            firstContext: l.firstContext
        },
        e.sibling = t.sibling,
        e.index = t.index,
        e.ref = t.ref,
        e.refCleanup = t.refCleanup,
        e
    }
    function ts(t, l) {
        t.flags &= 65011714;
        var e = t.alternate;
        return e === null ? (t.childLanes = 0,
        t.lanes = l,
        t.child = null,
        t.subtreeFlags = 0,
        t.memoizedProps = null,
        t.memoizedState = null,
        t.updateQueue = null,
        t.dependencies = null,
        t.stateNode = null) : (t.childLanes = e.childLanes,
        t.lanes = e.lanes,
        t.child = e.child,
        t.subtreeFlags = 0,
        t.deletions = null,
        t.memoizedProps = e.memoizedProps,
        t.memoizedState = e.memoizedState,
        t.updateQueue = e.updateQueue,
        t.type = e.type,
        l = e.dependencies,
        t.dependencies = l === null ? null : {
            lanes: l.lanes,
            firstContext: l.firstContext
        }),
        t
    }
    function Dn(t, l, e, a, u, n) {
        var c = 0;
        if (a = t,
        typeof t == "function")
            ic(t) && (c = 1);
        else if (typeof t == "string")
            c = zy(t, e, X.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
        else
            t: switch (t) {
            case wt:
                return t = Cl(31, e, l, u),
                t.elementType = wt,
                t.lanes = n,
                t;
            case ht:
                return ma(e.children, u, n, l);
            case nt:
                c = 8,
                u |= 24;
                break;
            case I:
                return t = Cl(12, e, l, u | 2),
                t.elementType = I,
                t.lanes = n,
                t;
            case pt:
                return t = Cl(13, e, l, u),
                t.elementType = pt,
                t.lanes = n,
                t;
            case rt:
                return t = Cl(19, e, l, u),
                t.elementType = rt,
                t.lanes = n,
                t;
            default:
                if (typeof t == "object" && t !== null)
                    switch (t.$$typeof) {
                    case bt:
                        c = 10;
                        break t;
                    case qt:
                        c = 9;
                        break t;
                    case Ct:
                        c = 11;
                        break t;
                    case F:
                        c = 14;
                        break t;
                    case Ut:
                        c = 16,
                        a = null;
                        break t
                    }
                c = 29,
                e = Error(o(130, t === null ? "null" : typeof t, "")),
                a = null
            }
        return l = Cl(c, e, l, u),
        l.elementType = t,
        l.type = a,
        l.lanes = n,
        l
    }
    function ma(t, l, e, a) {
        return t = Cl(7, t, a, l),
        t.lanes = e,
        t
    }
    function cc(t, l, e) {
        return t = Cl(6, t, null, l),
        t.lanes = e,
        t
    }
    function ls(t) {
        var l = Cl(18, null, null, 0);
        return l.stateNode = t,
        l
    }
    function fc(t, l, e) {
        return l = Cl(4, t.children !== null ? t.children : [], t.key, l),
        l.lanes = e,
        l.stateNode = {
            containerInfo: t.containerInfo,
            pendingChildren: null,
            implementation: t.implementation
        },
        l
    }
    var es = new WeakMap;
    function Ql(t, l) {
        if (typeof t == "object" && t !== null) {
            var e = es.get(t);
            return e !== void 0 ? e : (l = {
                value: t,
                source: l,
                stack: se(l)
            },
            es.set(t, l),
            l)
        }
        return {
            value: t,
            source: l,
            stack: se(l)
        }
    }
    var xa = []
      , Ka = 0
      , Nn = null
      , Du = 0
      , Zl = []
      , xl = 0
      , qe = null
      , ne = 1
      , ie = "";
    function Se(t, l) {
        xa[Ka++] = Du,
        xa[Ka++] = Nn,
        Nn = t,
        Du = l
    }
    function as(t, l, e) {
        Zl[xl++] = ne,
        Zl[xl++] = ie,
        Zl[xl++] = qe,
        qe = t;
        var a = ne;
        t = ie;
        var u = 32 - vl(a) - 1;
        a &= ~(1 << u),
        e += 1;
        var n = 32 - vl(l) + u;
        if (30 < n) {
            var c = u - u % 5;
            n = (a & (1 << c) - 1).toString(32),
            a >>= c,
            u -= c,
            ne = 1 << 32 - vl(l) + u | e << u | a,
            ie = n + t
        } else
            ne = 1 << n | e << u | a,
            ie = t
    }
    function oc(t) {
        t.return !== null && (Se(t, 1),
        as(t, 1, 0))
    }
    function sc(t) {
        for (; t === Nn; )
            Nn = xa[--Ka],
            xa[Ka] = null,
            Du = xa[--Ka],
            xa[Ka] = null;
        for (; t === qe; )
            qe = Zl[--xl],
            Zl[xl] = null,
            ie = Zl[--xl],
            Zl[xl] = null,
            ne = Zl[--xl],
            Zl[xl] = null
    }
    function us(t, l) {
        Zl[xl++] = ne,
        Zl[xl++] = ie,
        Zl[xl++] = qe,
        ne = l.id,
        ie = l.overflow,
        qe = t
    }
    var ol = null
      , Bt = null
      , yt = !1
      , Ge = null
      , Kl = !1
      , rc = Error(o(519));
    function Le(t) {
        var l = Error(o(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
        throw Nu(Ql(l, t)),
        rc
    }
    function ns(t) {
        var l = t.stateNode
          , e = t.type
          , a = t.memoizedProps;
        switch (l[fl] = t,
        l[Tl] = a,
        e) {
        case "dialog":
            st("cancel", l),
            st("close", l);
            break;
        case "iframe":
        case "object":
        case "embed":
            st("load", l);
            break;
        case "video":
        case "audio":
            for (e = 0; e < Iu.length; e++)
                st(Iu[e], l);
            break;
        case "source":
            st("error", l);
            break;
        case "img":
        case "image":
        case "link":
            st("error", l),
            st("load", l);
            break;
        case "details":
            st("toggle", l);
            break;
        case "input":
            st("invalid", l),
            So(l, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0);
            break;
        case "select":
            st("invalid", l);
            break;
        case "textarea":
            st("invalid", l),
            To(l, a.value, a.defaultValue, a.children)
        }
        e = a.children,
        typeof e != "string" && typeof e != "number" && typeof e != "bigint" || l.textContent === "" + e || a.suppressHydrationWarning === !0 || E0(l.textContent, e) ? (a.popover != null && (st("beforetoggle", l),
        st("toggle", l)),
        a.onScroll != null && st("scroll", l),
        a.onScrollEnd != null && st("scrollend", l),
        a.onClick != null && (l.onclick = he),
        l = !0) : l = !1,
        l || Le(t, !0)
    }
    function is(t) {
        for (ol = t.return; ol; )
            switch (ol.tag) {
            case 5:
            case 31:
            case 13:
                Kl = !1;
                return;
            case 27:
            case 3:
                Kl = !0;
                return;
            default:
                ol = ol.return
            }
    }
    function Ja(t) {
        if (t !== ol)
            return !1;
        if (!yt)
            return is(t),
            yt = !0,
            !1;
        var l = t.tag, e;
        if ((e = l !== 3 && l !== 27) && ((e = l === 5) && (e = t.type,
        e = !(e !== "form" && e !== "button") || Nf(t.type, t.memoizedProps)),
        e = !e),
        e && Bt && Le(t),
        is(t),
        l === 13) {
            if (t = t.memoizedState,
            t = t !== null ? t.dehydrated : null,
            !t)
                throw Error(o(317));
            Bt = C0(t)
        } else if (l === 31) {
            if (t = t.memoizedState,
            t = t !== null ? t.dehydrated : null,
            !t)
                throw Error(o(317));
            Bt = C0(t)
        } else
            l === 27 ? (l = Bt,
            Ie(t.type) ? (t = Yf,
            Yf = null,
            Bt = t) : Bt = l) : Bt = ol ? wl(t.stateNode.nextSibling) : null;
        return !0
    }
    function ya() {
        Bt = ol = null,
        yt = !1
    }
    function dc() {
        var t = Ge;
        return t !== null && (_l === null ? _l = t : _l.push.apply(_l, t),
        Ge = null),
        t
    }
    function Nu(t) {
        Ge === null ? Ge = [t] : Ge.push(t)
    }
    var mc = m(null)
      , ha = null
      , be = null;
    function je(t, l, e) {
        q(mc, l._currentValue),
        l._currentValue = e
    }
    function Te(t) {
        t._currentValue = mc.current,
        R(mc)
    }
    function yc(t, l, e) {
        for (; t !== null; ) {
            var a = t.alternate;
            if ((t.childLanes & l) !== l ? (t.childLanes |= l,
            a !== null && (a.childLanes |= l)) : a !== null && (a.childLanes & l) !== l && (a.childLanes |= l),
            t === e)
                break;
            t = t.return
        }
    }
    function hc(t, l, e, a) {
        var u = t.child;
        for (u !== null && (u.return = t); u !== null; ) {
            var n = u.dependencies;
            if (n !== null) {
                var c = u.child;
                n = n.firstContext;
                t: for (; n !== null; ) {
                    var f = n;
                    n = u;
                    for (var r = 0; r < l.length; r++)
                        if (f.context === l[r]) {
                            n.lanes |= e,
                            f = n.alternate,
                            f !== null && (f.lanes |= e),
                            yc(n.return, e, t),
                            a || (c = null);
                            break t
                        }
                    n = f.next
                }
            } else if (u.tag === 18) {
                if (c = u.return,
                c === null)
                    throw Error(o(341));
                c.lanes |= e,
                n = c.alternate,
                n !== null && (n.lanes |= e),
                yc(c, e, t),
                c = null
            } else
                c = u.child;
            if (c !== null)
                c.return = u;
            else
                for (c = u; c !== null; ) {
                    if (c === t) {
                        c = null;
                        break
                    }
                    if (u = c.sibling,
                    u !== null) {
                        u.return = c.return,
                        c = u;
                        break
                    }
                    c = c.return
                }
            u = c
        }
    }
    function wa(t, l, e, a) {
        t = null;
        for (var u = l, n = !1; u !== null; ) {
            if (!n) {
                if ((u.flags & 524288) !== 0)
                    n = !0;
                else if ((u.flags & 262144) !== 0)
                    break
            }
            if (u.tag === 10) {
                var c = u.alternate;
                if (c === null)
                    throw Error(o(387));
                if (c = c.memoizedProps,
                c !== null) {
                    var f = u.type;
                    Nl(u.pendingProps.value, c.value) || (t !== null ? t.push(f) : t = [f])
                }
            } else if (u === vt.current) {
                if (c = u.alternate,
                c === null)
                    throw Error(o(387));
                c.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(an) : t = [an])
            }
            u = u.return
        }
        t !== null && hc(l, t, e, a),
        l.flags |= 262144
    }
    function Cn(t) {
        for (t = t.firstContext; t !== null; ) {
            if (!Nl(t.context._currentValue, t.memoizedValue))
                return !0;
            t = t.next
        }
        return !1
    }
    function va(t) {
        ha = t,
        be = null,
        t = t.dependencies,
        t !== null && (t.firstContext = null)
    }
    function sl(t) {
        return cs(ha, t)
    }
    function Un(t, l) {
        return ha === null && va(t),
        cs(t, l)
    }
    function cs(t, l) {
        var e = l._currentValue;
        if (l = {
            context: l,
            memoizedValue: e,
            next: null
        },
        be === null) {
            if (t === null)
                throw Error(o(308));
            be = l,
            t.dependencies = {
                lanes: 0,
                firstContext: l
            },
            t.flags |= 524288
        } else
            be = be.next = l;
        return e
    }
    var Em = typeof AbortController < "u" ? AbortController : function() {
        var t = []
          , l = this.signal = {
            aborted: !1,
            addEventListener: function(e, a) {
                t.push(a)
            }
        };
        this.abort = function() {
            l.aborted = !0,
            t.forEach(function(e) {
                return e()
            })
        }
    }
      , Am = i.unstable_scheduleCallback
      , Om = i.unstable_NormalPriority
      , Ft = {
        $$typeof: bt,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0
    };
    function vc() {
        return {
            controller: new Em,
            data: new Map,
            refCount: 0
        }
    }
    function Cu(t) {
        t.refCount--,
        t.refCount === 0 && Am(Om, function() {
            t.controller.abort()
        })
    }
    var Uu = null
      , gc = 0
      , ka = 0
      , Wa = null;
    function _m(t, l) {
        if (Uu === null) {
            var e = Uu = [];
            gc = 0,
            ka = pf(),
            Wa = {
                status: "pending",
                value: void 0,
                then: function(a) {
                    e.push(a)
                }
            }
        }
        return gc++,
        l.then(fs, fs),
        l
    }
    function fs() {
        if (--gc === 0 && Uu !== null) {
            Wa !== null && (Wa.status = "fulfilled");
            var t = Uu;
            Uu = null,
            ka = 0,
            Wa = null;
            for (var l = 0; l < t.length; l++)
                (0,
                t[l])()
        }
    }
    function zm(t, l) {
        var e = []
          , a = {
            status: "pending",
            value: null,
            reason: null,
            then: function(u) {
                e.push(u)
            }
        };
        return t.then(function() {
            a.status = "fulfilled",
            a.value = l;
            for (var u = 0; u < e.length; u++)
                (0,
                e[u])(l)
        }, function(u) {
            for (a.status = "rejected",
            a.reason = u,
            u = 0; u < e.length; u++)
                (0,
                e[u])(void 0)
        }),
        a
    }
    var os = O.S;
    O.S = function(t, l) {
        Jr = x(),
        typeof l == "object" && l !== null && typeof l.then == "function" && _m(t, l),
        os !== null && os(t, l)
    }
    ;
    var ga = m(null);
    function Sc() {
        var t = ga.current;
        return t !== null ? t : Dt.pooledCache
    }
    function Hn(t, l) {
        l === null ? q(ga, ga.current) : q(ga, l.pool)
    }
    function ss() {
        var t = Sc();
        return t === null ? null : {
            parent: Ft._currentValue,
            pool: t
        }
    }
    var Fa = Error(o(460))
      , bc = Error(o(474))
      , Bn = Error(o(542))
      , Yn = {
        then: function() {}
    };
    function rs(t) {
        return t = t.status,
        t === "fulfilled" || t === "rejected"
    }
    function ds(t, l, e) {
        switch (e = t[e],
        e === void 0 ? t.push(l) : e !== l && (l.then(he, he),
        l = e),
        l.status) {
        case "fulfilled":
            return l.value;
        case "rejected":
            throw t = l.reason,
            ys(t),
            t;
        default:
            if (typeof l.status == "string")
                l.then(he, he);
            else {
                if (t = Dt,
                t !== null && 100 < t.shellSuspendCounter)
                    throw Error(o(482));
                t = l,
                t.status = "pending",
                t.then(function(a) {
                    if (l.status === "pending") {
                        var u = l;
                        u.status = "fulfilled",
                        u.value = a
                    }
                }, function(a) {
                    if (l.status === "pending") {
                        var u = l;
                        u.status = "rejected",
                        u.reason = a
                    }
                })
            }
            switch (l.status) {
            case "fulfilled":
                return l.value;
            case "rejected":
                throw t = l.reason,
                ys(t),
                t
            }
            throw ba = l,
            Fa
        }
    }
    function Sa(t) {
        try {
            var l = t._init;
            return l(t._payload)
        } catch (e) {
            throw e !== null && typeof e == "object" && typeof e.then == "function" ? (ba = e,
            Fa) : e
        }
    }
    var ba = null;
    function ms() {
        if (ba === null)
            throw Error(o(459));
        var t = ba;
        return ba = null,
        t
    }
    function ys(t) {
        if (t === Fa || t === Bn)
            throw Error(o(483))
    }
    var $a = null
      , Hu = 0;
    function qn(t) {
        var l = Hu;
        return Hu += 1,
        $a === null && ($a = []),
        ds($a, t, l)
    }
    function Bu(t, l) {
        l = l.props.ref,
        t.ref = l !== void 0 ? l : null
    }
    function Gn(t, l) {
        throw l.$$typeof === V ? Error(o(525)) : (t = Object.prototype.toString.call(l),
        Error(o(31, t === "[object Object]" ? "object with keys {" + Object.keys(l).join(", ") + "}" : t)))
    }
    function hs(t) {
        function l(h, d) {
            if (t) {
                var g = h.deletions;
                g === null ? (h.deletions = [d],
                h.flags |= 16) : g.push(d)
            }
        }
        function e(h, d) {
            if (!t)
                return null;
            for (; d !== null; )
                l(h, d),
                d = d.sibling;
            return null
        }
        function a(h) {
            for (var d = new Map; h !== null; )
                h.key !== null ? d.set(h.key, h) : d.set(h.index, h),
                h = h.sibling;
            return d
        }
        function u(h, d) {
            return h = ge(h, d),
            h.index = 0,
            h.sibling = null,
            h
        }
        function n(h, d, g) {
            return h.index = g,
            t ? (g = h.alternate,
            g !== null ? (g = g.index,
            g < d ? (h.flags |= 67108866,
            d) : g) : (h.flags |= 67108866,
            d)) : (h.flags |= 1048576,
            d)
        }
        function c(h) {
            return t && h.alternate === null && (h.flags |= 67108866),
            h
        }
        function f(h, d, g, z) {
            return d === null || d.tag !== 6 ? (d = cc(g, h.mode, z),
            d.return = h,
            d) : (d = u(d, g),
            d.return = h,
            d)
        }
        function r(h, d, g, z) {
            var K = g.type;
            return K === ht ? _(h, d, g.props.children, z, g.key) : d !== null && (d.elementType === K || typeof K == "object" && K !== null && K.$$typeof === Ut && Sa(K) === d.type) ? (d = u(d, g.props),
            Bu(d, g),
            d.return = h,
            d) : (d = Dn(g.type, g.key, g.props, null, h.mode, z),
            Bu(d, g),
            d.return = h,
            d)
        }
        function b(h, d, g, z) {
            return d === null || d.tag !== 4 || d.stateNode.containerInfo !== g.containerInfo || d.stateNode.implementation !== g.implementation ? (d = fc(g, h.mode, z),
            d.return = h,
            d) : (d = u(d, g.children || []),
            d.return = h,
            d)
        }
        function _(h, d, g, z, K) {
            return d === null || d.tag !== 7 ? (d = ma(g, h.mode, z, K),
            d.return = h,
            d) : (d = u(d, g),
            d.return = h,
            d)
        }
        function M(h, d, g) {
            if (typeof d == "string" && d !== "" || typeof d == "number" || typeof d == "bigint")
                return d = cc("" + d, h.mode, g),
                d.return = h,
                d;
            if (typeof d == "object" && d !== null) {
                switch (d.$$typeof) {
                case J:
                    return g = Dn(d.type, d.key, d.props, null, h.mode, g),
                    Bu(g, d),
                    g.return = h,
                    g;
                case ct:
                    return d = fc(d, h.mode, g),
                    d.return = h,
                    d;
                case Ut:
                    return d = Sa(d),
                    M(h, d, g)
                }
                if (Wt(d) || Gt(d))
                    return d = ma(d, h.mode, g, null),
                    d.return = h,
                    d;
                if (typeof d.then == "function")
                    return M(h, qn(d), g);
                if (d.$$typeof === bt)
                    return M(h, Un(h, d), g);
                Gn(h, d)
            }
            return null
        }
        function T(h, d, g, z) {
            var K = d !== null ? d.key : null;
            if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint")
                return K !== null ? null : f(h, d, "" + g, z);
            if (typeof g == "object" && g !== null) {
                switch (g.$$typeof) {
                case J:
                    return g.key === K ? r(h, d, g, z) : null;
                case ct:
                    return g.key === K ? b(h, d, g, z) : null;
                case Ut:
                    return g = Sa(g),
                    T(h, d, g, z)
                }
                if (Wt(g) || Gt(g))
                    return K !== null ? null : _(h, d, g, z, null);
                if (typeof g.then == "function")
                    return T(h, d, qn(g), z);
                if (g.$$typeof === bt)
                    return T(h, d, Un(h, g), z);
                Gn(h, g)
            }
            return null
        }
        function E(h, d, g, z, K) {
            if (typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint")
                return h = h.get(g) || null,
                f(d, h, "" + z, K);
            if (typeof z == "object" && z !== null) {
                switch (z.$$typeof) {
                case J:
                    return h = h.get(z.key === null ? g : z.key) || null,
                    r(d, h, z, K);
                case ct:
                    return h = h.get(z.key === null ? g : z.key) || null,
                    b(d, h, z, K);
                case Ut:
                    return z = Sa(z),
                    E(h, d, g, z, K)
                }
                if (Wt(z) || Gt(z))
                    return h = h.get(g) || null,
                    _(d, h, z, K, null);
                if (typeof z.then == "function")
                    return E(h, d, g, qn(z), K);
                if (z.$$typeof === bt)
                    return E(h, d, g, Un(d, z), K);
                Gn(d, z)
            }
            return null
        }
        function j(h, d, g, z) {
            for (var K = null, gt = null, Q = d, ut = d = 0, mt = null; Q !== null && ut < g.length; ut++) {
                Q.index > ut ? (mt = Q,
                Q = null) : mt = Q.sibling;
                var St = T(h, Q, g[ut], z);
                if (St === null) {
                    Q === null && (Q = mt);
                    break
                }
                t && Q && St.alternate === null && l(h, Q),
                d = n(St, d, ut),
                gt === null ? K = St : gt.sibling = St,
                gt = St,
                Q = mt
            }
            if (ut === g.length)
                return e(h, Q),
                yt && Se(h, ut),
                K;
            if (Q === null) {
                for (; ut < g.length; ut++)
                    Q = M(h, g[ut], z),
                    Q !== null && (d = n(Q, d, ut),
                    gt === null ? K = Q : gt.sibling = Q,
                    gt = Q);
                return yt && Se(h, ut),
                K
            }
            for (Q = a(Q); ut < g.length; ut++)
                mt = E(Q, h, ut, g[ut], z),
                mt !== null && (t && mt.alternate !== null && Q.delete(mt.key === null ? ut : mt.key),
                d = n(mt, d, ut),
                gt === null ? K = mt : gt.sibling = mt,
                gt = mt);
            return t && Q.forEach(function(aa) {
                return l(h, aa)
            }),
            yt && Se(h, ut),
            K
        }
        function w(h, d, g, z) {
            if (g == null)
                throw Error(o(151));
            for (var K = null, gt = null, Q = d, ut = d = 0, mt = null, St = g.next(); Q !== null && !St.done; ut++,
            St = g.next()) {
                Q.index > ut ? (mt = Q,
                Q = null) : mt = Q.sibling;
                var aa = T(h, Q, St.value, z);
                if (aa === null) {
                    Q === null && (Q = mt);
                    break
                }
                t && Q && aa.alternate === null && l(h, Q),
                d = n(aa, d, ut),
                gt === null ? K = aa : gt.sibling = aa,
                gt = aa,
                Q = mt
            }
            if (St.done)
                return e(h, Q),
                yt && Se(h, ut),
                K;
            if (Q === null) {
                for (; !St.done; ut++,
                St = g.next())
                    St = M(h, St.value, z),
                    St !== null && (d = n(St, d, ut),
                    gt === null ? K = St : gt.sibling = St,
                    gt = St);
                return yt && Se(h, ut),
                K
            }
            for (Q = a(Q); !St.done; ut++,
            St = g.next())
                St = E(Q, h, ut, St.value, z),
                St !== null && (t && St.alternate !== null && Q.delete(St.key === null ? ut : St.key),
                d = n(St, d, ut),
                gt === null ? K = St : gt.sibling = St,
                gt = St);
            return t && Q.forEach(function(Gy) {
                return l(h, Gy)
            }),
            yt && Se(h, ut),
            K
        }
        function Rt(h, d, g, z) {
            if (typeof g == "object" && g !== null && g.type === ht && g.key === null && (g = g.props.children),
            typeof g == "object" && g !== null) {
                switch (g.$$typeof) {
                case J:
                    t: {
                        for (var K = g.key; d !== null; ) {
                            if (d.key === K) {
                                if (K = g.type,
                                K === ht) {
                                    if (d.tag === 7) {
                                        e(h, d.sibling),
                                        z = u(d, g.props.children),
                                        z.return = h,
                                        h = z;
                                        break t
                                    }
                                } else if (d.elementType === K || typeof K == "object" && K !== null && K.$$typeof === Ut && Sa(K) === d.type) {
                                    e(h, d.sibling),
                                    z = u(d, g.props),
                                    Bu(z, g),
                                    z.return = h,
                                    h = z;
                                    break t
                                }
                                e(h, d);
                                break
                            } else
                                l(h, d);
                            d = d.sibling
                        }
                        g.type === ht ? (z = ma(g.props.children, h.mode, z, g.key),
                        z.return = h,
                        h = z) : (z = Dn(g.type, g.key, g.props, null, h.mode, z),
                        Bu(z, g),
                        z.return = h,
                        h = z)
                    }
                    return c(h);
                case ct:
                    t: {
                        for (K = g.key; d !== null; ) {
                            if (d.key === K)
                                if (d.tag === 4 && d.stateNode.containerInfo === g.containerInfo && d.stateNode.implementation === g.implementation) {
                                    e(h, d.sibling),
                                    z = u(d, g.children || []),
                                    z.return = h,
                                    h = z;
                                    break t
                                } else {
                                    e(h, d);
                                    break
                                }
                            else
                                l(h, d);
                            d = d.sibling
                        }
                        z = fc(g, h.mode, z),
                        z.return = h,
                        h = z
                    }
                    return c(h);
                case Ut:
                    return g = Sa(g),
                    Rt(h, d, g, z)
                }
                if (Wt(g))
                    return j(h, d, g, z);
                if (Gt(g)) {
                    if (K = Gt(g),
                    typeof K != "function")
                        throw Error(o(150));
                    return g = K.call(g),
                    w(h, d, g, z)
                }
                if (typeof g.then == "function")
                    return Rt(h, d, qn(g), z);
                if (g.$$typeof === bt)
                    return Rt(h, d, Un(h, g), z);
                Gn(h, g)
            }
            return typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint" ? (g = "" + g,
            d !== null && d.tag === 6 ? (e(h, d.sibling),
            z = u(d, g),
            z.return = h,
            h = z) : (e(h, d),
            z = cc(g, h.mode, z),
            z.return = h,
            h = z),
            c(h)) : e(h, d)
        }
        return function(h, d, g, z) {
            try {
                Hu = 0;
                var K = Rt(h, d, g, z);
                return $a = null,
                K
            } catch (Q) {
                if (Q === Fa || Q === Bn)
                    throw Q;
                var gt = Cl(29, Q, null, h.mode);
                return gt.lanes = z,
                gt.return = h,
                gt
            }
        }
    }
    var Ta = hs(!0)
      , vs = hs(!1)
      , Xe = !1;
    function Tc(t) {
        t.updateQueue = {
            baseState: t.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: {
                pending: null,
                lanes: 0,
                hiddenCallbacks: null
            },
            callbacks: null
        }
    }
    function pc(t, l) {
        t = t.updateQueue,
        l.updateQueue === t && (l.updateQueue = {
            baseState: t.baseState,
            firstBaseUpdate: t.firstBaseUpdate,
            lastBaseUpdate: t.lastBaseUpdate,
            shared: t.shared,
            callbacks: null
        })
    }
    function Ve(t) {
        return {
            lane: t,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        }
    }
    function Qe(t, l, e) {
        var a = t.updateQueue;
        if (a === null)
            return null;
        if (a = a.shared,
        (Tt & 2) !== 0) {
            var u = a.pending;
            return u === null ? l.next = l : (l.next = u.next,
            u.next = l),
            a.pending = l,
            l = Rn(t),
            Po(t, null, e),
            l
        }
        return Mn(t, a, l, e),
        Rn(t)
    }
    function Yu(t, l, e) {
        if (l = l.updateQueue,
        l !== null && (l = l.shared,
        (e & 4194048) !== 0)) {
            var a = l.lanes;
            a &= t.pendingLanes,
            e |= a,
            l.lanes = e,
            io(t, e)
        }
    }
    function Ec(t, l) {
        var e = t.updateQueue
          , a = t.alternate;
        if (a !== null && (a = a.updateQueue,
        e === a)) {
            var u = null
              , n = null;
            if (e = e.firstBaseUpdate,
            e !== null) {
                do {
                    var c = {
                        lane: e.lane,
                        tag: e.tag,
                        payload: e.payload,
                        callback: null,
                        next: null
                    };
                    n === null ? u = n = c : n = n.next = c,
                    e = e.next
                } while (e !== null);
                n === null ? u = n = l : n = n.next = l
            } else
                u = n = l;
            e = {
                baseState: a.baseState,
                firstBaseUpdate: u,
                lastBaseUpdate: n,
                shared: a.shared,
                callbacks: a.callbacks
            },
            t.updateQueue = e;
            return
        }
        t = e.lastBaseUpdate,
        t === null ? e.firstBaseUpdate = l : t.next = l,
        e.lastBaseUpdate = l
    }
    var Ac = !1;
    function qu() {
        if (Ac) {
            var t = Wa;
            if (t !== null)
                throw t
        }
    }
    function Gu(t, l, e, a) {
        Ac = !1;
        var u = t.updateQueue;
        Xe = !1;
        var n = u.firstBaseUpdate
          , c = u.lastBaseUpdate
          , f = u.shared.pending;
        if (f !== null) {
            u.shared.pending = null;
            var r = f
              , b = r.next;
            r.next = null,
            c === null ? n = b : c.next = b,
            c = r;
            var _ = t.alternate;
            _ !== null && (_ = _.updateQueue,
            f = _.lastBaseUpdate,
            f !== c && (f === null ? _.firstBaseUpdate = b : f.next = b,
            _.lastBaseUpdate = r))
        }
        if (n !== null) {
            var M = u.baseState;
            c = 0,
            _ = b = r = null,
            f = n;
            do {
                var T = f.lane & -536870913
                  , E = T !== f.lane;
                if (E ? (dt & T) === T : (a & T) === T) {
                    T !== 0 && T === ka && (Ac = !0),
                    _ !== null && (_ = _.next = {
                        lane: 0,
                        tag: f.tag,
                        payload: f.payload,
                        callback: null,
                        next: null
                    });
                    t: {
                        var j = t
                          , w = f;
                        T = l;
                        var Rt = e;
                        switch (w.tag) {
                        case 1:
                            if (j = w.payload,
                            typeof j == "function") {
                                M = j.call(Rt, M, T);
                                break t
                            }
                            M = j;
                            break t;
                        case 3:
                            j.flags = j.flags & -65537 | 128;
                        case 0:
                            if (j = w.payload,
                            T = typeof j == "function" ? j.call(Rt, M, T) : j,
                            T == null)
                                break t;
                            M = U({}, M, T);
                            break t;
                        case 2:
                            Xe = !0
                        }
                    }
                    T = f.callback,
                    T !== null && (t.flags |= 64,
                    E && (t.flags |= 8192),
                    E = u.callbacks,
                    E === null ? u.callbacks = [T] : E.push(T))
                } else
                    E = {
                        lane: T,
                        tag: f.tag,
                        payload: f.payload,
                        callback: f.callback,
                        next: null
                    },
                    _ === null ? (b = _ = E,
                    r = M) : _ = _.next = E,
                    c |= T;
                if (f = f.next,
                f === null) {
                    if (f = u.shared.pending,
                    f === null)
                        break;
                    E = f,
                    f = E.next,
                    E.next = null,
                    u.lastBaseUpdate = E,
                    u.shared.pending = null
                }
            } while (!0);
            _ === null && (r = M),
            u.baseState = r,
            u.firstBaseUpdate = b,
            u.lastBaseUpdate = _,
            n === null && (u.shared.lanes = 0),
            we |= c,
            t.lanes = c,
            t.memoizedState = M
        }
    }
    function gs(t, l) {
        if (typeof t != "function")
            throw Error(o(191, t));
        t.call(l)
    }
    function Ss(t, l) {
        var e = t.callbacks;
        if (e !== null)
            for (t.callbacks = null,
            t = 0; t < e.length; t++)
                gs(e[t], l)
    }
    var Ia = m(null)
      , Ln = m(0);
    function bs(t, l) {
        t = De,
        q(Ln, t),
        q(Ia, l),
        De = t | l.baseLanes
    }
    function Oc() {
        q(Ln, De),
        q(Ia, Ia.current)
    }
    function _c() {
        De = Ln.current,
        R(Ia),
        R(Ln)
    }
    var Ul = m(null)
      , Jl = null;
    function Ze(t) {
        var l = t.alternate;
        q(Kt, Kt.current & 1),
        q(Ul, t),
        Jl === null && (l === null || Ia.current !== null || l.memoizedState !== null) && (Jl = t)
    }
    function zc(t) {
        q(Kt, Kt.current),
        q(Ul, t),
        Jl === null && (Jl = t)
    }
    function Ts(t) {
        t.tag === 22 ? (q(Kt, Kt.current),
        q(Ul, t),
        Jl === null && (Jl = t)) : xe()
    }
    function xe() {
        q(Kt, Kt.current),
        q(Ul, Ul.current)
    }
    function Hl(t) {
        R(Ul),
        Jl === t && (Jl = null),
        R(Kt)
    }
    var Kt = m(0);
    function jn(t) {
        for (var l = t; l !== null; ) {
            if (l.tag === 13) {
                var e = l.memoizedState;
                if (e !== null && (e = e.dehydrated,
                e === null || Hf(e) || Bf(e)))
                    return l
            } else if (l.tag === 19 && (l.memoizedProps.revealOrder === "forwards" || l.memoizedProps.revealOrder === "backwards" || l.memoizedProps.revealOrder === "unstable_legacy-backwards" || l.memoizedProps.revealOrder === "together")) {
                if ((l.flags & 128) !== 0)
                    return l
            } else if (l.child !== null) {
                l.child.return = l,
                l = l.child;
                continue
            }
            if (l === t)
                break;
            for (; l.sibling === null; ) {
                if (l.return === null || l.return === t)
                    return null;
                l = l.return
            }
            l.sibling.return = l.return,
            l = l.sibling
        }
        return null
    }
    var pe = 0
      , at = null
      , zt = null
      , $t = null
      , Xn = !1
      , Pa = !1
      , pa = !1
      , Vn = 0
      , Lu = 0
      , tu = null
      , Mm = 0;
    function Qt() {
        throw Error(o(321))
    }
    function Mc(t, l) {
        if (l === null)
            return !1;
        for (var e = 0; e < l.length && e < t.length; e++)
            if (!Nl(t[e], l[e]))
                return !1;
        return !0
    }
    function Rc(t, l, e, a, u, n) {
        return pe = n,
        at = l,
        l.memoizedState = null,
        l.updateQueue = null,
        l.lanes = 0,
        O.H = t === null || t.memoizedState === null ? ar : Zc,
        pa = !1,
        n = e(a, u),
        pa = !1,
        Pa && (n = Es(l, e, a, u)),
        ps(t),
        n
    }
    function ps(t) {
        O.H = Vu;
        var l = zt !== null && zt.next !== null;
        if (pe = 0,
        $t = zt = at = null,
        Xn = !1,
        Lu = 0,
        tu = null,
        l)
            throw Error(o(300));
        t === null || It || (t = t.dependencies,
        t !== null && Cn(t) && (It = !0))
    }
    function Es(t, l, e, a) {
        at = t;
        var u = 0;
        do {
            if (Pa && (tu = null),
            Lu = 0,
            Pa = !1,
            25 <= u)
                throw Error(o(301));
            if (u += 1,
            $t = zt = null,
            t.updateQueue != null) {
                var n = t.updateQueue;
                n.lastEffect = null,
                n.events = null,
                n.stores = null,
                n.memoCache != null && (n.memoCache.index = 0)
            }
            O.H = ur,
            n = l(e, a)
        } while (Pa);
        return n
    }
    function Rm() {
        var t = O.H
          , l = t.useState()[0];
        return l = typeof l.then == "function" ? ju(l) : l,
        t = t.useState()[0],
        (zt !== null ? zt.memoizedState : null) !== t && (at.flags |= 1024),
        l
    }
    function Dc() {
        var t = Vn !== 0;
        return Vn = 0,
        t
    }
    function Nc(t, l, e) {
        l.updateQueue = t.updateQueue,
        l.flags &= -2053,
        t.lanes &= ~e
    }
    function Cc(t) {
        if (Xn) {
            for (t = t.memoizedState; t !== null; ) {
                var l = t.queue;
                l !== null && (l.pending = null),
                t = t.next
            }
            Xn = !1
        }
        pe = 0,
        $t = zt = at = null,
        Pa = !1,
        Lu = Vn = 0,
        tu = null
    }
    function bl() {
        var t = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return $t === null ? at.memoizedState = $t = t : $t = $t.next = t,
        $t
    }
    function Jt() {
        if (zt === null) {
            var t = at.alternate;
            t = t !== null ? t.memoizedState : null
        } else
            t = zt.next;
        var l = $t === null ? at.memoizedState : $t.next;
        if (l !== null)
            $t = l,
            zt = t;
        else {
            if (t === null)
                throw at.alternate === null ? Error(o(467)) : Error(o(310));
            zt = t,
            t = {
                memoizedState: zt.memoizedState,
                baseState: zt.baseState,
                baseQueue: zt.baseQueue,
                queue: zt.queue,
                next: null
            },
            $t === null ? at.memoizedState = $t = t : $t = $t.next = t
        }
        return $t
    }
    function Qn() {
        return {
            lastEffect: null,
            events: null,
            stores: null,
            memoCache: null
        }
    }
    function ju(t) {
        var l = Lu;
        return Lu += 1,
        tu === null && (tu = []),
        t = ds(tu, t, l),
        l = at,
        ($t === null ? l.memoizedState : $t.next) === null && (l = l.alternate,
        O.H = l === null || l.memoizedState === null ? ar : Zc),
        t
    }
    function Zn(t) {
        if (t !== null && typeof t == "object") {
            if (typeof t.then == "function")
                return ju(t);
            if (t.$$typeof === bt)
                return sl(t)
        }
        throw Error(o(438, String(t)))
    }
    function Uc(t) {
        var l = null
          , e = at.updateQueue;
        if (e !== null && (l = e.memoCache),
        l == null) {
            var a = at.alternate;
            a !== null && (a = a.updateQueue,
            a !== null && (a = a.memoCache,
            a != null && (l = {
                data: a.data.map(function(u) {
                    return u.slice()
                }),
                index: 0
            })))
        }
        if (l == null && (l = {
            data: [],
            index: 0
        }),
        e === null && (e = Qn(),
        at.updateQueue = e),
        e.memoCache = l,
        e = l.data[l.index],
        e === void 0)
            for (e = l.data[l.index] = Array(t),
            a = 0; a < t; a++)
                e[a] = Ml;
        return l.index++,
        e
    }
    function Ee(t, l) {
        return typeof l == "function" ? l(t) : l
    }
    function xn(t) {
        var l = Jt();
        return Hc(l, zt, t)
    }
    function Hc(t, l, e) {
        var a = t.queue;
        if (a === null)
            throw Error(o(311));
        a.lastRenderedReducer = e;
        var u = t.baseQueue
          , n = a.pending;
        if (n !== null) {
            if (u !== null) {
                var c = u.next;
                u.next = n.next,
                n.next = c
            }
            l.baseQueue = u = n,
            a.pending = null
        }
        if (n = t.baseState,
        u === null)
            t.memoizedState = n;
        else {
            l = u.next;
            var f = c = null
              , r = null
              , b = l
              , _ = !1;
            do {
                var M = b.lane & -536870913;
                if (M !== b.lane ? (dt & M) === M : (pe & M) === M) {
                    var T = b.revertLane;
                    if (T === 0)
                        r !== null && (r = r.next = {
                            lane: 0,
                            revertLane: 0,
                            gesture: null,
                            action: b.action,
                            hasEagerState: b.hasEagerState,
                            eagerState: b.eagerState,
                            next: null
                        }),
                        M === ka && (_ = !0);
                    else if ((pe & T) === T) {
                        b = b.next,
                        T === ka && (_ = !0);
                        continue
                    } else
                        M = {
                            lane: 0,
                            revertLane: b.revertLane,
                            gesture: null,
                            action: b.action,
                            hasEagerState: b.hasEagerState,
                            eagerState: b.eagerState,
                            next: null
                        },
                        r === null ? (f = r = M,
                        c = n) : r = r.next = M,
                        at.lanes |= T,
                        we |= T;
                    M = b.action,
                    pa && e(n, M),
                    n = b.hasEagerState ? b.eagerState : e(n, M)
                } else
                    T = {
                        lane: M,
                        revertLane: b.revertLane,
                        gesture: b.gesture,
                        action: b.action,
                        hasEagerState: b.hasEagerState,
                        eagerState: b.eagerState,
                        next: null
                    },
                    r === null ? (f = r = T,
                    c = n) : r = r.next = T,
                    at.lanes |= M,
                    we |= M;
                b = b.next
            } while (b !== null && b !== l);
            if (r === null ? c = n : r.next = f,
            !Nl(n, t.memoizedState) && (It = !0,
            _ && (e = Wa,
            e !== null)))
                throw e;
            t.memoizedState = n,
            t.baseState = c,
            t.baseQueue = r,
            a.lastRenderedState = n
        }
        return u === null && (a.lanes = 0),
        [t.memoizedState, a.dispatch]
    }
    function Bc(t) {
        var l = Jt()
          , e = l.queue;
        if (e === null)
            throw Error(o(311));
        e.lastRenderedReducer = t;
        var a = e.dispatch
          , u = e.pending
          , n = l.memoizedState;
        if (u !== null) {
            e.pending = null;
            var c = u = u.next;
            do
                n = t(n, c.action),
                c = c.next;
            while (c !== u);
            Nl(n, l.memoizedState) || (It = !0),
            l.memoizedState = n,
            l.baseQueue === null && (l.baseState = n),
            e.lastRenderedState = n
        }
        return [n, a]
    }
    function As(t, l, e) {
        var a = at
          , u = Jt()
          , n = yt;
        if (n) {
            if (e === void 0)
                throw Error(o(407));
            e = e()
        } else
            e = l();
        var c = !Nl((zt || u).memoizedState, e);
        if (c && (u.memoizedState = e,
        It = !0),
        u = u.queue,
        Gc(zs.bind(null, a, u, t), [t]),
        u.getSnapshot !== l || c || $t !== null && $t.memoizedState.tag & 1) {
            if (a.flags |= 2048,
            lu(9, {
                destroy: void 0
            }, _s.bind(null, a, u, e, l), null),
            Dt === null)
                throw Error(o(349));
            n || (pe & 127) !== 0 || Os(a, l, e)
        }
        return e
    }
    function Os(t, l, e) {
        t.flags |= 16384,
        t = {
            getSnapshot: l,
            value: e
        },
        l = at.updateQueue,
        l === null ? (l = Qn(),
        at.updateQueue = l,
        l.stores = [t]) : (e = l.stores,
        e === null ? l.stores = [t] : e.push(t))
    }
    function _s(t, l, e, a) {
        l.value = e,
        l.getSnapshot = a,
        Ms(l) && Rs(t)
    }
    function zs(t, l, e) {
        return e(function() {
            Ms(l) && Rs(t)
        })
    }
    function Ms(t) {
        var l = t.getSnapshot;
        t = t.value;
        try {
            var e = l();
            return !Nl(t, e)
        } catch {
            return !0
        }
    }
    function Rs(t) {
        var l = da(t, 2);
        l !== null && zl(l, t, 2)
    }
    function Yc(t) {
        var l = bl();
        if (typeof t == "function") {
            var e = t;
            if (t = e(),
            pa) {
                Wl(!0);
                try {
                    e()
                } finally {
                    Wl(!1)
                }
            }
        }
        return l.memoizedState = l.baseState = t,
        l.queue = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Ee,
            lastRenderedState: t
        },
        l
    }
    function Ds(t, l, e, a) {
        return t.baseState = e,
        Hc(t, zt, typeof a == "function" ? a : Ee)
    }
    function Dm(t, l, e, a, u) {
        if (wn(t))
            throw Error(o(485));
        if (t = l.action,
        t !== null) {
            var n = {
                payload: u,
                action: t,
                next: null,
                isTransition: !0,
                status: "pending",
                value: null,
                reason: null,
                listeners: [],
                then: function(c) {
                    n.listeners.push(c)
                }
            };
            O.T !== null ? e(!0) : n.isTransition = !1,
            a(n),
            e = l.pending,
            e === null ? (n.next = l.pending = n,
            Ns(l, n)) : (n.next = e.next,
            l.pending = e.next = n)
        }
    }
    function Ns(t, l) {
        var e = l.action
          , a = l.payload
          , u = t.state;
        if (l.isTransition) {
            var n = O.T
              , c = {};
            O.T = c;
            try {
                var f = e(u, a)
                  , r = O.S;
                r !== null && r(c, f),
                Cs(t, l, f)
            } catch (b) {
                qc(t, l, b)
            } finally {
                n !== null && c.types !== null && (n.types = c.types),
                O.T = n
            }
        } else
            try {
                n = e(u, a),
                Cs(t, l, n)
            } catch (b) {
                qc(t, l, b)
            }
    }
    function Cs(t, l, e) {
        e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(function(a) {
            Us(t, l, a)
        }, function(a) {
            return qc(t, l, a)
        }) : Us(t, l, e)
    }
    function Us(t, l, e) {
        l.status = "fulfilled",
        l.value = e,
        Hs(l),
        t.state = e,
        l = t.pending,
        l !== null && (e = l.next,
        e === l ? t.pending = null : (e = e.next,
        l.next = e,
        Ns(t, e)))
    }
    function qc(t, l, e) {
        var a = t.pending;
        if (t.pending = null,
        a !== null) {
            a = a.next;
            do
                l.status = "rejected",
                l.reason = e,
                Hs(l),
                l = l.next;
            while (l !== a)
        }
        t.action = null
    }
    function Hs(t) {
        t = t.listeners;
        for (var l = 0; l < t.length; l++)
            (0,
            t[l])()
    }
    function Bs(t, l) {
        return l
    }
    function Ys(t, l) {
        if (yt) {
            var e = Dt.formState;
            if (e !== null) {
                t: {
                    var a = at;
                    if (yt) {
                        if (Bt) {
                            l: {
                                for (var u = Bt, n = Kl; u.nodeType !== 8; ) {
                                    if (!n) {
                                        u = null;
                                        break l
                                    }
                                    if (u = wl(u.nextSibling),
                                    u === null) {
                                        u = null;
                                        break l
                                    }
                                }
                                n = u.data,
                                u = n === "F!" || n === "F" ? u : null
                            }
                            if (u) {
                                Bt = wl(u.nextSibling),
                                a = u.data === "F!";
                                break t
                            }
                        }
                        Le(a)
                    }
                    a = !1
                }
                a && (l = e[0])
            }
        }
        return e = bl(),
        e.memoizedState = e.baseState = l,
        a = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Bs,
            lastRenderedState: l
        },
        e.queue = a,
        e = tr.bind(null, at, a),
        a.dispatch = e,
        a = Yc(!1),
        n = Qc.bind(null, at, !1, a.queue),
        a = bl(),
        u = {
            state: l,
            dispatch: null,
            action: t,
            pending: null
        },
        a.queue = u,
        e = Dm.bind(null, at, u, n, e),
        u.dispatch = e,
        a.memoizedState = t,
        [l, e, !1]
    }
    function qs(t) {
        var l = Jt();
        return Gs(l, zt, t)
    }
    function Gs(t, l, e) {
        if (l = Hc(t, l, Bs)[0],
        t = xn(Ee)[0],
        typeof l == "object" && l !== null && typeof l.then == "function")
            try {
                var a = ju(l)
            } catch (c) {
                throw c === Fa ? Bn : c
            }
        else
            a = l;
        l = Jt();
        var u = l.queue
          , n = u.dispatch;
        return e !== l.memoizedState && (at.flags |= 2048,
        lu(9, {
            destroy: void 0
        }, Nm.bind(null, u, e), null)),
        [a, n, t]
    }
    function Nm(t, l) {
        t.action = l
    }
    function Ls(t) {
        var l = Jt()
          , e = zt;
        if (e !== null)
            return Gs(l, e, t);
        Jt(),
        l = l.memoizedState,
        e = Jt();
        var a = e.queue.dispatch;
        return e.memoizedState = t,
        [l, a, !1]
    }
    function lu(t, l, e, a) {
        return t = {
            tag: t,
            create: e,
            deps: a,
            inst: l,
            next: null
        },
        l = at.updateQueue,
        l === null && (l = Qn(),
        at.updateQueue = l),
        e = l.lastEffect,
        e === null ? l.lastEffect = t.next = t : (a = e.next,
        e.next = t,
        t.next = a,
        l.lastEffect = t),
        t
    }
    function js() {
        return Jt().memoizedState
    }
    function Kn(t, l, e, a) {
        var u = bl();
        at.flags |= t,
        u.memoizedState = lu(1 | l, {
            destroy: void 0
        }, e, a === void 0 ? null : a)
    }
    function Jn(t, l, e, a) {
        var u = Jt();
        a = a === void 0 ? null : a;
        var n = u.memoizedState.inst;
        zt !== null && a !== null && Mc(a, zt.memoizedState.deps) ? u.memoizedState = lu(l, n, e, a) : (at.flags |= t,
        u.memoizedState = lu(1 | l, n, e, a))
    }
    function Xs(t, l) {
        Kn(8390656, 8, t, l)
    }
    function Gc(t, l) {
        Jn(2048, 8, t, l)
    }
    function Cm(t) {
        at.flags |= 4;
        var l = at.updateQueue;
        if (l === null)
            l = Qn(),
            at.updateQueue = l,
            l.events = [t];
        else {
            var e = l.events;
            e === null ? l.events = [t] : e.push(t)
        }
    }
    function Vs(t) {
        var l = Jt().memoizedState;
        return Cm({
            ref: l,
            nextImpl: t
        }),
        function() {
            if ((Tt & 2) !== 0)
                throw Error(o(440));
            return l.impl.apply(void 0, arguments)
        }
    }
    function Qs(t, l) {
        return Jn(4, 2, t, l)
    }
    function Zs(t, l) {
        return Jn(4, 4, t, l)
    }
    function xs(t, l) {
        if (typeof l == "function") {
            t = t();
            var e = l(t);
            return function() {
                typeof e == "function" ? e() : l(null)
            }
        }
        if (l != null)
            return t = t(),
            l.current = t,
            function() {
                l.current = null
            }
    }
    function Ks(t, l, e) {
        e = e != null ? e.concat([t]) : null,
        Jn(4, 4, xs.bind(null, l, t), e)
    }
    function Lc() {}
    function Js(t, l) {
        var e = Jt();
        l = l === void 0 ? null : l;
        var a = e.memoizedState;
        return l !== null && Mc(l, a[1]) ? a[0] : (e.memoizedState = [t, l],
        t)
    }
    function ws(t, l) {
        var e = Jt();
        l = l === void 0 ? null : l;
        var a = e.memoizedState;
        if (l !== null && Mc(l, a[1]))
            return a[0];
        if (a = t(),
        pa) {
            Wl(!0);
            try {
                t()
            } finally {
                Wl(!1)
            }
        }
        return e.memoizedState = [a, l],
        a
    }
    function jc(t, l, e) {
        return e === void 0 || (pe & 1073741824) !== 0 && (dt & 261930) === 0 ? t.memoizedState = l : (t.memoizedState = e,
        t = kr(),
        at.lanes |= t,
        we |= t,
        e)
    }
    function ks(t, l, e, a) {
        return Nl(e, l) ? e : Ia.current !== null ? (t = jc(t, e, a),
        Nl(t, l) || (It = !0),
        t) : (pe & 42) === 0 || (pe & 1073741824) !== 0 && (dt & 261930) === 0 ? (It = !0,
        t.memoizedState = e) : (t = kr(),
        at.lanes |= t,
        we |= t,
        l)
    }
    function Ws(t, l, e, a, u) {
        var n = H.p;
        H.p = n !== 0 && 8 > n ? n : 8;
        var c = O.T
          , f = {};
        O.T = f,
        Qc(t, !1, l, e);
        try {
            var r = u()
              , b = O.S;
            if (b !== null && b(f, r),
            r !== null && typeof r == "object" && typeof r.then == "function") {
                var _ = zm(r, a);
                Xu(t, l, _, ql(t))
            } else
                Xu(t, l, a, ql(t))
        } catch (M) {
            Xu(t, l, {
                then: function() {},
                status: "rejected",
                reason: M
            }, ql())
        } finally {
            H.p = n,
            c !== null && f.types !== null && (c.types = f.types),
            O.T = c
        }
    }
    function Um() {}
    function Xc(t, l, e, a) {
        if (t.tag !== 5)
            throw Error(o(476));
        var u = Fs(t).queue;
        Ws(t, u, l, k, e === null ? Um : function() {
            return $s(t),
            e(a)
        }
        )
    }
    function Fs(t) {
        var l = t.memoizedState;
        if (l !== null)
            return l;
        l = {
            memoizedState: k,
            baseState: k,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: Ee,
                lastRenderedState: k
            },
            next: null
        };
        var e = {};
        return l.next = {
            memoizedState: e,
            baseState: e,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: Ee,
                lastRenderedState: e
            },
            next: null
        },
        t.memoizedState = l,
        t = t.alternate,
        t !== null && (t.memoizedState = l),
        l
    }
    function $s(t) {
        var l = Fs(t);
        l.next === null && (l = t.alternate.memoizedState),
        Xu(t, l.next.queue, {}, ql())
    }
    function Vc() {
        return sl(an)
    }
    function Is() {
        return Jt().memoizedState
    }
    function Ps() {
        return Jt().memoizedState
    }
    function Hm(t) {
        for (var l = t.return; l !== null; ) {
            switch (l.tag) {
            case 24:
            case 3:
                var e = ql();
                t = Ve(e);
                var a = Qe(l, t, e);
                a !== null && (zl(a, l, e),
                Yu(a, l, e)),
                l = {
                    cache: vc()
                },
                t.payload = l;
                return
            }
            l = l.return
        }
    }
    function Bm(t, l, e) {
        var a = ql();
        e = {
            lane: a,
            revertLane: 0,
            gesture: null,
            action: e,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        wn(t) ? lr(l, e) : (e = nc(t, l, e, a),
        e !== null && (zl(e, t, a),
        er(e, l, a)))
    }
    function tr(t, l, e) {
        var a = ql();
        Xu(t, l, e, a)
    }
    function Xu(t, l, e, a) {
        var u = {
            lane: a,
            revertLane: 0,
            gesture: null,
            action: e,
            hasEagerState: !1,
            eagerState: null,
            next: null
        };
        if (wn(t))
            lr(l, u);
        else {
            var n = t.alternate;
            if (t.lanes === 0 && (n === null || n.lanes === 0) && (n = l.lastRenderedReducer,
            n !== null))
                try {
                    var c = l.lastRenderedState
                      , f = n(c, e);
                    if (u.hasEagerState = !0,
                    u.eagerState = f,
                    Nl(f, c))
                        return Mn(t, l, u, 0),
                        Dt === null && zn(),
                        !1
                } catch {}
            if (e = nc(t, l, u, a),
            e !== null)
                return zl(e, t, a),
                er(e, l, a),
                !0
        }
        return !1
    }
    function Qc(t, l, e, a) {
        if (a = {
            lane: 2,
            revertLane: pf(),
            gesture: null,
            action: a,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        wn(t)) {
            if (l)
                throw Error(o(479))
        } else
            l = nc(t, e, a, 2),
            l !== null && zl(l, t, 2)
    }
    function wn(t) {
        var l = t.alternate;
        return t === at || l !== null && l === at
    }
    function lr(t, l) {
        Pa = Xn = !0;
        var e = t.pending;
        e === null ? l.next = l : (l.next = e.next,
        e.next = l),
        t.pending = l
    }
    function er(t, l, e) {
        if ((e & 4194048) !== 0) {
            var a = l.lanes;
            a &= t.pendingLanes,
            e |= a,
            l.lanes = e,
            io(t, e)
        }
    }
    var Vu = {
        readContext: sl,
        use: Zn,
        useCallback: Qt,
        useContext: Qt,
        useEffect: Qt,
        useImperativeHandle: Qt,
        useLayoutEffect: Qt,
        useInsertionEffect: Qt,
        useMemo: Qt,
        useReducer: Qt,
        useRef: Qt,
        useState: Qt,
        useDebugValue: Qt,
        useDeferredValue: Qt,
        useTransition: Qt,
        useSyncExternalStore: Qt,
        useId: Qt,
        useHostTransitionStatus: Qt,
        useFormState: Qt,
        useActionState: Qt,
        useOptimistic: Qt,
        useMemoCache: Qt,
        useCacheRefresh: Qt
    };
    Vu.useEffectEvent = Qt;
    var ar = {
        readContext: sl,
        use: Zn,
        useCallback: function(t, l) {
            return bl().memoizedState = [t, l === void 0 ? null : l],
            t
        },
        useContext: sl,
        useEffect: Xs,
        useImperativeHandle: function(t, l, e) {
            e = e != null ? e.concat([t]) : null,
            Kn(4194308, 4, xs.bind(null, l, t), e)
        },
        useLayoutEffect: function(t, l) {
            return Kn(4194308, 4, t, l)
        },
        useInsertionEffect: function(t, l) {
            Kn(4, 2, t, l)
        },
        useMemo: function(t, l) {
            var e = bl();
            l = l === void 0 ? null : l;
            var a = t();
            if (pa) {
                Wl(!0);
                try {
                    t()
                } finally {
                    Wl(!1)
                }
            }
            return e.memoizedState = [a, l],
            a
        },
        useReducer: function(t, l, e) {
            var a = bl();
            if (e !== void 0) {
                var u = e(l);
                if (pa) {
                    Wl(!0);
                    try {
                        e(l)
                    } finally {
                        Wl(!1)
                    }
                }
            } else
                u = l;
            return a.memoizedState = a.baseState = u,
            t = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: t,
                lastRenderedState: u
            },
            a.queue = t,
            t = t.dispatch = Bm.bind(null, at, t),
            [a.memoizedState, t]
        },
        useRef: function(t) {
            var l = bl();
            return t = {
                current: t
            },
            l.memoizedState = t
        },
        useState: function(t) {
            t = Yc(t);
            var l = t.queue
              , e = tr.bind(null, at, l);
            return l.dispatch = e,
            [t.memoizedState, e]
        },
        useDebugValue: Lc,
        useDeferredValue: function(t, l) {
            var e = bl();
            return jc(e, t, l)
        },
        useTransition: function() {
            var t = Yc(!1);
            return t = Ws.bind(null, at, t.queue, !0, !1),
            bl().memoizedState = t,
            [!1, t]
        },
        useSyncExternalStore: function(t, l, e) {
            var a = at
              , u = bl();
            if (yt) {
                if (e === void 0)
                    throw Error(o(407));
                e = e()
            } else {
                if (e = l(),
                Dt === null)
                    throw Error(o(349));
                (dt & 127) !== 0 || Os(a, l, e)
            }
            u.memoizedState = e;
            var n = {
                value: e,
                getSnapshot: l
            };
            return u.queue = n,
            Xs(zs.bind(null, a, n, t), [t]),
            a.flags |= 2048,
            lu(9, {
                destroy: void 0
            }, _s.bind(null, a, n, e, l), null),
            e
        },
        useId: function() {
            var t = bl()
              , l = Dt.identifierPrefix;
            if (yt) {
                var e = ie
                  , a = ne;
                e = (a & ~(1 << 32 - vl(a) - 1)).toString(32) + e,
                l = "_" + l + "R_" + e,
                e = Vn++,
                0 < e && (l += "H" + e.toString(32)),
                l += "_"
            } else
                e = Mm++,
                l = "_" + l + "r_" + e.toString(32) + "_";
            return t.memoizedState = l
        },
        useHostTransitionStatus: Vc,
        useFormState: Ys,
        useActionState: Ys,
        useOptimistic: function(t) {
            var l = bl();
            l.memoizedState = l.baseState = t;
            var e = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: null,
                lastRenderedState: null
            };
            return l.queue = e,
            l = Qc.bind(null, at, !0, e),
            e.dispatch = l,
            [t, l]
        },
        useMemoCache: Uc,
        useCacheRefresh: function() {
            return bl().memoizedState = Hm.bind(null, at)
        },
        useEffectEvent: function(t) {
            var l = bl()
              , e = {
                impl: t
            };
            return l.memoizedState = e,
            function() {
                if ((Tt & 2) !== 0)
                    throw Error(o(440));
                return e.impl.apply(void 0, arguments)
            }
        }
    }
      , Zc = {
        readContext: sl,
        use: Zn,
        useCallback: Js,
        useContext: sl,
        useEffect: Gc,
        useImperativeHandle: Ks,
        useInsertionEffect: Qs,
        useLayoutEffect: Zs,
        useMemo: ws,
        useReducer: xn,
        useRef: js,
        useState: function() {
            return xn(Ee)
        },
        useDebugValue: Lc,
        useDeferredValue: function(t, l) {
            var e = Jt();
            return ks(e, zt.memoizedState, t, l)
        },
        useTransition: function() {
            var t = xn(Ee)[0]
              , l = Jt().memoizedState;
            return [typeof t == "boolean" ? t : ju(t), l]
        },
        useSyncExternalStore: As,
        useId: Is,
        useHostTransitionStatus: Vc,
        useFormState: qs,
        useActionState: qs,
        useOptimistic: function(t, l) {
            var e = Jt();
            return Ds(e, zt, t, l)
        },
        useMemoCache: Uc,
        useCacheRefresh: Ps
    };
    Zc.useEffectEvent = Vs;
    var ur = {
        readContext: sl,
        use: Zn,
        useCallback: Js,
        useContext: sl,
        useEffect: Gc,
        useImperativeHandle: Ks,
        useInsertionEffect: Qs,
        useLayoutEffect: Zs,
        useMemo: ws,
        useReducer: Bc,
        useRef: js,
        useState: function() {
            return Bc(Ee)
        },
        useDebugValue: Lc,
        useDeferredValue: function(t, l) {
            var e = Jt();
            return zt === null ? jc(e, t, l) : ks(e, zt.memoizedState, t, l)
        },
        useTransition: function() {
            var t = Bc(Ee)[0]
              , l = Jt().memoizedState;
            return [typeof t == "boolean" ? t : ju(t), l]
        },
        useSyncExternalStore: As,
        useId: Is,
        useHostTransitionStatus: Vc,
        useFormState: Ls,
        useActionState: Ls,
        useOptimistic: function(t, l) {
            var e = Jt();
            return zt !== null ? Ds(e, zt, t, l) : (e.baseState = t,
            [t, e.queue.dispatch])
        },
        useMemoCache: Uc,
        useCacheRefresh: Ps
    };
    ur.useEffectEvent = Vs;
    function xc(t, l, e, a) {
        l = t.memoizedState,
        e = e(a, l),
        e = e == null ? l : U({}, l, e),
        t.memoizedState = e,
        t.lanes === 0 && (t.updateQueue.baseState = e)
    }
    var Kc = {
        enqueueSetState: function(t, l, e) {
            t = t._reactInternals;
            var a = ql()
              , u = Ve(a);
            u.payload = l,
            e != null && (u.callback = e),
            l = Qe(t, u, a),
            l !== null && (zl(l, t, a),
            Yu(l, t, a))
        },
        enqueueReplaceState: function(t, l, e) {
            t = t._reactInternals;
            var a = ql()
              , u = Ve(a);
            u.tag = 1,
            u.payload = l,
            e != null && (u.callback = e),
            l = Qe(t, u, a),
            l !== null && (zl(l, t, a),
            Yu(l, t, a))
        },
        enqueueForceUpdate: function(t, l) {
            t = t._reactInternals;
            var e = ql()
              , a = Ve(e);
            a.tag = 2,
            l != null && (a.callback = l),
            l = Qe(t, a, e),
            l !== null && (zl(l, t, e),
            Yu(l, t, e))
        }
    };
    function nr(t, l, e, a, u, n, c) {
        return t = t.stateNode,
        typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, n, c) : l.prototype && l.prototype.isPureReactComponent ? !Mu(e, a) || !Mu(u, n) : !0
    }
    function ir(t, l, e, a) {
        t = l.state,
        typeof l.componentWillReceiveProps == "function" && l.componentWillReceiveProps(e, a),
        typeof l.UNSAFE_componentWillReceiveProps == "function" && l.UNSAFE_componentWillReceiveProps(e, a),
        l.state !== t && Kc.enqueueReplaceState(l, l.state, null)
    }
    function Ea(t, l) {
        var e = l;
        if ("ref"in l) {
            e = {};
            for (var a in l)
                a !== "ref" && (e[a] = l[a])
        }
        if (t = t.defaultProps) {
            e === l && (e = U({}, e));
            for (var u in t)
                e[u] === void 0 && (e[u] = t[u])
        }
        return e
    }
    function cr(t) {
        _n(t)
    }
    function fr(t) {
        console.error(t)
    }
    function or(t) {
        _n(t)
    }
    function kn(t, l) {
        try {
            var e = t.onUncaughtError;
            e(l.value, {
                componentStack: l.stack
            })
        } catch (a) {
            setTimeout(function() {
                throw a
            })
        }
    }
    function sr(t, l, e) {
        try {
            var a = t.onCaughtError;
            a(e.value, {
                componentStack: e.stack,
                errorBoundary: l.tag === 1 ? l.stateNode : null
            })
        } catch (u) {
            setTimeout(function() {
                throw u
            })
        }
    }
    function Jc(t, l, e) {
        return e = Ve(e),
        e.tag = 3,
        e.payload = {
            element: null
        },
        e.callback = function() {
            kn(t, l)
        }
        ,
        e
    }
    function rr(t) {
        return t = Ve(t),
        t.tag = 3,
        t
    }
    function dr(t, l, e, a) {
        var u = e.type.getDerivedStateFromError;
        if (typeof u == "function") {
            var n = a.value;
            t.payload = function() {
                return u(n)
            }
            ,
            t.callback = function() {
                sr(l, e, a)
            }
        }
        var c = e.stateNode;
        c !== null && typeof c.componentDidCatch == "function" && (t.callback = function() {
            sr(l, e, a),
            typeof u != "function" && (ke === null ? ke = new Set([this]) : ke.add(this));
            var f = a.stack;
            this.componentDidCatch(a.value, {
                componentStack: f !== null ? f : ""
            })
        }
        )
    }
    function Ym(t, l, e, a, u) {
        if (e.flags |= 32768,
        a !== null && typeof a == "object" && typeof a.then == "function") {
            if (l = e.alternate,
            l !== null && wa(l, e, u, !0),
            e = Ul.current,
            e !== null) {
                switch (e.tag) {
                case 31:
                case 13:
                    return Jl === null ? ii() : e.alternate === null && Zt === 0 && (Zt = 3),
                    e.flags &= -257,
                    e.flags |= 65536,
                    e.lanes = u,
                    a === Yn ? e.flags |= 16384 : (l = e.updateQueue,
                    l === null ? e.updateQueue = new Set([a]) : l.add(a),
                    Sf(t, a, u)),
                    !1;
                case 22:
                    return e.flags |= 65536,
                    a === Yn ? e.flags |= 16384 : (l = e.updateQueue,
                    l === null ? (l = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([a])
                    },
                    e.updateQueue = l) : (e = l.retryQueue,
                    e === null ? l.retryQueue = new Set([a]) : e.add(a)),
                    Sf(t, a, u)),
                    !1
                }
                throw Error(o(435, e.tag))
            }
            return Sf(t, a, u),
            ii(),
            !1
        }
        if (yt)
            return l = Ul.current,
            l !== null ? ((l.flags & 65536) === 0 && (l.flags |= 256),
            l.flags |= 65536,
            l.lanes = u,
            a !== rc && (t = Error(o(422), {
                cause: a
            }),
            Nu(Ql(t, e)))) : (a !== rc && (l = Error(o(423), {
                cause: a
            }),
            Nu(Ql(l, e))),
            t = t.current.alternate,
            t.flags |= 65536,
            u &= -u,
            t.lanes |= u,
            a = Ql(a, e),
            u = Jc(t.stateNode, a, u),
            Ec(t, u),
            Zt !== 4 && (Zt = 2)),
            !1;
        var n = Error(o(520), {
            cause: a
        });
        if (n = Ql(n, e),
        Wu === null ? Wu = [n] : Wu.push(n),
        Zt !== 4 && (Zt = 2),
        l === null)
            return !0;
        a = Ql(a, e),
        e = l;
        do {
            switch (e.tag) {
            case 3:
                return e.flags |= 65536,
                t = u & -u,
                e.lanes |= t,
                t = Jc(e.stateNode, a, t),
                Ec(e, t),
                !1;
            case 1:
                if (l = e.type,
                n = e.stateNode,
                (e.flags & 128) === 0 && (typeof l.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (ke === null || !ke.has(n))))
                    return e.flags |= 65536,
                    u &= -u,
                    e.lanes |= u,
                    u = rr(u),
                    dr(u, t, e, a),
                    Ec(e, u),
                    !1
            }
            e = e.return
        } while (e !== null);
        return !1
    }
    var wc = Error(o(461))
      , It = !1;
    function rl(t, l, e, a) {
        l.child = t === null ? vs(l, null, e, a) : Ta(l, t.child, e, a)
    }
    function mr(t, l, e, a, u) {
        e = e.render;
        var n = l.ref;
        if ("ref"in a) {
            var c = {};
            for (var f in a)
                f !== "ref" && (c[f] = a[f])
        } else
            c = a;
        return va(l),
        a = Rc(t, l, e, c, n, u),
        f = Dc(),
        t !== null && !It ? (Nc(t, l, u),
        Ae(t, l, u)) : (yt && f && oc(l),
        l.flags |= 1,
        rl(t, l, a, u),
        l.child)
    }
    function yr(t, l, e, a, u) {
        if (t === null) {
            var n = e.type;
            return typeof n == "function" && !ic(n) && n.defaultProps === void 0 && e.compare === null ? (l.tag = 15,
            l.type = n,
            hr(t, l, n, a, u)) : (t = Dn(e.type, null, a, l, l.mode, u),
            t.ref = l.ref,
            t.return = l,
            l.child = t)
        }
        if (n = t.child,
        !lf(t, u)) {
            var c = n.memoizedProps;
            if (e = e.compare,
            e = e !== null ? e : Mu,
            e(c, a) && t.ref === l.ref)
                return Ae(t, l, u)
        }
        return l.flags |= 1,
        t = ge(n, a),
        t.ref = l.ref,
        t.return = l,
        l.child = t
    }
    function hr(t, l, e, a, u) {
        if (t !== null) {
            var n = t.memoizedProps;
            if (Mu(n, a) && t.ref === l.ref)
                if (It = !1,
                l.pendingProps = a = n,
                lf(t, u))
                    (t.flags & 131072) !== 0 && (It = !0);
                else
                    return l.lanes = t.lanes,
                    Ae(t, l, u)
        }
        return kc(t, l, e, a, u)
    }
    function vr(t, l, e, a) {
        var u = a.children
          , n = t !== null ? t.memoizedState : null;
        if (t === null && l.stateNode === null && (l.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null
        }),
        a.mode === "hidden") {
            if ((l.flags & 128) !== 0) {
                if (n = n !== null ? n.baseLanes | e : e,
                t !== null) {
                    for (a = l.child = t.child,
                    u = 0; a !== null; )
                        u = u | a.lanes | a.childLanes,
                        a = a.sibling;
                    a = u & ~n
                } else
                    a = 0,
                    l.child = null;
                return gr(t, l, n, e, a)
            }
            if ((e & 536870912) !== 0)
                l.memoizedState = {
                    baseLanes: 0,
                    cachePool: null
                },
                t !== null && Hn(l, n !== null ? n.cachePool : null),
                n !== null ? bs(l, n) : Oc(),
                Ts(l);
            else
                return a = l.lanes = 536870912,
                gr(t, l, n !== null ? n.baseLanes | e : e, e, a)
        } else
            n !== null ? (Hn(l, n.cachePool),
            bs(l, n),
            xe(),
            l.memoizedState = null) : (t !== null && Hn(l, null),
            Oc(),
            xe());
        return rl(t, l, u, e),
        l.child
    }
    function Qu(t, l) {
        return t !== null && t.tag === 22 || l.stateNode !== null || (l.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null
        }),
        l.sibling
    }
    function gr(t, l, e, a, u) {
        var n = Sc();
        return n = n === null ? null : {
            parent: Ft._currentValue,
            pool: n
        },
        l.memoizedState = {
            baseLanes: e,
            cachePool: n
        },
        t !== null && Hn(l, null),
        Oc(),
        Ts(l),
        t !== null && wa(t, l, a, !0),
        l.childLanes = u,
        null
    }
    function Wn(t, l) {
        return l = $n({
            mode: l.mode,
            children: l.children
        }, t.mode),
        l.ref = t.ref,
        t.child = l,
        l.return = t,
        l
    }
    function Sr(t, l, e) {
        return Ta(l, t.child, null, e),
        t = Wn(l, l.pendingProps),
        t.flags |= 2,
        Hl(l),
        l.memoizedState = null,
        t
    }
    function qm(t, l, e) {
        var a = l.pendingProps
          , u = (l.flags & 128) !== 0;
        if (l.flags &= -129,
        t === null) {
            if (yt) {
                if (a.mode === "hidden")
                    return t = Wn(l, a),
                    l.lanes = 536870912,
                    Qu(null, t);
                if (zc(l),
                (t = Bt) ? (t = N0(t, Kl),
                t = t !== null && t.data === "&" ? t : null,
                t !== null && (l.memoizedState = {
                    dehydrated: t,
                    treeContext: qe !== null ? {
                        id: ne,
                        overflow: ie
                    } : null,
                    retryLane: 536870912,
                    hydrationErrors: null
                },
                e = ls(t),
                e.return = l,
                l.child = e,
                ol = l,
                Bt = null)) : t = null,
                t === null)
                    throw Le(l);
                return l.lanes = 536870912,
                null
            }
            return Wn(l, a)
        }
        var n = t.memoizedState;
        if (n !== null) {
            var c = n.dehydrated;
            if (zc(l),
            u)
                if (l.flags & 256)
                    l.flags &= -257,
                    l = Sr(t, l, e);
                else if (l.memoizedState !== null)
                    l.child = t.child,
                    l.flags |= 128,
                    l = null;
                else
                    throw Error(o(558));
            else if (It || wa(t, l, e, !1),
            u = (e & t.childLanes) !== 0,
            It || u) {
                if (a = Dt,
                a !== null && (c = co(a, e),
                c !== 0 && c !== n.retryLane))
                    throw n.retryLane = c,
                    da(t, c),
                    zl(a, t, c),
                    wc;
                ii(),
                l = Sr(t, l, e)
            } else
                t = n.treeContext,
                Bt = wl(c.nextSibling),
                ol = l,
                yt = !0,
                Ge = null,
                Kl = !1,
                t !== null && us(l, t),
                l = Wn(l, a),
                l.flags |= 4096;
            return l
        }
        return t = ge(t.child, {
            mode: a.mode,
            children: a.children
        }),
        t.ref = l.ref,
        l.child = t,
        t.return = l,
        t
    }
    function Fn(t, l) {
        var e = l.ref;
        if (e === null)
            t !== null && t.ref !== null && (l.flags |= 4194816);
        else {
            if (typeof e != "function" && typeof e != "object")
                throw Error(o(284));
            (t === null || t.ref !== e) && (l.flags |= 4194816)
        }
    }
    function kc(t, l, e, a, u) {
        return va(l),
        e = Rc(t, l, e, a, void 0, u),
        a = Dc(),
        t !== null && !It ? (Nc(t, l, u),
        Ae(t, l, u)) : (yt && a && oc(l),
        l.flags |= 1,
        rl(t, l, e, u),
        l.child)
    }
    function br(t, l, e, a, u, n) {
        return va(l),
        l.updateQueue = null,
        e = Es(l, a, e, u),
        ps(t),
        a = Dc(),
        t !== null && !It ? (Nc(t, l, n),
        Ae(t, l, n)) : (yt && a && oc(l),
        l.flags |= 1,
        rl(t, l, e, n),
        l.child)
    }
    function Tr(t, l, e, a, u) {
        if (va(l),
        l.stateNode === null) {
            var n = Za
              , c = e.contextType;
            typeof c == "object" && c !== null && (n = sl(c)),
            n = new e(a,n),
            l.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null,
            n.updater = Kc,
            l.stateNode = n,
            n._reactInternals = l,
            n = l.stateNode,
            n.props = a,
            n.state = l.memoizedState,
            n.refs = {},
            Tc(l),
            c = e.contextType,
            n.context = typeof c == "object" && c !== null ? sl(c) : Za,
            n.state = l.memoizedState,
            c = e.getDerivedStateFromProps,
            typeof c == "function" && (xc(l, e, c, a),
            n.state = l.memoizedState),
            typeof e.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (c = n.state,
            typeof n.componentWillMount == "function" && n.componentWillMount(),
            typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(),
            c !== n.state && Kc.enqueueReplaceState(n, n.state, null),
            Gu(l, a, n, u),
            qu(),
            n.state = l.memoizedState),
            typeof n.componentDidMount == "function" && (l.flags |= 4194308),
            a = !0
        } else if (t === null) {
            n = l.stateNode;
            var f = l.memoizedProps
              , r = Ea(e, f);
            n.props = r;
            var b = n.context
              , _ = e.contextType;
            c = Za,
            typeof _ == "object" && _ !== null && (c = sl(_));
            var M = e.getDerivedStateFromProps;
            _ = typeof M == "function" || typeof n.getSnapshotBeforeUpdate == "function",
            f = l.pendingProps !== f,
            _ || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (f || b !== c) && ir(l, n, a, c),
            Xe = !1;
            var T = l.memoizedState;
            n.state = T,
            Gu(l, a, n, u),
            qu(),
            b = l.memoizedState,
            f || T !== b || Xe ? (typeof M == "function" && (xc(l, e, M, a),
            b = l.memoizedState),
            (r = Xe || nr(l, e, r, a, T, b, c)) ? (_ || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(),
            typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()),
            typeof n.componentDidMount == "function" && (l.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (l.flags |= 4194308),
            l.memoizedProps = a,
            l.memoizedState = b),
            n.props = a,
            n.state = b,
            n.context = c,
            a = r) : (typeof n.componentDidMount == "function" && (l.flags |= 4194308),
            a = !1)
        } else {
            n = l.stateNode,
            pc(t, l),
            c = l.memoizedProps,
            _ = Ea(e, c),
            n.props = _,
            M = l.pendingProps,
            T = n.context,
            b = e.contextType,
            r = Za,
            typeof b == "object" && b !== null && (r = sl(b)),
            f = e.getDerivedStateFromProps,
            (b = typeof f == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c !== M || T !== r) && ir(l, n, a, r),
            Xe = !1,
            T = l.memoizedState,
            n.state = T,
            Gu(l, a, n, u),
            qu();
            var E = l.memoizedState;
            c !== M || T !== E || Xe || t !== null && t.dependencies !== null && Cn(t.dependencies) ? (typeof f == "function" && (xc(l, e, f, a),
            E = l.memoizedState),
            (_ = Xe || nr(l, e, _, a, T, E, r) || t !== null && t.dependencies !== null && Cn(t.dependencies)) ? (b || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(a, E, r),
            typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(a, E, r)),
            typeof n.componentDidUpdate == "function" && (l.flags |= 4),
            typeof n.getSnapshotBeforeUpdate == "function" && (l.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || c === t.memoizedProps && T === t.memoizedState || (l.flags |= 4),
            typeof n.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && T === t.memoizedState || (l.flags |= 1024),
            l.memoizedProps = a,
            l.memoizedState = E),
            n.props = a,
            n.state = E,
            n.context = r,
            a = _) : (typeof n.componentDidUpdate != "function" || c === t.memoizedProps && T === t.memoizedState || (l.flags |= 4),
            typeof n.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && T === t.memoizedState || (l.flags |= 1024),
            a = !1)
        }
        return n = a,
        Fn(t, l),
        a = (l.flags & 128) !== 0,
        n || a ? (n = l.stateNode,
        e = a && typeof e.getDerivedStateFromError != "function" ? null : n.render(),
        l.flags |= 1,
        t !== null && a ? (l.child = Ta(l, t.child, null, u),
        l.child = Ta(l, null, e, u)) : rl(t, l, e, u),
        l.memoizedState = n.state,
        t = l.child) : t = Ae(t, l, u),
        t
    }
    function pr(t, l, e, a) {
        return ya(),
        l.flags |= 256,
        rl(t, l, e, a),
        l.child
    }
    var Wc = {
        dehydrated: null,
        treeContext: null,
        retryLane: 0,
        hydrationErrors: null
    };
    function Fc(t) {
        return {
            baseLanes: t,
            cachePool: ss()
        }
    }
    function $c(t, l, e) {
        return t = t !== null ? t.childLanes & ~e : 0,
        l && (t |= Yl),
        t
    }
    function Er(t, l, e) {
        var a = l.pendingProps, u = !1, n = (l.flags & 128) !== 0, c;
        if ((c = n) || (c = t !== null && t.memoizedState === null ? !1 : (Kt.current & 2) !== 0),
        c && (u = !0,
        l.flags &= -129),
        c = (l.flags & 32) !== 0,
        l.flags &= -33,
        t === null) {
            if (yt) {
                if (u ? Ze(l) : xe(),
                (t = Bt) ? (t = N0(t, Kl),
                t = t !== null && t.data !== "&" ? t : null,
                t !== null && (l.memoizedState = {
                    dehydrated: t,
                    treeContext: qe !== null ? {
                        id: ne,
                        overflow: ie
                    } : null,
                    retryLane: 536870912,
                    hydrationErrors: null
                },
                e = ls(t),
                e.return = l,
                l.child = e,
                ol = l,
                Bt = null)) : t = null,
                t === null)
                    throw Le(l);
                return Bf(t) ? l.lanes = 32 : l.lanes = 536870912,
                null
            }
            var f = a.children;
            return a = a.fallback,
            u ? (xe(),
            u = l.mode,
            f = $n({
                mode: "hidden",
                children: f
            }, u),
            a = ma(a, u, e, null),
            f.return = l,
            a.return = l,
            f.sibling = a,
            l.child = f,
            a = l.child,
            a.memoizedState = Fc(e),
            a.childLanes = $c(t, c, e),
            l.memoizedState = Wc,
            Qu(null, a)) : (Ze(l),
            Ic(l, f))
        }
        var r = t.memoizedState;
        if (r !== null && (f = r.dehydrated,
        f !== null)) {
            if (n)
                l.flags & 256 ? (Ze(l),
                l.flags &= -257,
                l = Pc(t, l, e)) : l.memoizedState !== null ? (xe(),
                l.child = t.child,
                l.flags |= 128,
                l = null) : (xe(),
                f = a.fallback,
                u = l.mode,
                a = $n({
                    mode: "visible",
                    children: a.children
                }, u),
                f = ma(f, u, e, null),
                f.flags |= 2,
                a.return = l,
                f.return = l,
                a.sibling = f,
                l.child = a,
                Ta(l, t.child, null, e),
                a = l.child,
                a.memoizedState = Fc(e),
                a.childLanes = $c(t, c, e),
                l.memoizedState = Wc,
                l = Qu(null, a));
            else if (Ze(l),
            Bf(f)) {
                if (c = f.nextSibling && f.nextSibling.dataset,
                c)
                    var b = c.dgst;
                c = b,
                a = Error(o(419)),
                a.stack = "",
                a.digest = c,
                Nu({
                    value: a,
                    source: null,
                    stack: null
                }),
                l = Pc(t, l, e)
            } else if (It || wa(t, l, e, !1),
            c = (e & t.childLanes) !== 0,
            It || c) {
                if (c = Dt,
                c !== null && (a = co(c, e),
                a !== 0 && a !== r.retryLane))
                    throw r.retryLane = a,
                    da(t, a),
                    zl(c, t, a),
                    wc;
                Hf(f) || ii(),
                l = Pc(t, l, e)
            } else
                Hf(f) ? (l.flags |= 192,
                l.child = t.child,
                l = null) : (t = r.treeContext,
                Bt = wl(f.nextSibling),
                ol = l,
                yt = !0,
                Ge = null,
                Kl = !1,
                t !== null && us(l, t),
                l = Ic(l, a.children),
                l.flags |= 4096);
            return l
        }
        return u ? (xe(),
        f = a.fallback,
        u = l.mode,
        r = t.child,
        b = r.sibling,
        a = ge(r, {
            mode: "hidden",
            children: a.children
        }),
        a.subtreeFlags = r.subtreeFlags & 65011712,
        b !== null ? f = ge(b, f) : (f = ma(f, u, e, null),
        f.flags |= 2),
        f.return = l,
        a.return = l,
        a.sibling = f,
        l.child = a,
        Qu(null, a),
        a = l.child,
        f = t.child.memoizedState,
        f === null ? f = Fc(e) : (u = f.cachePool,
        u !== null ? (r = Ft._currentValue,
        u = u.parent !== r ? {
            parent: r,
            pool: r
        } : u) : u = ss(),
        f = {
            baseLanes: f.baseLanes | e,
            cachePool: u
        }),
        a.memoizedState = f,
        a.childLanes = $c(t, c, e),
        l.memoizedState = Wc,
        Qu(t.child, a)) : (Ze(l),
        e = t.child,
        t = e.sibling,
        e = ge(e, {
            mode: "visible",
            children: a.children
        }),
        e.return = l,
        e.sibling = null,
        t !== null && (c = l.deletions,
        c === null ? (l.deletions = [t],
        l.flags |= 16) : c.push(t)),
        l.child = e,
        l.memoizedState = null,
        e)
    }
    function Ic(t, l) {
        return l = $n({
            mode: "visible",
            children: l
        }, t.mode),
        l.return = t,
        t.child = l
    }
    function $n(t, l) {
        return t = Cl(22, t, null, l),
        t.lanes = 0,
        t
    }
    function Pc(t, l, e) {
        return Ta(l, t.child, null, e),
        t = Ic(l, l.pendingProps.children),
        t.flags |= 2,
        l.memoizedState = null,
        t
    }
    function Ar(t, l, e) {
        t.lanes |= l;
        var a = t.alternate;
        a !== null && (a.lanes |= l),
        yc(t.return, l, e)
    }
    function tf(t, l, e, a, u, n) {
        var c = t.memoizedState;
        c === null ? t.memoizedState = {
            isBackwards: l,
            rendering: null,
            renderingStartTime: 0,
            last: a,
            tail: e,
            tailMode: u,
            treeForkCount: n
        } : (c.isBackwards = l,
        c.rendering = null,
        c.renderingStartTime = 0,
        c.last = a,
        c.tail = e,
        c.tailMode = u,
        c.treeForkCount = n)
    }
    function Or(t, l, e) {
        var a = l.pendingProps
          , u = a.revealOrder
          , n = a.tail;
        a = a.children;
        var c = Kt.current
          , f = (c & 2) !== 0;
        if (f ? (c = c & 1 | 2,
        l.flags |= 128) : c &= 1,
        q(Kt, c),
        rl(t, l, a, e),
        a = yt ? Du : 0,
        !f && t !== null && (t.flags & 128) !== 0)
            t: for (t = l.child; t !== null; ) {
                if (t.tag === 13)
                    t.memoizedState !== null && Ar(t, e, l);
                else if (t.tag === 19)
                    Ar(t, e, l);
                else if (t.child !== null) {
                    t.child.return = t,
                    t = t.child;
                    continue
                }
                if (t === l)
                    break t;
                for (; t.sibling === null; ) {
                    if (t.return === null || t.return === l)
                        break t;
                    t = t.return
                }
                t.sibling.return = t.return,
                t = t.sibling
            }
        switch (u) {
        case "forwards":
            for (e = l.child,
            u = null; e !== null; )
                t = e.alternate,
                t !== null && jn(t) === null && (u = e),
                e = e.sibling;
            e = u,
            e === null ? (u = l.child,
            l.child = null) : (u = e.sibling,
            e.sibling = null),
            tf(l, !1, u, e, n, a);
            break;
        case "backwards":
        case "unstable_legacy-backwards":
            for (e = null,
            u = l.child,
            l.child = null; u !== null; ) {
                if (t = u.alternate,
                t !== null && jn(t) === null) {
                    l.child = u;
                    break
                }
                t = u.sibling,
                u.sibling = e,
                e = u,
                u = t
            }
            tf(l, !0, e, null, n, a);
            break;
        case "together":
            tf(l, !1, null, null, void 0, a);
            break;
        default:
            l.memoizedState = null
        }
        return l.child
    }
    function Ae(t, l, e) {
        if (t !== null && (l.dependencies = t.dependencies),
        we |= l.lanes,
        (e & l.childLanes) === 0)
            if (t !== null) {
                if (wa(t, l, e, !1),
                (e & l.childLanes) === 0)
                    return null
            } else
                return null;
        if (t !== null && l.child !== t.child)
            throw Error(o(153));
        if (l.child !== null) {
            for (t = l.child,
            e = ge(t, t.pendingProps),
            l.child = e,
            e.return = l; t.sibling !== null; )
                t = t.sibling,
                e = e.sibling = ge(t, t.pendingProps),
                e.return = l;
            e.sibling = null
        }
        return l.child
    }
    function lf(t, l) {
        return (t.lanes & l) !== 0 ? !0 : (t = t.dependencies,
        !!(t !== null && Cn(t)))
    }
    function Gm(t, l, e) {
        switch (l.tag) {
        case 3:
            B(l, l.stateNode.containerInfo),
            je(l, Ft, t.memoizedState.cache),
            ya();
            break;
        case 27:
        case 5:
            $(l);
            break;
        case 4:
            B(l, l.stateNode.containerInfo);
            break;
        case 10:
            je(l, l.type, l.memoizedProps.value);
            break;
        case 31:
            if (l.memoizedState !== null)
                return l.flags |= 128,
                zc(l),
                null;
            break;
        case 13:
            var a = l.memoizedState;
            if (a !== null)
                return a.dehydrated !== null ? (Ze(l),
                l.flags |= 128,
                null) : (e & l.child.childLanes) !== 0 ? Er(t, l, e) : (Ze(l),
                t = Ae(t, l, e),
                t !== null ? t.sibling : null);
            Ze(l);
            break;
        case 19:
            var u = (t.flags & 128) !== 0;
            if (a = (e & l.childLanes) !== 0,
            a || (wa(t, l, e, !1),
            a = (e & l.childLanes) !== 0),
            u) {
                if (a)
                    return Or(t, l, e);
                l.flags |= 128
            }
            if (u = l.memoizedState,
            u !== null && (u.rendering = null,
            u.tail = null,
            u.lastEffect = null),
            q(Kt, Kt.current),
            a)
                break;
            return null;
        case 22:
            return l.lanes = 0,
            vr(t, l, e, l.pendingProps);
        case 24:
            je(l, Ft, t.memoizedState.cache)
        }
        return Ae(t, l, e)
    }
    function _r(t, l, e) {
        if (t !== null)
            if (t.memoizedProps !== l.pendingProps)
                It = !0;
            else {
                if (!lf(t, e) && (l.flags & 128) === 0)
                    return It = !1,
                    Gm(t, l, e);
                It = (t.flags & 131072) !== 0
            }
        else
            It = !1,
            yt && (l.flags & 1048576) !== 0 && as(l, Du, l.index);
        switch (l.lanes = 0,
        l.tag) {
        case 16:
            t: {
                var a = l.pendingProps;
                if (t = Sa(l.elementType),
                l.type = t,
                typeof t == "function")
                    ic(t) ? (a = Ea(t, a),
                    l.tag = 1,
                    l = Tr(null, l, t, a, e)) : (l.tag = 0,
                    l = kc(null, l, t, a, e));
                else {
                    if (t != null) {
                        var u = t.$$typeof;
                        if (u === Ct) {
                            l.tag = 11,
                            l = mr(null, l, t, a, e);
                            break t
                        } else if (u === F) {
                            l.tag = 14,
                            l = yr(null, l, t, a, e);
                            break t
                        }
                    }
                    throw l = kt(t) || t,
                    Error(o(306, l, ""))
                }
            }
            return l;
        case 0:
            return kc(t, l, l.type, l.pendingProps, e);
        case 1:
            return a = l.type,
            u = Ea(a, l.pendingProps),
            Tr(t, l, a, u, e);
        case 3:
            t: {
                if (B(l, l.stateNode.containerInfo),
                t === null)
                    throw Error(o(387));
                a = l.pendingProps;
                var n = l.memoizedState;
                u = n.element,
                pc(t, l),
                Gu(l, a, null, e);
                var c = l.memoizedState;
                if (a = c.cache,
                je(l, Ft, a),
                a !== n.cache && hc(l, [Ft], e, !0),
                qu(),
                a = c.element,
                n.isDehydrated)
                    if (n = {
                        element: a,
                        isDehydrated: !1,
                        cache: c.cache
                    },
                    l.updateQueue.baseState = n,
                    l.memoizedState = n,
                    l.flags & 256) {
                        l = pr(t, l, a, e);
                        break t
                    } else if (a !== u) {
                        u = Ql(Error(o(424)), l),
                        Nu(u),
                        l = pr(t, l, a, e);
                        break t
                    } else
                        for (t = l.stateNode.containerInfo,
                        t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t,
                        Bt = wl(t.firstChild),
                        ol = l,
                        yt = !0,
                        Ge = null,
                        Kl = !0,
                        e = vs(l, null, a, e),
                        l.child = e; e; )
                            e.flags = e.flags & -3 | 4096,
                            e = e.sibling;
                else {
                    if (ya(),
                    a === u) {
                        l = Ae(t, l, e);
                        break t
                    }
                    rl(t, l, a, e)
                }
                l = l.child
            }
            return l;
        case 26:
            return Fn(t, l),
            t === null ? (e = q0(l.type, null, l.pendingProps, null)) ? l.memoizedState = e : yt || (e = l.type,
            t = l.pendingProps,
            a = mi(it.current).createElement(e),
            a[fl] = l,
            a[Tl] = t,
            dl(a, e, t),
            ul(a),
            l.stateNode = a) : l.memoizedState = q0(l.type, t.memoizedProps, l.pendingProps, t.memoizedState),
            null;
        case 27:
            return $(l),
            t === null && yt && (a = l.stateNode = H0(l.type, l.pendingProps, it.current),
            ol = l,
            Kl = !0,
            u = Bt,
            Ie(l.type) ? (Yf = u,
            Bt = wl(a.firstChild)) : Bt = u),
            rl(t, l, l.pendingProps.children, e),
            Fn(t, l),
            t === null && (l.flags |= 4194304),
            l.child;
        case 5:
            return t === null && yt && ((u = a = Bt) && (a = my(a, l.type, l.pendingProps, Kl),
            a !== null ? (l.stateNode = a,
            ol = l,
            Bt = wl(a.firstChild),
            Kl = !1,
            u = !0) : u = !1),
            u || Le(l)),
            $(l),
            u = l.type,
            n = l.pendingProps,
            c = t !== null ? t.memoizedProps : null,
            a = n.children,
            Nf(u, n) ? a = null : c !== null && Nf(u, c) && (l.flags |= 32),
            l.memoizedState !== null && (u = Rc(t, l, Rm, null, null, e),
            an._currentValue = u),
            Fn(t, l),
            rl(t, l, a, e),
            l.child;
        case 6:
            return t === null && yt && ((t = e = Bt) && (e = yy(e, l.pendingProps, Kl),
            e !== null ? (l.stateNode = e,
            ol = l,
            Bt = null,
            t = !0) : t = !1),
            t || Le(l)),
            null;
        case 13:
            return Er(t, l, e);
        case 4:
            return B(l, l.stateNode.containerInfo),
            a = l.pendingProps,
            t === null ? l.child = Ta(l, null, a, e) : rl(t, l, a, e),
            l.child;
        case 11:
            return mr(t, l, l.type, l.pendingProps, e);
        case 7:
            return rl(t, l, l.pendingProps, e),
            l.child;
        case 8:
            return rl(t, l, l.pendingProps.children, e),
            l.child;
        case 12:
            return rl(t, l, l.pendingProps.children, e),
            l.child;
        case 10:
            return a = l.pendingProps,
            je(l, l.type, a.value),
            rl(t, l, a.children, e),
            l.child;
        case 9:
            return u = l.type._context,
            a = l.pendingProps.children,
            va(l),
            u = sl(u),
            a = a(u),
            l.flags |= 1,
            rl(t, l, a, e),
            l.child;
        case 14:
            return yr(t, l, l.type, l.pendingProps, e);
        case 15:
            return hr(t, l, l.type, l.pendingProps, e);
        case 19:
            return Or(t, l, e);
        case 31:
            return qm(t, l, e);
        case 22:
            return vr(t, l, e, l.pendingProps);
        case 24:
            return va(l),
            a = sl(Ft),
            t === null ? (u = Sc(),
            u === null && (u = Dt,
            n = vc(),
            u.pooledCache = n,
            n.refCount++,
            n !== null && (u.pooledCacheLanes |= e),
            u = n),
            l.memoizedState = {
                parent: a,
                cache: u
            },
            Tc(l),
            je(l, Ft, u)) : ((t.lanes & e) !== 0 && (pc(t, l),
            Gu(l, null, null, e),
            qu()),
            u = t.memoizedState,
            n = l.memoizedState,
            u.parent !== a ? (u = {
                parent: a,
                cache: a
            },
            l.memoizedState = u,
            l.lanes === 0 && (l.memoizedState = l.updateQueue.baseState = u),
            je(l, Ft, a)) : (a = n.cache,
            je(l, Ft, a),
            a !== u.cache && hc(l, [Ft], e, !0))),
            rl(t, l, l.pendingProps.children, e),
            l.child;
        case 29:
            throw l.pendingProps
        }
        throw Error(o(156, l.tag))
    }
    function Oe(t) {
        t.flags |= 4
    }
    function ef(t, l, e, a, u) {
        if ((l = (t.mode & 32) !== 0) && (l = !1),
        l) {
            if (t.flags |= 16777216,
            (u & 335544128) === u)
                if (t.stateNode.complete)
                    t.flags |= 8192;
                else if (Ir())
                    t.flags |= 8192;
                else
                    throw ba = Yn,
                    bc
        } else
            t.flags &= -16777217
    }
    function zr(t, l) {
        if (l.type !== "stylesheet" || (l.state.loading & 4) !== 0)
            t.flags &= -16777217;
        else if (t.flags |= 16777216,
        !V0(l))
            if (Ir())
                t.flags |= 8192;
            else
                throw ba = Yn,
                bc
    }
    function In(t, l) {
        l !== null && (t.flags |= 4),
        t.flags & 16384 && (l = t.tag !== 22 ? yn() : 536870912,
        t.lanes |= l,
        nu |= l)
    }
    function Zu(t, l) {
        if (!yt)
            switch (t.tailMode) {
            case "hidden":
                l = t.tail;
                for (var e = null; l !== null; )
                    l.alternate !== null && (e = l),
                    l = l.sibling;
                e === null ? t.tail = null : e.sibling = null;
                break;
            case "collapsed":
                e = t.tail;
                for (var a = null; e !== null; )
                    e.alternate !== null && (a = e),
                    e = e.sibling;
                a === null ? l || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null
            }
    }
    function Yt(t) {
        var l = t.alternate !== null && t.alternate.child === t.child
          , e = 0
          , a = 0;
        if (l)
            for (var u = t.child; u !== null; )
                e |= u.lanes | u.childLanes,
                a |= u.subtreeFlags & 65011712,
                a |= u.flags & 65011712,
                u.return = t,
                u = u.sibling;
        else
            for (u = t.child; u !== null; )
                e |= u.lanes | u.childLanes,
                a |= u.subtreeFlags,
                a |= u.flags,
                u.return = t,
                u = u.sibling;
        return t.subtreeFlags |= a,
        t.childLanes = e,
        l
    }
    function Lm(t, l, e) {
        var a = l.pendingProps;
        switch (sc(l),
        l.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return Yt(l),
            null;
        case 1:
            return Yt(l),
            null;
        case 3:
            return e = l.stateNode,
            a = null,
            t !== null && (a = t.memoizedState.cache),
            l.memoizedState.cache !== a && (l.flags |= 2048),
            Te(Ft),
            L(),
            e.pendingContext && (e.context = e.pendingContext,
            e.pendingContext = null),
            (t === null || t.child === null) && (Ja(l) ? Oe(l) : t === null || t.memoizedState.isDehydrated && (l.flags & 256) === 0 || (l.flags |= 1024,
            dc())),
            Yt(l),
            null;
        case 26:
            var u = l.type
              , n = l.memoizedState;
            return t === null ? (Oe(l),
            n !== null ? (Yt(l),
            zr(l, n)) : (Yt(l),
            ef(l, u, null, a, e))) : n ? n !== t.memoizedState ? (Oe(l),
            Yt(l),
            zr(l, n)) : (Yt(l),
            l.flags &= -16777217) : (t = t.memoizedProps,
            t !== a && Oe(l),
            Yt(l),
            ef(l, u, t, a, e)),
            null;
        case 27:
            if (Ht(l),
            e = it.current,
            u = l.type,
            t !== null && l.stateNode != null)
                t.memoizedProps !== a && Oe(l);
            else {
                if (!a) {
                    if (l.stateNode === null)
                        throw Error(o(166));
                    return Yt(l),
                    null
                }
                t = X.current,
                Ja(l) ? ns(l) : (t = H0(u, a, e),
                l.stateNode = t,
                Oe(l))
            }
            return Yt(l),
            null;
        case 5:
            if (Ht(l),
            u = l.type,
            t !== null && l.stateNode != null)
                t.memoizedProps !== a && Oe(l);
            else {
                if (!a) {
                    if (l.stateNode === null)
                        throw Error(o(166));
                    return Yt(l),
                    null
                }
                if (n = X.current,
                Ja(l))
                    ns(l);
                else {
                    var c = mi(it.current);
                    switch (n) {
                    case 1:
                        n = c.createElementNS("http://www.w3.org/2000/svg", u);
                        break;
                    case 2:
                        n = c.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                        break;
                    default:
                        switch (u) {
                        case "svg":
                            n = c.createElementNS("http://www.w3.org/2000/svg", u);
                            break;
                        case "math":
                            n = c.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                            break;
                        case "script":
                            n = c.createElement("div"),
                            n.innerHTML = "<script><\/script>",
                            n = n.removeChild(n.firstChild);
                            break;
                        case "select":
                            n = typeof a.is == "string" ? c.createElement("select", {
                                is: a.is
                            }) : c.createElement("select"),
                            a.multiple ? n.multiple = !0 : a.size && (n.size = a.size);
                            break;
                        default:
                            n = typeof a.is == "string" ? c.createElement(u, {
                                is: a.is
                            }) : c.createElement(u)
                        }
                    }
                    n[fl] = l,
                    n[Tl] = a;
                    t: for (c = l.child; c !== null; ) {
                        if (c.tag === 5 || c.tag === 6)
                            n.appendChild(c.stateNode);
                        else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                            c.child.return = c,
                            c = c.child;
                            continue
                        }
                        if (c === l)
                            break t;
                        for (; c.sibling === null; ) {
                            if (c.return === null || c.return === l)
                                break t;
                            c = c.return
                        }
                        c.sibling.return = c.return,
                        c = c.sibling
                    }
                    l.stateNode = n;
                    t: switch (dl(n, u, a),
                    u) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                        a = !!a.autoFocus;
                        break t;
                    case "img":
                        a = !0;
                        break t;
                    default:
                        a = !1
                    }
                    a && Oe(l)
                }
            }
            return Yt(l),
            ef(l, l.type, t === null ? null : t.memoizedProps, l.pendingProps, e),
            null;
        case 6:
            if (t && l.stateNode != null)
                t.memoizedProps !== a && Oe(l);
            else {
                if (typeof a != "string" && l.stateNode === null)
                    throw Error(o(166));
                if (t = it.current,
                Ja(l)) {
                    if (t = l.stateNode,
                    e = l.memoizedProps,
                    a = null,
                    u = ol,
                    u !== null)
                        switch (u.tag) {
                        case 27:
                        case 5:
                            a = u.memoizedProps
                        }
                    t[fl] = l,
                    t = !!(t.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || E0(t.nodeValue, e)),
                    t || Le(l, !0)
                } else
                    t = mi(t).createTextNode(a),
                    t[fl] = l,
                    l.stateNode = t
            }
            return Yt(l),
            null;
        case 31:
            if (e = l.memoizedState,
            t === null || t.memoizedState !== null) {
                if (a = Ja(l),
                e !== null) {
                    if (t === null) {
                        if (!a)
                            throw Error(o(318));
                        if (t = l.memoizedState,
                        t = t !== null ? t.dehydrated : null,
                        !t)
                            throw Error(o(557));
                        t[fl] = l
                    } else
                        ya(),
                        (l.flags & 128) === 0 && (l.memoizedState = null),
                        l.flags |= 4;
                    Yt(l),
                    t = !1
                } else
                    e = dc(),
                    t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = e),
                    t = !0;
                if (!t)
                    return l.flags & 256 ? (Hl(l),
                    l) : (Hl(l),
                    null);
                if ((l.flags & 128) !== 0)
                    throw Error(o(558))
            }
            return Yt(l),
            null;
        case 13:
            if (a = l.memoizedState,
            t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
                if (u = Ja(l),
                a !== null && a.dehydrated !== null) {
                    if (t === null) {
                        if (!u)
                            throw Error(o(318));
                        if (u = l.memoizedState,
                        u = u !== null ? u.dehydrated : null,
                        !u)
                            throw Error(o(317));
                        u[fl] = l
                    } else
                        ya(),
                        (l.flags & 128) === 0 && (l.memoizedState = null),
                        l.flags |= 4;
                    Yt(l),
                    u = !1
                } else
                    u = dc(),
                    t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u),
                    u = !0;
                if (!u)
                    return l.flags & 256 ? (Hl(l),
                    l) : (Hl(l),
                    null)
            }
            return Hl(l),
            (l.flags & 128) !== 0 ? (l.lanes = e,
            l) : (e = a !== null,
            t = t !== null && t.memoizedState !== null,
            e && (a = l.child,
            u = null,
            a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool),
            n = null,
            a.memoizedState !== null && a.memoizedState.cachePool !== null && (n = a.memoizedState.cachePool.pool),
            n !== u && (a.flags |= 2048)),
            e !== t && e && (l.child.flags |= 8192),
            In(l, l.updateQueue),
            Yt(l),
            null);
        case 4:
            return L(),
            t === null && _f(l.stateNode.containerInfo),
            Yt(l),
            null;
        case 10:
            return Te(l.type),
            Yt(l),
            null;
        case 19:
            if (R(Kt),
            a = l.memoizedState,
            a === null)
                return Yt(l),
                null;
            if (u = (l.flags & 128) !== 0,
            n = a.rendering,
            n === null)
                if (u)
                    Zu(a, !1);
                else {
                    if (Zt !== 0 || t !== null && (t.flags & 128) !== 0)
                        for (t = l.child; t !== null; ) {
                            if (n = jn(t),
                            n !== null) {
                                for (l.flags |= 128,
                                Zu(a, !1),
                                t = n.updateQueue,
                                l.updateQueue = t,
                                In(l, t),
                                l.subtreeFlags = 0,
                                t = e,
                                e = l.child; e !== null; )
                                    ts(e, t),
                                    e = e.sibling;
                                return q(Kt, Kt.current & 1 | 2),
                                yt && Se(l, a.treeForkCount),
                                l.child
                            }
                            t = t.sibling
                        }
                    a.tail !== null && x() > ai && (l.flags |= 128,
                    u = !0,
                    Zu(a, !1),
                    l.lanes = 4194304)
                }
            else {
                if (!u)
                    if (t = jn(n),
                    t !== null) {
                        if (l.flags |= 128,
                        u = !0,
                        t = t.updateQueue,
                        l.updateQueue = t,
                        In(l, t),
                        Zu(a, !0),
                        a.tail === null && a.tailMode === "hidden" && !n.alternate && !yt)
                            return Yt(l),
                            null
                    } else
                        2 * x() - a.renderingStartTime > ai && e !== 536870912 && (l.flags |= 128,
                        u = !0,
                        Zu(a, !1),
                        l.lanes = 4194304);
                a.isBackwards ? (n.sibling = l.child,
                l.child = n) : (t = a.last,
                t !== null ? t.sibling = n : l.child = n,
                a.last = n)
            }
            return a.tail !== null ? (t = a.tail,
            a.rendering = t,
            a.tail = t.sibling,
            a.renderingStartTime = x(),
            t.sibling = null,
            e = Kt.current,
            q(Kt, u ? e & 1 | 2 : e & 1),
            yt && Se(l, a.treeForkCount),
            t) : (Yt(l),
            null);
        case 22:
        case 23:
            return Hl(l),
            _c(),
            a = l.memoizedState !== null,
            t !== null ? t.memoizedState !== null !== a && (l.flags |= 8192) : a && (l.flags |= 8192),
            a ? (e & 536870912) !== 0 && (l.flags & 128) === 0 && (Yt(l),
            l.subtreeFlags & 6 && (l.flags |= 8192)) : Yt(l),
            e = l.updateQueue,
            e !== null && In(l, e.retryQueue),
            e = null,
            t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool),
            a = null,
            l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool),
            a !== e && (l.flags |= 2048),
            t !== null && R(ga),
            null;
        case 24:
            return e = null,
            t !== null && (e = t.memoizedState.cache),
            l.memoizedState.cache !== e && (l.flags |= 2048),
            Te(Ft),
            Yt(l),
            null;
        case 25:
            return null;
        case 30:
            return null
        }
        throw Error(o(156, l.tag))
    }
    function jm(t, l) {
        switch (sc(l),
        l.tag) {
        case 1:
            return t = l.flags,
            t & 65536 ? (l.flags = t & -65537 | 128,
            l) : null;
        case 3:
            return Te(Ft),
            L(),
            t = l.flags,
            (t & 65536) !== 0 && (t & 128) === 0 ? (l.flags = t & -65537 | 128,
            l) : null;
        case 26:
        case 27:
        case 5:
            return Ht(l),
            null;
        case 31:
            if (l.memoizedState !== null) {
                if (Hl(l),
                l.alternate === null)
                    throw Error(o(340));
                ya()
            }
            return t = l.flags,
            t & 65536 ? (l.flags = t & -65537 | 128,
            l) : null;
        case 13:
            if (Hl(l),
            t = l.memoizedState,
            t !== null && t.dehydrated !== null) {
                if (l.alternate === null)
                    throw Error(o(340));
                ya()
            }
            return t = l.flags,
            t & 65536 ? (l.flags = t & -65537 | 128,
            l) : null;
        case 19:
            return R(Kt),
            null;
        case 4:
            return L(),
            null;
        case 10:
            return Te(l.type),
            null;
        case 22:
        case 23:
            return Hl(l),
            _c(),
            t !== null && R(ga),
            t = l.flags,
            t & 65536 ? (l.flags = t & -65537 | 128,
            l) : null;
        case 24:
            return Te(Ft),
            null;
        case 25:
            return null;
        default:
            return null
        }
    }
    function Mr(t, l) {
        switch (sc(l),
        l.tag) {
        case 3:
            Te(Ft),
            L();
            break;
        case 26:
        case 27:
        case 5:
            Ht(l);
            break;
        case 4:
            L();
            break;
        case 31:
            l.memoizedState !== null && Hl(l);
            break;
        case 13:
            Hl(l);
            break;
        case 19:
            R(Kt);
            break;
        case 10:
            Te(l.type);
            break;
        case 22:
        case 23:
            Hl(l),
            _c(),
            t !== null && R(ga);
            break;
        case 24:
            Te(Ft)
        }
    }
    function xu(t, l) {
        try {
            var e = l.updateQueue
              , a = e !== null ? e.lastEffect : null;
            if (a !== null) {
                var u = a.next;
                e = u;
                do {
                    if ((e.tag & t) === t) {
                        a = void 0;
                        var n = e.create
                          , c = e.inst;
                        a = n(),
                        c.destroy = a
                    }
                    e = e.next
                } while (e !== u)
            }
        } catch (f) {
            _t(l, l.return, f)
        }
    }
    function Ke(t, l, e) {
        try {
            var a = l.updateQueue
              , u = a !== null ? a.lastEffect : null;
            if (u !== null) {
                var n = u.next;
                a = n;
                do {
                    if ((a.tag & t) === t) {
                        var c = a.inst
                          , f = c.destroy;
                        if (f !== void 0) {
                            c.destroy = void 0,
                            u = l;
                            var r = e
                              , b = f;
                            try {
                                b()
                            } catch (_) {
                                _t(u, r, _)
                            }
                        }
                    }
                    a = a.next
                } while (a !== n)
            }
        } catch (_) {
            _t(l, l.return, _)
        }
    }
    function Rr(t) {
        var l = t.updateQueue;
        if (l !== null) {
            var e = t.stateNode;
            try {
                Ss(l, e)
            } catch (a) {
                _t(t, t.return, a)
            }
        }
    }
    function Dr(t, l, e) {
        e.props = Ea(t.type, t.memoizedProps),
        e.state = t.memoizedState;
        try {
            e.componentWillUnmount()
        } catch (a) {
            _t(t, l, a)
        }
    }
    function Ku(t, l) {
        try {
            var e = t.ref;
            if (e !== null) {
                switch (t.tag) {
                case 26:
                case 27:
                case 5:
                    var a = t.stateNode;
                    break;
                case 30:
                    a = t.stateNode;
                    break;
                default:
                    a = t.stateNode
                }
                typeof e == "function" ? t.refCleanup = e(a) : e.current = a
            }
        } catch (u) {
            _t(t, l, u)
        }
    }
    function ce(t, l) {
        var e = t.ref
          , a = t.refCleanup;
        if (e !== null)
            if (typeof a == "function")
                try {
                    a()
                } catch (u) {
                    _t(t, l, u)
                } finally {
                    t.refCleanup = null,
                    t = t.alternate,
                    t != null && (t.refCleanup = null)
                }
            else if (typeof e == "function")
                try {
                    e(null)
                } catch (u) {
                    _t(t, l, u)
                }
            else
                e.current = null
    }
    function Nr(t) {
        var l = t.type
          , e = t.memoizedProps
          , a = t.stateNode;
        try {
            t: switch (l) {
            case "button":
            case "input":
            case "select":
            case "textarea":
                e.autoFocus && a.focus();
                break t;
            case "img":
                e.src ? a.src = e.src : e.srcSet && (a.srcset = e.srcSet)
            }
        } catch (u) {
            _t(t, t.return, u)
        }
    }
    function af(t, l, e) {
        try {
            var a = t.stateNode;
            cy(a, t.type, e, l),
            a[Tl] = l
        } catch (u) {
            _t(t, t.return, u)
        }
    }
    function Cr(t) {
        return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Ie(t.type) || t.tag === 4
    }
    function uf(t) {
        t: for (; ; ) {
            for (; t.sibling === null; ) {
                if (t.return === null || Cr(t.return))
                    return null;
                t = t.return
            }
            for (t.sibling.return = t.return,
            t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
                if (t.tag === 27 && Ie(t.type) || t.flags & 2 || t.child === null || t.tag === 4)
                    continue t;
                t.child.return = t,
                t = t.child
            }
            if (!(t.flags & 2))
                return t.stateNode
        }
    }
    function nf(t, l, e) {
        var a = t.tag;
        if (a === 5 || a === 6)
            t = t.stateNode,
            l ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(t, l) : (l = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
            l.appendChild(t),
            e = e._reactRootContainer,
            e != null || l.onclick !== null || (l.onclick = he));
        else if (a !== 4 && (a === 27 && Ie(t.type) && (e = t.stateNode,
        l = null),
        t = t.child,
        t !== null))
            for (nf(t, l, e),
            t = t.sibling; t !== null; )
                nf(t, l, e),
                t = t.sibling
    }
    function Pn(t, l, e) {
        var a = t.tag;
        if (a === 5 || a === 6)
            t = t.stateNode,
            l ? e.insertBefore(t, l) : e.appendChild(t);
        else if (a !== 4 && (a === 27 && Ie(t.type) && (e = t.stateNode),
        t = t.child,
        t !== null))
            for (Pn(t, l, e),
            t = t.sibling; t !== null; )
                Pn(t, l, e),
                t = t.sibling
    }
    function Ur(t) {
        var l = t.stateNode
          , e = t.memoizedProps;
        try {
            for (var a = t.type, u = l.attributes; u.length; )
                l.removeAttributeNode(u[0]);
            dl(l, a, e),
            l[fl] = t,
            l[Tl] = e
        } catch (n) {
            _t(t, t.return, n)
        }
    }
    var _e = !1
      , Pt = !1
      , cf = !1
      , Hr = typeof WeakSet == "function" ? WeakSet : Set
      , nl = null;
    function Xm(t, l) {
        if (t = t.containerInfo,
        Rf = Ti,
        t = Ko(t),
        Pi(t)) {
            if ("selectionStart"in t)
                var e = {
                    start: t.selectionStart,
                    end: t.selectionEnd
                };
            else
                t: {
                    e = (e = t.ownerDocument) && e.defaultView || window;
                    var a = e.getSelection && e.getSelection();
                    if (a && a.rangeCount !== 0) {
                        e = a.anchorNode;
                        var u = a.anchorOffset
                          , n = a.focusNode;
                        a = a.focusOffset;
                        try {
                            e.nodeType,
                            n.nodeType
                        } catch {
                            e = null;
                            break t
                        }
                        var c = 0
                          , f = -1
                          , r = -1
                          , b = 0
                          , _ = 0
                          , M = t
                          , T = null;
                        l: for (; ; ) {
                            for (var E; M !== e || u !== 0 && M.nodeType !== 3 || (f = c + u),
                            M !== n || a !== 0 && M.nodeType !== 3 || (r = c + a),
                            M.nodeType === 3 && (c += M.nodeValue.length),
                            (E = M.firstChild) !== null; )
                                T = M,
                                M = E;
                            for (; ; ) {
                                if (M === t)
                                    break l;
                                if (T === e && ++b === u && (f = c),
                                T === n && ++_ === a && (r = c),
                                (E = M.nextSibling) !== null)
                                    break;
                                M = T,
                                T = M.parentNode
                            }
                            M = E
                        }
                        e = f === -1 || r === -1 ? null : {
                            start: f,
                            end: r
                        }
                    } else
                        e = null
                }
            e = e || {
                start: 0,
                end: 0
            }
        } else
            e = null;
        for (Df = {
            focusedElem: t,
            selectionRange: e
        },
        Ti = !1,
        nl = l; nl !== null; )
            if (l = nl,
            t = l.child,
            (l.subtreeFlags & 1028) !== 0 && t !== null)
                t.return = l,
                nl = t;
            else
                for (; nl !== null; ) {
                    switch (l = nl,
                    n = l.alternate,
                    t = l.flags,
                    l.tag) {
                    case 0:
                        if ((t & 4) !== 0 && (t = l.updateQueue,
                        t = t !== null ? t.events : null,
                        t !== null))
                            for (e = 0; e < t.length; e++)
                                u = t[e],
                                u.ref.impl = u.nextImpl;
                        break;
                    case 11:
                    case 15:
                        break;
                    case 1:
                        if ((t & 1024) !== 0 && n !== null) {
                            t = void 0,
                            e = l,
                            u = n.memoizedProps,
                            n = n.memoizedState,
                            a = e.stateNode;
                            try {
                                var j = Ea(e.type, u);
                                t = a.getSnapshotBeforeUpdate(j, n),
                                a.__reactInternalSnapshotBeforeUpdate = t
                            } catch (w) {
                                _t(e, e.return, w)
                            }
                        }
                        break;
                    case 3:
                        if ((t & 1024) !== 0) {
                            if (t = l.stateNode.containerInfo,
                            e = t.nodeType,
                            e === 9)
                                Uf(t);
                            else if (e === 1)
                                switch (t.nodeName) {
                                case "HEAD":
                                case "HTML":
                                case "BODY":
                                    Uf(t);
                                    break;
                                default:
                                    t.textContent = ""
                                }
                        }
                        break;
                    case 5:
                    case 26:
                    case 27:
                    case 6:
                    case 4:
                    case 17:
                        break;
                    default:
                        if ((t & 1024) !== 0)
                            throw Error(o(163))
                    }
                    if (t = l.sibling,
                    t !== null) {
                        t.return = l.return,
                        nl = t;
                        break
                    }
                    nl = l.return
                }
    }
    function Br(t, l, e) {
        var a = e.flags;
        switch (e.tag) {
        case 0:
        case 11:
        case 15:
            Me(t, e),
            a & 4 && xu(5, e);
            break;
        case 1:
            if (Me(t, e),
            a & 4)
                if (t = e.stateNode,
                l === null)
                    try {
                        t.componentDidMount()
                    } catch (c) {
                        _t(e, e.return, c)
                    }
                else {
                    var u = Ea(e.type, l.memoizedProps);
                    l = l.memoizedState;
                    try {
                        t.componentDidUpdate(u, l, t.__reactInternalSnapshotBeforeUpdate)
                    } catch (c) {
                        _t(e, e.return, c)
                    }
                }
            a & 64 && Rr(e),
            a & 512 && Ku(e, e.return);
            break;
        case 3:
            if (Me(t, e),
            a & 64 && (t = e.updateQueue,
            t !== null)) {
                if (l = null,
                e.child !== null)
                    switch (e.child.tag) {
                    case 27:
                    case 5:
                        l = e.child.stateNode;
                        break;
                    case 1:
                        l = e.child.stateNode
                    }
                try {
                    Ss(t, l)
                } catch (c) {
                    _t(e, e.return, c)
                }
            }
            break;
        case 27:
            l === null && a & 4 && Ur(e);
        case 26:
        case 5:
            Me(t, e),
            l === null && a & 4 && Nr(e),
            a & 512 && Ku(e, e.return);
            break;
        case 12:
            Me(t, e);
            break;
        case 31:
            Me(t, e),
            a & 4 && Gr(t, e);
            break;
        case 13:
            Me(t, e),
            a & 4 && Lr(t, e),
            a & 64 && (t = e.memoizedState,
            t !== null && (t = t.dehydrated,
            t !== null && (e = Wm.bind(null, e),
            hy(t, e))));
            break;
        case 22:
            if (a = e.memoizedState !== null || _e,
            !a) {
                l = l !== null && l.memoizedState !== null || Pt,
                u = _e;
                var n = Pt;
                _e = a,
                (Pt = l) && !n ? Re(t, e, (e.subtreeFlags & 8772) !== 0) : Me(t, e),
                _e = u,
                Pt = n
            }
            break;
        case 30:
            break;
        default:
            Me(t, e)
        }
    }
    function Yr(t) {
        var l = t.alternate;
        l !== null && (t.alternate = null,
        Yr(l)),
        t.child = null,
        t.deletions = null,
        t.sibling = null,
        t.tag === 5 && (l = t.stateNode,
        l !== null && qi(l)),
        t.stateNode = null,
        t.return = null,
        t.dependencies = null,
        t.memoizedProps = null,
        t.memoizedState = null,
        t.pendingProps = null,
        t.stateNode = null,
        t.updateQueue = null
    }
    var jt = null
      , El = !1;
    function ze(t, l, e) {
        for (e = e.child; e !== null; )
            qr(t, l, e),
            e = e.sibling
    }
    function qr(t, l, e) {
        if (ft && typeof ft.onCommitFiberUnmount == "function")
            try {
                ft.onCommitFiberUnmount(ae, e)
            } catch {}
        switch (e.tag) {
        case 26:
            Pt || ce(e, l),
            ze(t, l, e),
            e.memoizedState ? e.memoizedState.count-- : e.stateNode && (e = e.stateNode,
            e.parentNode.removeChild(e));
            break;
        case 27:
            Pt || ce(e, l);
            var a = jt
              , u = El;
            Ie(e.type) && (jt = e.stateNode,
            El = !1),
            ze(t, l, e),
            tn(e.stateNode),
            jt = a,
            El = u;
            break;
        case 5:
            Pt || ce(e, l);
        case 6:
            if (a = jt,
            u = El,
            jt = null,
            ze(t, l, e),
            jt = a,
            El = u,
            jt !== null)
                if (El)
                    try {
                        (jt.nodeType === 9 ? jt.body : jt.nodeName === "HTML" ? jt.ownerDocument.body : jt).removeChild(e.stateNode)
                    } catch (n) {
                        _t(e, l, n)
                    }
                else
                    try {
                        jt.removeChild(e.stateNode)
                    } catch (n) {
                        _t(e, l, n)
                    }
            break;
        case 18:
            jt !== null && (El ? (t = jt,
            R0(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, e.stateNode),
            mu(t)) : R0(jt, e.stateNode));
            break;
        case 4:
            a = jt,
            u = El,
            jt = e.stateNode.containerInfo,
            El = !0,
            ze(t, l, e),
            jt = a,
            El = u;
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            Ke(2, e, l),
            Pt || Ke(4, e, l),
            ze(t, l, e);
            break;
        case 1:
            Pt || (ce(e, l),
            a = e.stateNode,
            typeof a.componentWillUnmount == "function" && Dr(e, l, a)),
            ze(t, l, e);
            break;
        case 21:
            ze(t, l, e);
            break;
        case 22:
            Pt = (a = Pt) || e.memoizedState !== null,
            ze(t, l, e),
            Pt = a;
            break;
        default:
            ze(t, l, e)
        }
    }
    function Gr(t, l) {
        if (l.memoizedState === null && (t = l.alternate,
        t !== null && (t = t.memoizedState,
        t !== null))) {
            t = t.dehydrated;
            try {
                mu(t)
            } catch (e) {
                _t(l, l.return, e)
            }
        }
    }
    function Lr(t, l) {
        if (l.memoizedState === null && (t = l.alternate,
        t !== null && (t = t.memoizedState,
        t !== null && (t = t.dehydrated,
        t !== null))))
            try {
                mu(t)
            } catch (e) {
                _t(l, l.return, e)
            }
    }
    function Vm(t) {
        switch (t.tag) {
        case 31:
        case 13:
        case 19:
            var l = t.stateNode;
            return l === null && (l = t.stateNode = new Hr),
            l;
        case 22:
            return t = t.stateNode,
            l = t._retryCache,
            l === null && (l = t._retryCache = new Hr),
            l;
        default:
            throw Error(o(435, t.tag))
        }
    }
    function ti(t, l) {
        var e = Vm(t);
        l.forEach(function(a) {
            if (!e.has(a)) {
                e.add(a);
                var u = Fm.bind(null, t, a);
                a.then(u, u)
            }
        })
    }
    function Al(t, l) {
        var e = l.deletions;
        if (e !== null)
            for (var a = 0; a < e.length; a++) {
                var u = e[a]
                  , n = t
                  , c = l
                  , f = c;
                t: for (; f !== null; ) {
                    switch (f.tag) {
                    case 27:
                        if (Ie(f.type)) {
                            jt = f.stateNode,
                            El = !1;
                            break t
                        }
                        break;
                    case 5:
                        jt = f.stateNode,
                        El = !1;
                        break t;
                    case 3:
                    case 4:
                        jt = f.stateNode.containerInfo,
                        El = !0;
                        break t
                    }
                    f = f.return
                }
                if (jt === null)
                    throw Error(o(160));
                qr(n, c, u),
                jt = null,
                El = !1,
                n = u.alternate,
                n !== null && (n.return = null),
                u.return = null
            }
        if (l.subtreeFlags & 13886)
            for (l = l.child; l !== null; )
                jr(l, t),
                l = l.sibling
    }
    var $l = null;
    function jr(t, l) {
        var e = t.alternate
          , a = t.flags;
        switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            Al(l, t),
            Ol(t),
            a & 4 && (Ke(3, t, t.return),
            xu(3, t),
            Ke(5, t, t.return));
            break;
        case 1:
            Al(l, t),
            Ol(t),
            a & 512 && (Pt || e === null || ce(e, e.return)),
            a & 64 && _e && (t = t.updateQueue,
            t !== null && (a = t.callbacks,
            a !== null && (e = t.shared.hiddenCallbacks,
            t.shared.hiddenCallbacks = e === null ? a : e.concat(a))));
            break;
        case 26:
            var u = $l;
            if (Al(l, t),
            Ol(t),
            a & 512 && (Pt || e === null || ce(e, e.return)),
            a & 4) {
                var n = e !== null ? e.memoizedState : null;
                if (a = t.memoizedState,
                e === null)
                    if (a === null)
                        if (t.stateNode === null) {
                            t: {
                                a = t.type,
                                e = t.memoizedProps,
                                u = u.ownerDocument || u;
                                l: switch (a) {
                                case "title":
                                    n = u.getElementsByTagName("title")[0],
                                    (!n || n[Su] || n[fl] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = u.createElement(a),
                                    u.head.insertBefore(n, u.querySelector("head > title"))),
                                    dl(n, a, e),
                                    n[fl] = t,
                                    ul(n),
                                    a = n;
                                    break t;
                                case "link":
                                    var c = j0("link", "href", u).get(a + (e.href || ""));
                                    if (c) {
                                        for (var f = 0; f < c.length; f++)
                                            if (n = c[f],
                                            n.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && n.getAttribute("rel") === (e.rel == null ? null : e.rel) && n.getAttribute("title") === (e.title == null ? null : e.title) && n.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                                                c.splice(f, 1);
                                                break l
                                            }
                                    }
                                    n = u.createElement(a),
                                    dl(n, a, e),
                                    u.head.appendChild(n);
                                    break;
                                case "meta":
                                    if (c = j0("meta", "content", u).get(a + (e.content || ""))) {
                                        for (f = 0; f < c.length; f++)
                                            if (n = c[f],
                                            n.getAttribute("content") === (e.content == null ? null : "" + e.content) && n.getAttribute("name") === (e.name == null ? null : e.name) && n.getAttribute("property") === (e.property == null ? null : e.property) && n.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && n.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                                                c.splice(f, 1);
                                                break l
                                            }
                                    }
                                    n = u.createElement(a),
                                    dl(n, a, e),
                                    u.head.appendChild(n);
                                    break;
                                default:
                                    throw Error(o(468, a))
                                }
                                n[fl] = t,
                                ul(n),
                                a = n
                            }
                            t.stateNode = a
                        } else
                            X0(u, t.type, t.stateNode);
                    else
                        t.stateNode = L0(u, a, t.memoizedProps);
                else
                    n !== a ? (n === null ? e.stateNode !== null && (e = e.stateNode,
                    e.parentNode.removeChild(e)) : n.count--,
                    a === null ? X0(u, t.type, t.stateNode) : L0(u, a, t.memoizedProps)) : a === null && t.stateNode !== null && af(t, t.memoizedProps, e.memoizedProps)
            }
            break;
        case 27:
            Al(l, t),
            Ol(t),
            a & 512 && (Pt || e === null || ce(e, e.return)),
            e !== null && a & 4 && af(t, t.memoizedProps, e.memoizedProps);
            break;
        case 5:
            if (Al(l, t),
            Ol(t),
            a & 512 && (Pt || e === null || ce(e, e.return)),
            t.flags & 32) {
                u = t.stateNode;
                try {
                    qa(u, "")
                } catch (j) {
                    _t(t, t.return, j)
                }
            }
            a & 4 && t.stateNode != null && (u = t.memoizedProps,
            af(t, u, e !== null ? e.memoizedProps : u)),
            a & 1024 && (cf = !0);
            break;
        case 6:
            if (Al(l, t),
            Ol(t),
            a & 4) {
                if (t.stateNode === null)
                    throw Error(o(162));
                a = t.memoizedProps,
                e = t.stateNode;
                try {
                    e.nodeValue = a
                } catch (j) {
                    _t(t, t.return, j)
                }
            }
            break;
        case 3:
            if (vi = null,
            u = $l,
            $l = yi(l.containerInfo),
            Al(l, t),
            $l = u,
            Ol(t),
            a & 4 && e !== null && e.memoizedState.isDehydrated)
                try {
                    mu(l.containerInfo)
                } catch (j) {
                    _t(t, t.return, j)
                }
            cf && (cf = !1,
            Xr(t));
            break;
        case 4:
            a = $l,
            $l = yi(t.stateNode.containerInfo),
            Al(l, t),
            Ol(t),
            $l = a;
            break;
        case 12:
            Al(l, t),
            Ol(t);
            break;
        case 31:
            Al(l, t),
            Ol(t),
            a & 4 && (a = t.updateQueue,
            a !== null && (t.updateQueue = null,
            ti(t, a)));
            break;
        case 13:
            Al(l, t),
            Ol(t),
            t.child.flags & 8192 && t.memoizedState !== null != (e !== null && e.memoizedState !== null) && (ei = x()),
            a & 4 && (a = t.updateQueue,
            a !== null && (t.updateQueue = null,
            ti(t, a)));
            break;
        case 22:
            u = t.memoizedState !== null;
            var r = e !== null && e.memoizedState !== null
              , b = _e
              , _ = Pt;
            if (_e = b || u,
            Pt = _ || r,
            Al(l, t),
            Pt = _,
            _e = b,
            Ol(t),
            a & 8192)
                t: for (l = t.stateNode,
                l._visibility = u ? l._visibility & -2 : l._visibility | 1,
                u && (e === null || r || _e || Pt || Aa(t)),
                e = null,
                l = t; ; ) {
                    if (l.tag === 5 || l.tag === 26) {
                        if (e === null) {
                            r = e = l;
                            try {
                                if (n = r.stateNode,
                                u)
                                    c = n.style,
                                    typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                                else {
                                    f = r.stateNode;
                                    var M = r.memoizedProps.style
                                      , T = M != null && M.hasOwnProperty("display") ? M.display : null;
                                    f.style.display = T == null || typeof T == "boolean" ? "" : ("" + T).trim()
                                }
                            } catch (j) {
                                _t(r, r.return, j)
                            }
                        }
                    } else if (l.tag === 6) {
                        if (e === null) {
                            r = l;
                            try {
                                r.stateNode.nodeValue = u ? "" : r.memoizedProps
                            } catch (j) {
                                _t(r, r.return, j)
                            }
                        }
                    } else if (l.tag === 18) {
                        if (e === null) {
                            r = l;
                            try {
                                var E = r.stateNode;
                                u ? D0(E, !0) : D0(r.stateNode, !1)
                            } catch (j) {
                                _t(r, r.return, j)
                            }
                        }
                    } else if ((l.tag !== 22 && l.tag !== 23 || l.memoizedState === null || l === t) && l.child !== null) {
                        l.child.return = l,
                        l = l.child;
                        continue
                    }
                    if (l === t)
                        break t;
                    for (; l.sibling === null; ) {
                        if (l.return === null || l.return === t)
                            break t;
                        e === l && (e = null),
                        l = l.return
                    }
                    e === l && (e = null),
                    l.sibling.return = l.return,
                    l = l.sibling
                }
            a & 4 && (a = t.updateQueue,
            a !== null && (e = a.retryQueue,
            e !== null && (a.retryQueue = null,
            ti(t, e))));
            break;
        case 19:
            Al(l, t),
            Ol(t),
            a & 4 && (a = t.updateQueue,
            a !== null && (t.updateQueue = null,
            ti(t, a)));
            break;
        case 30:
            break;
        case 21:
            break;
        default:
            Al(l, t),
            Ol(t)
        }
    }
    function Ol(t) {
        var l = t.flags;
        if (l & 2) {
            try {
                for (var e, a = t.return; a !== null; ) {
                    if (Cr(a)) {
                        e = a;
                        break
                    }
                    a = a.return
                }
                if (e == null)
                    throw Error(o(160));
                switch (e.tag) {
                case 27:
                    var u = e.stateNode
                      , n = uf(t);
                    Pn(t, n, u);
                    break;
                case 5:
                    var c = e.stateNode;
                    e.flags & 32 && (qa(c, ""),
                    e.flags &= -33);
                    var f = uf(t);
                    Pn(t, f, c);
                    break;
                case 3:
                case 4:
                    var r = e.stateNode.containerInfo
                      , b = uf(t);
                    nf(t, b, r);
                    break;
                default:
                    throw Error(o(161))
                }
            } catch (_) {
                _t(t, t.return, _)
            }
            t.flags &= -3
        }
        l & 4096 && (t.flags &= -4097)
    }
    function Xr(t) {
        if (t.subtreeFlags & 1024)
            for (t = t.child; t !== null; ) {
                var l = t;
                Xr(l),
                l.tag === 5 && l.flags & 1024 && l.stateNode.reset(),
                t = t.sibling
            }
    }
    function Me(t, l) {
        if (l.subtreeFlags & 8772)
            for (l = l.child; l !== null; )
                Br(t, l.alternate, l),
                l = l.sibling
    }
    function Aa(t) {
        for (t = t.child; t !== null; ) {
            var l = t;
            switch (l.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
                Ke(4, l, l.return),
                Aa(l);
                break;
            case 1:
                ce(l, l.return);
                var e = l.stateNode;
                typeof e.componentWillUnmount == "function" && Dr(l, l.return, e),
                Aa(l);
                break;
            case 27:
                tn(l.stateNode);
            case 26:
            case 5:
                ce(l, l.return),
                Aa(l);
                break;
            case 22:
                l.memoizedState === null && Aa(l);
                break;
            case 30:
                Aa(l);
                break;
            default:
                Aa(l)
            }
            t = t.sibling
        }
    }
    function Re(t, l, e) {
        for (e = e && (l.subtreeFlags & 8772) !== 0,
        l = l.child; l !== null; ) {
            var a = l.alternate
              , u = t
              , n = l
              , c = n.flags;
            switch (n.tag) {
            case 0:
            case 11:
            case 15:
                Re(u, n, e),
                xu(4, n);
                break;
            case 1:
                if (Re(u, n, e),
                a = n,
                u = a.stateNode,
                typeof u.componentDidMount == "function")
                    try {
                        u.componentDidMount()
                    } catch (b) {
                        _t(a, a.return, b)
                    }
                if (a = n,
                u = a.updateQueue,
                u !== null) {
                    var f = a.stateNode;
                    try {
                        var r = u.shared.hiddenCallbacks;
                        if (r !== null)
                            for (u.shared.hiddenCallbacks = null,
                            u = 0; u < r.length; u++)
                                gs(r[u], f)
                    } catch (b) {
                        _t(a, a.return, b)
                    }
                }
                e && c & 64 && Rr(n),
                Ku(n, n.return);
                break;
            case 27:
                Ur(n);
            case 26:
            case 5:
                Re(u, n, e),
                e && a === null && c & 4 && Nr(n),
                Ku(n, n.return);
                break;
            case 12:
                Re(u, n, e);
                break;
            case 31:
                Re(u, n, e),
                e && c & 4 && Gr(u, n);
                break;
            case 13:
                Re(u, n, e),
                e && c & 4 && Lr(u, n);
                break;
            case 22:
                n.memoizedState === null && Re(u, n, e),
                Ku(n, n.return);
                break;
            case 30:
                break;
            default:
                Re(u, n, e)
            }
            l = l.sibling
        }
    }
    function ff(t, l) {
        var e = null;
        t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool),
        t = null,
        l.memoizedState !== null && l.memoizedState.cachePool !== null && (t = l.memoizedState.cachePool.pool),
        t !== e && (t != null && t.refCount++,
        e != null && Cu(e))
    }
    function of(t, l) {
        t = null,
        l.alternate !== null && (t = l.alternate.memoizedState.cache),
        l = l.memoizedState.cache,
        l !== t && (l.refCount++,
        t != null && Cu(t))
    }
    function Il(t, l, e, a) {
        if (l.subtreeFlags & 10256)
            for (l = l.child; l !== null; )
                Vr(t, l, e, a),
                l = l.sibling
    }
    function Vr(t, l, e, a) {
        var u = l.flags;
        switch (l.tag) {
        case 0:
        case 11:
        case 15:
            Il(t, l, e, a),
            u & 2048 && xu(9, l);
            break;
        case 1:
            Il(t, l, e, a);
            break;
        case 3:
            Il(t, l, e, a),
            u & 2048 && (t = null,
            l.alternate !== null && (t = l.alternate.memoizedState.cache),
            l = l.memoizedState.cache,
            l !== t && (l.refCount++,
            t != null && Cu(t)));
            break;
        case 12:
            if (u & 2048) {
                Il(t, l, e, a),
                t = l.stateNode;
                try {
                    var n = l.memoizedProps
                      , c = n.id
                      , f = n.onPostCommit;
                    typeof f == "function" && f(c, l.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0)
                } catch (r) {
                    _t(l, l.return, r)
                }
            } else
                Il(t, l, e, a);
            break;
        case 31:
            Il(t, l, e, a);
            break;
        case 13:
            Il(t, l, e, a);
            break;
        case 23:
            break;
        case 22:
            n = l.stateNode,
            c = l.alternate,
            l.memoizedState !== null ? n._visibility & 2 ? Il(t, l, e, a) : Ju(t, l) : n._visibility & 2 ? Il(t, l, e, a) : (n._visibility |= 2,
            eu(t, l, e, a, (l.subtreeFlags & 10256) !== 0 || !1)),
            u & 2048 && ff(c, l);
            break;
        case 24:
            Il(t, l, e, a),
            u & 2048 && of(l.alternate, l);
            break;
        default:
            Il(t, l, e, a)
        }
    }
    function eu(t, l, e, a, u) {
        for (u = u && ((l.subtreeFlags & 10256) !== 0 || !1),
        l = l.child; l !== null; ) {
            var n = t
              , c = l
              , f = e
              , r = a
              , b = c.flags;
            switch (c.tag) {
            case 0:
            case 11:
            case 15:
                eu(n, c, f, r, u),
                xu(8, c);
                break;
            case 23:
                break;
            case 22:
                var _ = c.stateNode;
                c.memoizedState !== null ? _._visibility & 2 ? eu(n, c, f, r, u) : Ju(n, c) : (_._visibility |= 2,
                eu(n, c, f, r, u)),
                u && b & 2048 && ff(c.alternate, c);
                break;
            case 24:
                eu(n, c, f, r, u),
                u && b & 2048 && of(c.alternate, c);
                break;
            default:
                eu(n, c, f, r, u)
            }
            l = l.sibling
        }
    }
    function Ju(t, l) {
        if (l.subtreeFlags & 10256)
            for (l = l.child; l !== null; ) {
                var e = t
                  , a = l
                  , u = a.flags;
                switch (a.tag) {
                case 22:
                    Ju(e, a),
                    u & 2048 && ff(a.alternate, a);
                    break;
                case 24:
                    Ju(e, a),
                    u & 2048 && of(a.alternate, a);
                    break;
                default:
                    Ju(e, a)
                }
                l = l.sibling
            }
    }
    var wu = 8192;
    function au(t, l, e) {
        if (t.subtreeFlags & wu)
            for (t = t.child; t !== null; )
                Qr(t, l, e),
                t = t.sibling
    }
    function Qr(t, l, e) {
        switch (t.tag) {
        case 26:
            au(t, l, e),
            t.flags & wu && t.memoizedState !== null && My(e, $l, t.memoizedState, t.memoizedProps);
            break;
        case 5:
            au(t, l, e);
            break;
        case 3:
        case 4:
            var a = $l;
            $l = yi(t.stateNode.containerInfo),
            au(t, l, e),
            $l = a;
            break;
        case 22:
            t.memoizedState === null && (a = t.alternate,
            a !== null && a.memoizedState !== null ? (a = wu,
            wu = 16777216,
            au(t, l, e),
            wu = a) : au(t, l, e));
            break;
        default:
            au(t, l, e)
        }
    }
    function Zr(t) {
        var l = t.alternate;
        if (l !== null && (t = l.child,
        t !== null)) {
            l.child = null;
            do
                l = t.sibling,
                t.sibling = null,
                t = l;
            while (t !== null)
        }
    }
    function ku(t) {
        var l = t.deletions;
        if ((t.flags & 16) !== 0) {
            if (l !== null)
                for (var e = 0; e < l.length; e++) {
                    var a = l[e];
                    nl = a,
                    Kr(a, t)
                }
            Zr(t)
        }
        if (t.subtreeFlags & 10256)
            for (t = t.child; t !== null; )
                xr(t),
                t = t.sibling
    }
    function xr(t) {
        switch (t.tag) {
        case 0:
        case 11:
        case 15:
            ku(t),
            t.flags & 2048 && Ke(9, t, t.return);
            break;
        case 3:
            ku(t);
            break;
        case 12:
            ku(t);
            break;
        case 22:
            var l = t.stateNode;
            t.memoizedState !== null && l._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (l._visibility &= -3,
            li(t)) : ku(t);
            break;
        default:
            ku(t)
        }
    }
    function li(t) {
        var l = t.deletions;
        if ((t.flags & 16) !== 0) {
            if (l !== null)
                for (var e = 0; e < l.length; e++) {
                    var a = l[e];
                    nl = a,
                    Kr(a, t)
                }
            Zr(t)
        }
        for (t = t.child; t !== null; ) {
            switch (l = t,
            l.tag) {
            case 0:
            case 11:
            case 15:
                Ke(8, l, l.return),
                li(l);
                break;
            case 22:
                e = l.stateNode,
                e._visibility & 2 && (e._visibility &= -3,
                li(l));
                break;
            default:
                li(l)
            }
            t = t.sibling
        }
    }
    function Kr(t, l) {
        for (; nl !== null; ) {
            var e = nl;
            switch (e.tag) {
            case 0:
            case 11:
            case 15:
                Ke(8, e, l);
                break;
            case 23:
            case 22:
                if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
                    var a = e.memoizedState.cachePool.pool;
                    a != null && a.refCount++
                }
                break;
            case 24:
                Cu(e.memoizedState.cache)
            }
            if (a = e.child,
            a !== null)
                a.return = e,
                nl = a;
            else
                t: for (e = t; nl !== null; ) {
                    a = nl;
                    var u = a.sibling
                      , n = a.return;
                    if (Yr(a),
                    a === e) {
                        nl = null;
                        break t
                    }
                    if (u !== null) {
                        u.return = n,
                        nl = u;
                        break t
                    }
                    nl = n
                }
        }
    }
    var Qm = {
        getCacheForType: function(t) {
            var l = sl(Ft)
              , e = l.data.get(t);
            return e === void 0 && (e = t(),
            l.data.set(t, e)),
            e
        },
        cacheSignal: function() {
            return sl(Ft).controller.signal
        }
    }
      , Zm = typeof WeakMap == "function" ? WeakMap : Map
      , Tt = 0
      , Dt = null
      , ot = null
      , dt = 0
      , Ot = 0
      , Bl = null
      , Je = !1
      , uu = !1
      , sf = !1
      , De = 0
      , Zt = 0
      , we = 0
      , Oa = 0
      , rf = 0
      , Yl = 0
      , nu = 0
      , Wu = null
      , _l = null
      , df = !1
      , ei = 0
      , Jr = 0
      , ai = 1 / 0
      , ui = null
      , ke = null
      , ll = 0
      , We = null
      , iu = null
      , Ne = 0
      , mf = 0
      , yf = null
      , wr = null
      , Fu = 0
      , hf = null;
    function ql() {
        return (Tt & 2) !== 0 && dt !== 0 ? dt & -dt : O.T !== null ? pf() : fo()
    }
    function kr() {
        if (Yl === 0)
            if ((dt & 536870912) === 0 || yt) {
                var t = Sl;
                Sl <<= 1,
                (Sl & 3932160) === 0 && (Sl = 262144),
                Yl = t
            } else
                Yl = 536870912;
        return t = Ul.current,
        t !== null && (t.flags |= 32),
        Yl
    }
    function zl(t, l, e) {
        (t === Dt && (Ot === 2 || Ot === 9) || t.cancelPendingCommit !== null) && (cu(t, 0),
        Fe(t, dt, Yl, !1)),
        gu(t, e),
        ((Tt & 2) === 0 || t !== Dt) && (t === Dt && ((Tt & 2) === 0 && (Oa |= e),
        Zt === 4 && Fe(t, dt, Yl, !1)),
        fe(t))
    }
    function Wr(t, l, e) {
        if ((Tt & 6) !== 0)
            throw Error(o(327));
        var a = !e && (l & 127) === 0 && (l & t.expiredLanes) === 0 || me(t, l)
          , u = a ? Jm(t, l) : gf(t, l, !0)
          , n = a;
        do {
            if (u === 0) {
                uu && !a && Fe(t, l, 0, !1);
                break
            } else {
                if (e = t.current.alternate,
                n && !xm(e)) {
                    u = gf(t, l, !1),
                    n = !1;
                    continue
                }
                if (u === 2) {
                    if (n = l,
                    t.errorRecoveryDisabledLanes & n)
                        var c = 0;
                    else
                        c = t.pendingLanes & -536870913,
                        c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
                    if (c !== 0) {
                        l = c;
                        t: {
                            var f = t;
                            u = Wu;
                            var r = f.current.memoizedState.isDehydrated;
                            if (r && (cu(f, c).flags |= 256),
                            c = gf(f, c, !1),
                            c !== 2) {
                                if (sf && !r) {
                                    f.errorRecoveryDisabledLanes |= n,
                                    Oa |= n,
                                    u = 4;
                                    break t
                                }
                                n = _l,
                                _l = u,
                                n !== null && (_l === null ? _l = n : _l.push.apply(_l, n))
                            }
                            u = c
                        }
                        if (n = !1,
                        u !== 2)
                            continue
                    }
                }
                if (u === 1) {
                    cu(t, 0),
                    Fe(t, l, 0, !0);
                    break
                }
                t: {
                    switch (a = t,
                    n = u,
                    n) {
                    case 0:
                    case 1:
                        throw Error(o(345));
                    case 4:
                        if ((l & 4194048) !== l)
                            break;
                    case 6:
                        Fe(a, l, Yl, !Je);
                        break t;
                    case 2:
                        _l = null;
                        break;
                    case 3:
                    case 5:
                        break;
                    default:
                        throw Error(o(329))
                    }
                    if ((l & 62914560) === l && (u = ei + 300 - x(),
                    10 < u)) {
                        if (Fe(a, l, Yl, !Je),
                        ue(a, 0, !0) !== 0)
                            break t;
                        Ne = l,
                        a.timeoutHandle = z0(Fr.bind(null, a, e, _l, ui, df, l, Yl, Oa, nu, Je, n, "Throttled", -0, 0), u);
                        break t
                    }
                    Fr(a, e, _l, ui, df, l, Yl, Oa, nu, Je, n, null, -0, 0)
                }
            }
            break
        } while (!0);
        fe(t)
    }
    function Fr(t, l, e, a, u, n, c, f, r, b, _, M, T, E) {
        if (t.timeoutHandle = -1,
        M = l.subtreeFlags,
        M & 8192 || (M & 16785408) === 16785408) {
            M = {
                stylesheets: null,
                count: 0,
                imgCount: 0,
                imgBytes: 0,
                suspenseyImages: [],
                waitingForImages: !0,
                waitingForViewTransition: !1,
                unsuspend: he
            },
            Qr(l, n, M);
            var j = (n & 62914560) === n ? ei - x() : (n & 4194048) === n ? Jr - x() : 0;
            if (j = Ry(M, j),
            j !== null) {
                Ne = n,
                t.cancelPendingCommit = j(u0.bind(null, t, l, n, e, a, u, c, f, r, _, M, null, T, E)),
                Fe(t, n, c, !b);
                return
            }
        }
        u0(t, l, n, e, a, u, c, f, r)
    }
    function xm(t) {
        for (var l = t; ; ) {
            var e = l.tag;
            if ((e === 0 || e === 11 || e === 15) && l.flags & 16384 && (e = l.updateQueue,
            e !== null && (e = e.stores,
            e !== null)))
                for (var a = 0; a < e.length; a++) {
                    var u = e[a]
                      , n = u.getSnapshot;
                    u = u.value;
                    try {
                        if (!Nl(n(), u))
                            return !1
                    } catch {
                        return !1
                    }
                }
            if (e = l.child,
            l.subtreeFlags & 16384 && e !== null)
                e.return = l,
                l = e;
            else {
                if (l === t)
                    break;
                for (; l.sibling === null; ) {
                    if (l.return === null || l.return === t)
                        return !0;
                    l = l.return
                }
                l.sibling.return = l.return,
                l = l.sibling
            }
        }
        return !0
    }
    function Fe(t, l, e, a) {
        l &= ~rf,
        l &= ~Oa,
        t.suspendedLanes |= l,
        t.pingedLanes &= ~l,
        a && (t.warmLanes |= l),
        a = t.expirationTimes;
        for (var u = l; 0 < u; ) {
            var n = 31 - vl(u)
              , c = 1 << n;
            a[n] = -1,
            u &= ~c
        }
        e !== 0 && no(t, e, l)
    }
    function ni() {
        return (Tt & 6) === 0 ? ($u(0),
        !1) : !0
    }
    function vf() {
        if (ot !== null) {
            if (Ot === 0)
                var t = ot.return;
            else
                t = ot,
                be = ha = null,
                Cc(t),
                $a = null,
                Hu = 0,
                t = ot;
            for (; t !== null; )
                Mr(t.alternate, t),
                t = t.return;
            ot = null
        }
    }
    function cu(t, l) {
        var e = t.timeoutHandle;
        e !== -1 && (t.timeoutHandle = -1,
        sy(e)),
        e = t.cancelPendingCommit,
        e !== null && (t.cancelPendingCommit = null,
        e()),
        Ne = 0,
        vf(),
        Dt = t,
        ot = e = ge(t.current, null),
        dt = l,
        Ot = 0,
        Bl = null,
        Je = !1,
        uu = me(t, l),
        sf = !1,
        nu = Yl = rf = Oa = we = Zt = 0,
        _l = Wu = null,
        df = !1,
        (l & 8) !== 0 && (l |= l & 32);
        var a = t.entangledLanes;
        if (a !== 0)
            for (t = t.entanglements,
            a &= l; 0 < a; ) {
                var u = 31 - vl(a)
                  , n = 1 << u;
                l |= t[u],
                a &= ~n
            }
        return De = l,
        zn(),
        e
    }
    function $r(t, l) {
        at = null,
        O.H = Vu,
        l === Fa || l === Bn ? (l = ms(),
        Ot = 3) : l === bc ? (l = ms(),
        Ot = 4) : Ot = l === wc ? 8 : l !== null && typeof l == "object" && typeof l.then == "function" ? 6 : 1,
        Bl = l,
        ot === null && (Zt = 1,
        kn(t, Ql(l, t.current)))
    }
    function Ir() {
        var t = Ul.current;
        return t === null ? !0 : (dt & 4194048) === dt ? Jl === null : (dt & 62914560) === dt || (dt & 536870912) !== 0 ? t === Jl : !1
    }
    function Pr() {
        var t = O.H;
        return O.H = Vu,
        t === null ? Vu : t
    }
    function t0() {
        var t = O.A;
        return O.A = Qm,
        t
    }
    function ii() {
        Zt = 4,
        Je || (dt & 4194048) !== dt && Ul.current !== null || (uu = !0),
        (we & 134217727) === 0 && (Oa & 134217727) === 0 || Dt === null || Fe(Dt, dt, Yl, !1)
    }
    function gf(t, l, e) {
        var a = Tt;
        Tt |= 2;
        var u = Pr()
          , n = t0();
        (Dt !== t || dt !== l) && (ui = null,
        cu(t, l)),
        l = !1;
        var c = Zt;
        t: do
            try {
                if (Ot !== 0 && ot !== null) {
                    var f = ot
                      , r = Bl;
                    switch (Ot) {
                    case 8:
                        vf(),
                        c = 6;
                        break t;
                    case 3:
                    case 2:
                    case 9:
                    case 6:
                        Ul.current === null && (l = !0);
                        var b = Ot;
                        if (Ot = 0,
                        Bl = null,
                        fu(t, f, r, b),
                        e && uu) {
                            c = 0;
                            break t
                        }
                        break;
                    default:
                        b = Ot,
                        Ot = 0,
                        Bl = null,
                        fu(t, f, r, b)
                    }
                }
                Km(),
                c = Zt;
                break
            } catch (_) {
                $r(t, _)
            }
        while (!0);
        return l && t.shellSuspendCounter++,
        be = ha = null,
        Tt = a,
        O.H = u,
        O.A = n,
        ot === null && (Dt = null,
        dt = 0,
        zn()),
        c
    }
    function Km() {
        for (; ot !== null; )
            l0(ot)
    }
    function Jm(t, l) {
        var e = Tt;
        Tt |= 2;
        var a = Pr()
          , u = t0();
        Dt !== t || dt !== l ? (ui = null,
        ai = x() + 500,
        cu(t, l)) : uu = me(t, l);
        t: do
            try {
                if (Ot !== 0 && ot !== null) {
                    l = ot;
                    var n = Bl;
                    l: switch (Ot) {
                    case 1:
                        Ot = 0,
                        Bl = null,
                        fu(t, l, n, 1);
                        break;
                    case 2:
                    case 9:
                        if (rs(n)) {
                            Ot = 0,
                            Bl = null,
                            e0(l);
                            break
                        }
                        l = function() {
                            Ot !== 2 && Ot !== 9 || Dt !== t || (Ot = 7),
                            fe(t)
                        }
                        ,
                        n.then(l, l);
                        break t;
                    case 3:
                        Ot = 7;
                        break t;
                    case 4:
                        Ot = 5;
                        break t;
                    case 7:
                        rs(n) ? (Ot = 0,
                        Bl = null,
                        e0(l)) : (Ot = 0,
                        Bl = null,
                        fu(t, l, n, 7));
                        break;
                    case 5:
                        var c = null;
                        switch (ot.tag) {
                        case 26:
                            c = ot.memoizedState;
                        case 5:
                        case 27:
                            var f = ot;
                            if (c ? V0(c) : f.stateNode.complete) {
                                Ot = 0,
                                Bl = null;
                                var r = f.sibling;
                                if (r !== null)
                                    ot = r;
                                else {
                                    var b = f.return;
                                    b !== null ? (ot = b,
                                    ci(b)) : ot = null
                                }
                                break l
                            }
                        }
                        Ot = 0,
                        Bl = null,
                        fu(t, l, n, 5);
                        break;
                    case 6:
                        Ot = 0,
                        Bl = null,
                        fu(t, l, n, 6);
                        break;
                    case 8:
                        vf(),
                        Zt = 6;
                        break t;
                    default:
                        throw Error(o(462))
                    }
                }
                wm();
                break
            } catch (_) {
                $r(t, _)
            }
        while (!0);
        return be = ha = null,
        O.H = a,
        O.A = u,
        Tt = e,
        ot !== null ? 0 : (Dt = null,
        dt = 0,
        zn(),
        Zt)
    }
    function wm() {
        for (; ot !== null && !Ra(); )
            l0(ot)
    }
    function l0(t) {
        var l = _r(t.alternate, t, De);
        t.memoizedProps = t.pendingProps,
        l === null ? ci(t) : ot = l
    }
    function e0(t) {
        var l = t
          , e = l.alternate;
        switch (l.tag) {
        case 15:
        case 0:
            l = br(e, l, l.pendingProps, l.type, void 0, dt);
            break;
        case 11:
            l = br(e, l, l.pendingProps, l.type.render, l.ref, dt);
            break;
        case 5:
            Cc(l);
        default:
            Mr(e, l),
            l = ot = ts(l, De),
            l = _r(e, l, De)
        }
        t.memoizedProps = t.pendingProps,
        l === null ? ci(t) : ot = l
    }
    function fu(t, l, e, a) {
        be = ha = null,
        Cc(l),
        $a = null,
        Hu = 0;
        var u = l.return;
        try {
            if (Ym(t, u, l, e, dt)) {
                Zt = 1,
                kn(t, Ql(e, t.current)),
                ot = null;
                return
            }
        } catch (n) {
            if (u !== null)
                throw ot = u,
                n;
            Zt = 1,
            kn(t, Ql(e, t.current)),
            ot = null;
            return
        }
        l.flags & 32768 ? (yt || a === 1 ? t = !0 : uu || (dt & 536870912) !== 0 ? t = !1 : (Je = t = !0,
        (a === 2 || a === 9 || a === 3 || a === 6) && (a = Ul.current,
        a !== null && a.tag === 13 && (a.flags |= 16384))),
        a0(l, t)) : ci(l)
    }
    function ci(t) {
        var l = t;
        do {
            if ((l.flags & 32768) !== 0) {
                a0(l, Je);
                return
            }
            t = l.return;
            var e = Lm(l.alternate, l, De);
            if (e !== null) {
                ot = e;
                return
            }
            if (l = l.sibling,
            l !== null) {
                ot = l;
                return
            }
            ot = l = t
        } while (l !== null);
        Zt === 0 && (Zt = 5)
    }
    function a0(t, l) {
        do {
            var e = jm(t.alternate, t);
            if (e !== null) {
                e.flags &= 32767,
                ot = e;
                return
            }
            if (e = t.return,
            e !== null && (e.flags |= 32768,
            e.subtreeFlags = 0,
            e.deletions = null),
            !l && (t = t.sibling,
            t !== null)) {
                ot = t;
                return
            }
            ot = t = e
        } while (t !== null);
        Zt = 6,
        ot = null
    }
    function u0(t, l, e, a, u, n, c, f, r) {
        t.cancelPendingCommit = null;
        do
            fi();
        while (ll !== 0);
        if ((Tt & 6) !== 0)
            throw Error(o(327));
        if (l !== null) {
            if (l === t.current)
                throw Error(o(177));
            if (n = l.lanes | l.childLanes,
            n |= uc,
            zd(t, e, n, c, f, r),
            t === Dt && (ot = Dt = null,
            dt = 0),
            iu = l,
            We = t,
            Ne = e,
            mf = n,
            yf = u,
            wr = a,
            (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0 ? (t.callbackNode = null,
            t.callbackPriority = 0,
            $m(Gl, function() {
                return o0(),
                null
            })) : (t.callbackNode = null,
            t.callbackPriority = 0),
            a = (l.flags & 13878) !== 0,
            (l.subtreeFlags & 13878) !== 0 || a) {
                a = O.T,
                O.T = null,
                u = H.p,
                H.p = 2,
                c = Tt,
                Tt |= 4;
                try {
                    Xm(t, l, e)
                } finally {
                    Tt = c,
                    H.p = u,
                    O.T = a
                }
            }
            ll = 1,
            n0(),
            i0(),
            c0()
        }
    }
    function n0() {
        if (ll === 1) {
            ll = 0;
            var t = We
              , l = iu
              , e = (l.flags & 13878) !== 0;
            if ((l.subtreeFlags & 13878) !== 0 || e) {
                e = O.T,
                O.T = null;
                var a = H.p;
                H.p = 2;
                var u = Tt;
                Tt |= 4;
                try {
                    jr(l, t);
                    var n = Df
                      , c = Ko(t.containerInfo)
                      , f = n.focusedElem
                      , r = n.selectionRange;
                    if (c !== f && f && f.ownerDocument && xo(f.ownerDocument.documentElement, f)) {
                        if (r !== null && Pi(f)) {
                            var b = r.start
                              , _ = r.end;
                            if (_ === void 0 && (_ = b),
                            "selectionStart"in f)
                                f.selectionStart = b,
                                f.selectionEnd = Math.min(_, f.value.length);
                            else {
                                var M = f.ownerDocument || document
                                  , T = M && M.defaultView || window;
                                if (T.getSelection) {
                                    var E = T.getSelection()
                                      , j = f.textContent.length
                                      , w = Math.min(r.start, j)
                                      , Rt = r.end === void 0 ? w : Math.min(r.end, j);
                                    !E.extend && w > Rt && (c = Rt,
                                    Rt = w,
                                    w = c);
                                    var h = Zo(f, w)
                                      , d = Zo(f, Rt);
                                    if (h && d && (E.rangeCount !== 1 || E.anchorNode !== h.node || E.anchorOffset !== h.offset || E.focusNode !== d.node || E.focusOffset !== d.offset)) {
                                        var g = M.createRange();
                                        g.setStart(h.node, h.offset),
                                        E.removeAllRanges(),
                                        w > Rt ? (E.addRange(g),
                                        E.extend(d.node, d.offset)) : (g.setEnd(d.node, d.offset),
                                        E.addRange(g))
                                    }
                                }
                            }
                        }
                        for (M = [],
                        E = f; E = E.parentNode; )
                            E.nodeType === 1 && M.push({
                                element: E,
                                left: E.scrollLeft,
                                top: E.scrollTop
                            });
                        for (typeof f.focus == "function" && f.focus(),
                        f = 0; f < M.length; f++) {
                            var z = M[f];
                            z.element.scrollLeft = z.left,
                            z.element.scrollTop = z.top
                        }
                    }
                    Ti = !!Rf,
                    Df = Rf = null
                } finally {
                    Tt = u,
                    H.p = a,
                    O.T = e
                }
            }
            t.current = l,
            ll = 2
        }
    }
    function i0() {
        if (ll === 2) {
            ll = 0;
            var t = We
              , l = iu
              , e = (l.flags & 8772) !== 0;
            if ((l.subtreeFlags & 8772) !== 0 || e) {
                e = O.T,
                O.T = null;
                var a = H.p;
                H.p = 2;
                var u = Tt;
                Tt |= 4;
                try {
                    Br(t, l.alternate, l)
                } finally {
                    Tt = u,
                    H.p = a,
                    O.T = e
                }
            }
            ll = 3
        }
    }
    function c0() {
        if (ll === 4 || ll === 3) {
            ll = 0,
            mn();
            var t = We
              , l = iu
              , e = Ne
              , a = wr;
            (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0 ? ll = 5 : (ll = 0,
            iu = We = null,
            f0(t, t.pendingLanes));
            var u = t.pendingLanes;
            if (u === 0 && (ke = null),
            Bi(e),
            l = l.stateNode,
            ft && typeof ft.onCommitFiberRoot == "function")
                try {
                    ft.onCommitFiberRoot(ae, l, void 0, (l.current.flags & 128) === 128)
                } catch {}
            if (a !== null) {
                l = O.T,
                u = H.p,
                H.p = 2,
                O.T = null;
                try {
                    for (var n = t.onRecoverableError, c = 0; c < a.length; c++) {
                        var f = a[c];
                        n(f.value, {
                            componentStack: f.stack
                        })
                    }
                } finally {
                    O.T = l,
                    H.p = u
                }
            }
            (Ne & 3) !== 0 && fi(),
            fe(t),
            u = t.pendingLanes,
            (e & 261930) !== 0 && (u & 42) !== 0 ? t === hf ? Fu++ : (Fu = 0,
            hf = t) : Fu = 0,
            $u(0)
        }
    }
    function f0(t, l) {
        (t.pooledCacheLanes &= l) === 0 && (l = t.pooledCache,
        l != null && (t.pooledCache = null,
        Cu(l)))
    }
    function fi() {
        return n0(),
        i0(),
        c0(),
        o0()
    }
    function o0() {
        if (ll !== 5)
            return !1;
        var t = We
          , l = mf;
        mf = 0;
        var e = Bi(Ne)
          , a = O.T
          , u = H.p;
        try {
            H.p = 32 > e ? 32 : e,
            O.T = null,
            e = yf,
            yf = null;
            var n = We
              , c = Ne;
            if (ll = 0,
            iu = We = null,
            Ne = 0,
            (Tt & 6) !== 0)
                throw Error(o(331));
            var f = Tt;
            if (Tt |= 4,
            xr(n.current),
            Vr(n, n.current, c, e),
            Tt = f,
            $u(0, !1),
            ft && typeof ft.onPostCommitFiberRoot == "function")
                try {
                    ft.onPostCommitFiberRoot(ae, n)
                } catch {}
            return !0
        } finally {
            H.p = u,
            O.T = a,
            f0(t, l)
        }
    }
    function s0(t, l, e) {
        l = Ql(e, l),
        l = Jc(t.stateNode, l, 2),
        t = Qe(t, l, 2),
        t !== null && (gu(t, 2),
        fe(t))
    }
    function _t(t, l, e) {
        if (t.tag === 3)
            s0(t, t, e);
        else
            for (; l !== null; ) {
                if (l.tag === 3) {
                    s0(l, t, e);
                    break
                } else if (l.tag === 1) {
                    var a = l.stateNode;
                    if (typeof l.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (ke === null || !ke.has(a))) {
                        t = Ql(e, t),
                        e = rr(2),
                        a = Qe(l, e, 2),
                        a !== null && (dr(e, a, l, t),
                        gu(a, 2),
                        fe(a));
                        break
                    }
                }
                l = l.return
            }
    }
    function Sf(t, l, e) {
        var a = t.pingCache;
        if (a === null) {
            a = t.pingCache = new Zm;
            var u = new Set;
            a.set(l, u)
        } else
            u = a.get(l),
            u === void 0 && (u = new Set,
            a.set(l, u));
        u.has(e) || (sf = !0,
        u.add(e),
        t = km.bind(null, t, l, e),
        l.then(t, t))
    }
    function km(t, l, e) {
        var a = t.pingCache;
        a !== null && a.delete(l),
        t.pingedLanes |= t.suspendedLanes & e,
        t.warmLanes &= ~e,
        Dt === t && (dt & e) === e && (Zt === 4 || Zt === 3 && (dt & 62914560) === dt && 300 > x() - ei ? (Tt & 2) === 0 && cu(t, 0) : rf |= e,
        nu === dt && (nu = 0)),
        fe(t)
    }
    function r0(t, l) {
        l === 0 && (l = yn()),
        t = da(t, l),
        t !== null && (gu(t, l),
        fe(t))
    }
    function Wm(t) {
        var l = t.memoizedState
          , e = 0;
        l !== null && (e = l.retryLane),
        r0(t, e)
    }
    function Fm(t, l) {
        var e = 0;
        switch (t.tag) {
        case 31:
        case 13:
            var a = t.stateNode
              , u = t.memoizedState;
            u !== null && (e = u.retryLane);
            break;
        case 19:
            a = t.stateNode;
            break;
        case 22:
            a = t.stateNode._retryCache;
            break;
        default:
            throw Error(o(314))
        }
        a !== null && a.delete(l),
        r0(t, e)
    }
    function $m(t, l) {
        return ee(t, l)
    }
    var oi = null
      , ou = null
      , bf = !1
      , si = !1
      , Tf = !1
      , $e = 0;
    function fe(t) {
        t !== ou && t.next === null && (ou === null ? oi = ou = t : ou = ou.next = t),
        si = !0,
        bf || (bf = !0,
        Pm())
    }
    function $u(t, l) {
        if (!Tf && si) {
            Tf = !0;
            do
                for (var e = !1, a = oi; a !== null; ) {
                    if (t !== 0) {
                        var u = a.pendingLanes;
                        if (u === 0)
                            var n = 0;
                        else {
                            var c = a.suspendedLanes
                              , f = a.pingedLanes;
                            n = (1 << 31 - vl(42 | t) + 1) - 1,
                            n &= u & ~(c & ~f),
                            n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0
                        }
                        n !== 0 && (e = !0,
                        h0(a, n))
                    } else
                        n = dt,
                        n = ue(a, a === Dt ? n : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1),
                        (n & 3) === 0 || me(a, n) || (e = !0,
                        h0(a, n));
                    a = a.next
                }
            while (e);
            Tf = !1
        }
    }
    function Im() {
        d0()
    }
    function d0() {
        si = bf = !1;
        var t = 0;
        $e !== 0 && oy() && (t = $e);
        for (var l = x(), e = null, a = oi; a !== null; ) {
            var u = a.next
              , n = m0(a, l);
            n === 0 ? (a.next = null,
            e === null ? oi = u : e.next = u,
            u === null && (ou = e)) : (e = a,
            (t !== 0 || (n & 3) !== 0) && (si = !0)),
            a = u
        }
        ll !== 0 && ll !== 5 || $u(t),
        $e !== 0 && ($e = 0)
    }
    function m0(t, l) {
        for (var e = t.suspendedLanes, a = t.pingedLanes, u = t.expirationTimes, n = t.pendingLanes & -62914561; 0 < n; ) {
            var c = 31 - vl(n)
              , f = 1 << c
              , r = u[c];
            r === -1 ? ((f & e) === 0 || (f & a) !== 0) && (u[c] = Ui(f, l)) : r <= l && (t.expiredLanes |= f),
            n &= ~f
        }
        if (l = Dt,
        e = dt,
        e = ue(t, t === l ? e : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1),
        a = t.callbackNode,
        e === 0 || t === l && (Ot === 2 || Ot === 9) || t.cancelPendingCommit !== null)
            return a !== null && a !== null && hu(a),
            t.callbackNode = null,
            t.callbackPriority = 0;
        if ((e & 3) === 0 || me(t, e)) {
            if (l = e & -e,
            l === t.callbackPriority)
                return l;
            switch (a !== null && hu(a),
            Bi(e)) {
            case 2:
            case 8:
                e = et;
                break;
            case 32:
                e = Gl;
                break;
            case 268435456:
                e = cl;
                break;
            default:
                e = Gl
            }
            return a = y0.bind(null, t),
            e = ee(e, a),
            t.callbackPriority = l,
            t.callbackNode = e,
            l
        }
        return a !== null && a !== null && hu(a),
        t.callbackPriority = 2,
        t.callbackNode = null,
        2
    }
    function y0(t, l) {
        if (ll !== 0 && ll !== 5)
            return t.callbackNode = null,
            t.callbackPriority = 0,
            null;
        var e = t.callbackNode;
        if (fi() && t.callbackNode !== e)
            return null;
        var a = dt;
        return a = ue(t, t === Dt ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1),
        a === 0 ? null : (Wr(t, a, l),
        m0(t, x()),
        t.callbackNode != null && t.callbackNode === e ? y0.bind(null, t) : null)
    }
    function h0(t, l) {
        if (fi())
            return null;
        Wr(t, l, !0)
    }
    function Pm() {
        ry(function() {
            (Tt & 6) !== 0 ? ee(C, Im) : d0()
        })
    }
    function pf() {
        if ($e === 0) {
            var t = ka;
            t === 0 && (t = gl,
            gl <<= 1,
            (gl & 261888) === 0 && (gl = 256)),
            $e = t
        }
        return $e
    }
    function v0(t) {
        return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Sn("" + t)
    }
    function g0(t, l) {
        var e = l.ownerDocument.createElement("input");
        return e.name = l.name,
        e.value = l.value,
        t.id && e.setAttribute("form", t.id),
        l.parentNode.insertBefore(e, l),
        t = new FormData(t),
        e.parentNode.removeChild(e),
        t
    }
    function ty(t, l, e, a, u) {
        if (l === "submit" && e && e.stateNode === u) {
            var n = v0((u[Tl] || null).action)
              , c = a.submitter;
            c && (l = (l = c[Tl] || null) ? v0(l.formAction) : c.getAttribute("formAction"),
            l !== null && (n = l,
            c = null));
            var f = new En("action","action",null,a,u);
            t.push({
                event: f,
                listeners: [{
                    instance: null,
                    listener: function() {
                        if (a.defaultPrevented) {
                            if ($e !== 0) {
                                var r = c ? g0(u, c) : new FormData(u);
                                Xc(e, {
                                    pending: !0,
                                    data: r,
                                    method: u.method,
                                    action: n
                                }, null, r)
                            }
                        } else
                            typeof n == "function" && (f.preventDefault(),
                            r = c ? g0(u, c) : new FormData(u),
                            Xc(e, {
                                pending: !0,
                                data: r,
                                method: u.method,
                                action: n
                            }, n, r))
                    },
                    currentTarget: u
                }]
            })
        }
    }
    for (var Ef = 0; Ef < ac.length; Ef++) {
        var Af = ac[Ef]
          , ly = Af.toLowerCase()
          , ey = Af[0].toUpperCase() + Af.slice(1);
        Fl(ly, "on" + ey)
    }
    Fl(ko, "onAnimationEnd"),
    Fl(Wo, "onAnimationIteration"),
    Fl(Fo, "onAnimationStart"),
    Fl("dblclick", "onDoubleClick"),
    Fl("focusin", "onFocus"),
    Fl("focusout", "onBlur"),
    Fl(Sm, "onTransitionRun"),
    Fl(bm, "onTransitionStart"),
    Fl(Tm, "onTransitionCancel"),
    Fl($o, "onTransitionEnd"),
    Ba("onMouseEnter", ["mouseout", "mouseover"]),
    Ba("onMouseLeave", ["mouseout", "mouseover"]),
    Ba("onPointerEnter", ["pointerout", "pointerover"]),
    Ba("onPointerLeave", ["pointerout", "pointerover"]),
    fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
    fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
    fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var Iu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ")
      , ay = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Iu));
    function S0(t, l) {
        l = (l & 4) !== 0;
        for (var e = 0; e < t.length; e++) {
            var a = t[e]
              , u = a.event;
            a = a.listeners;
            t: {
                var n = void 0;
                if (l)
                    for (var c = a.length - 1; 0 <= c; c--) {
                        var f = a[c]
                          , r = f.instance
                          , b = f.currentTarget;
                        if (f = f.listener,
                        r !== n && u.isPropagationStopped())
                            break t;
                        n = f,
                        u.currentTarget = b;
                        try {
                            n(u)
                        } catch (_) {
                            _n(_)
                        }
                        u.currentTarget = null,
                        n = r
                    }
                else
                    for (c = 0; c < a.length; c++) {
                        if (f = a[c],
                        r = f.instance,
                        b = f.currentTarget,
                        f = f.listener,
                        r !== n && u.isPropagationStopped())
                            break t;
                        n = f,
                        u.currentTarget = b;
                        try {
                            n(u)
                        } catch (_) {
                            _n(_)
                        }
                        u.currentTarget = null,
                        n = r
                    }
            }
        }
    }
    function st(t, l) {
        var e = l[Yi];
        e === void 0 && (e = l[Yi] = new Set);
        var a = t + "__bubble";
        e.has(a) || (b0(l, t, 2, !1),
        e.add(a))
    }
    function Of(t, l, e) {
        var a = 0;
        l && (a |= 4),
        b0(e, t, a, l)
    }
    var ri = "_reactListening" + Math.random().toString(36).slice(2);
    function _f(t) {
        if (!t[ri]) {
            t[ri] = !0,
            ro.forEach(function(e) {
                e !== "selectionchange" && (ay.has(e) || Of(e, !1, t),
                Of(e, !0, t))
            });
            var l = t.nodeType === 9 ? t : t.ownerDocument;
            l === null || l[ri] || (l[ri] = !0,
            Of("selectionchange", !1, l))
        }
    }
    function b0(t, l, e, a) {
        switch (k0(l)) {
        case 2:
            var u = Cy;
            break;
        case 8:
            u = Uy;
            break;
        default:
            u = Xf
        }
        e = u.bind(null, l, e, t),
        u = void 0,
        !xi || l !== "touchstart" && l !== "touchmove" && l !== "wheel" || (u = !0),
        a ? u !== void 0 ? t.addEventListener(l, e, {
            capture: !0,
            passive: u
        }) : t.addEventListener(l, e, !0) : u !== void 0 ? t.addEventListener(l, e, {
            passive: u
        }) : t.addEventListener(l, e, !1)
    }
    function zf(t, l, e, a, u) {
        var n = a;
        if ((l & 1) === 0 && (l & 2) === 0 && a !== null)
            t: for (; ; ) {
                if (a === null)
                    return;
                var c = a.tag;
                if (c === 3 || c === 4) {
                    var f = a.stateNode.containerInfo;
                    if (f === u)
                        break;
                    if (c === 4)
                        for (c = a.return; c !== null; ) {
                            var r = c.tag;
                            if ((r === 3 || r === 4) && c.stateNode.containerInfo === u)
                                return;
                            c = c.return
                        }
                    for (; f !== null; ) {
                        if (c = Ca(f),
                        c === null)
                            return;
                        if (r = c.tag,
                        r === 5 || r === 6 || r === 26 || r === 27) {
                            a = n = c;
                            continue t
                        }
                        f = f.parentNode
                    }
                }
                a = a.return
            }
        Oo(function() {
            var b = n
              , _ = Qi(e)
              , M = [];
            t: {
                var T = Io.get(t);
                if (T !== void 0) {
                    var E = En
                      , j = t;
                    switch (t) {
                    case "keypress":
                        if (Tn(e) === 0)
                            break t;
                    case "keydown":
                    case "keyup":
                        E = Fd;
                        break;
                    case "focusin":
                        j = "focus",
                        E = ki;
                        break;
                    case "focusout":
                        j = "blur",
                        E = ki;
                        break;
                    case "beforeblur":
                    case "afterblur":
                        E = ki;
                        break;
                    case "click":
                        if (e.button === 2)
                            break t;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        E = Mo;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        E = Ld;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        E = Pd;
                        break;
                    case ko:
                    case Wo:
                    case Fo:
                        E = Vd;
                        break;
                    case $o:
                        E = lm;
                        break;
                    case "scroll":
                    case "scrollend":
                        E = qd;
                        break;
                    case "wheel":
                        E = am;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        E = Zd;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup":
                        E = Do;
                        break;
                    case "toggle":
                    case "beforetoggle":
                        E = nm
                    }
                    var w = (l & 4) !== 0
                      , Rt = !w && (t === "scroll" || t === "scrollend")
                      , h = w ? T !== null ? T + "Capture" : null : T;
                    w = [];
                    for (var d = b, g; d !== null; ) {
                        var z = d;
                        if (g = z.stateNode,
                        z = z.tag,
                        z !== 5 && z !== 26 && z !== 27 || g === null || h === null || (z = Tu(d, h),
                        z != null && w.push(Pu(d, z, g))),
                        Rt)
                            break;
                        d = d.return
                    }
                    0 < w.length && (T = new E(T,j,null,e,_),
                    M.push({
                        event: T,
                        listeners: w
                    }))
                }
            }
            if ((l & 7) === 0) {
                t: {
                    if (T = t === "mouseover" || t === "pointerover",
                    E = t === "mouseout" || t === "pointerout",
                    T && e !== Vi && (j = e.relatedTarget || e.fromElement) && (Ca(j) || j[Na]))
                        break t;
                    if ((E || T) && (T = _.window === _ ? _ : (T = _.ownerDocument) ? T.defaultView || T.parentWindow : window,
                    E ? (j = e.relatedTarget || e.toElement,
                    E = b,
                    j = j ? Ca(j) : null,
                    j !== null && (Rt = A(j),
                    w = j.tag,
                    j !== Rt || w !== 5 && w !== 27 && w !== 6) && (j = null)) : (E = null,
                    j = b),
                    E !== j)) {
                        if (w = Mo,
                        z = "onMouseLeave",
                        h = "onMouseEnter",
                        d = "mouse",
                        (t === "pointerout" || t === "pointerover") && (w = Do,
                        z = "onPointerLeave",
                        h = "onPointerEnter",
                        d = "pointer"),
                        Rt = E == null ? T : bu(E),
                        g = j == null ? T : bu(j),
                        T = new w(z,d + "leave",E,e,_),
                        T.target = Rt,
                        T.relatedTarget = g,
                        z = null,
                        Ca(_) === b && (w = new w(h,d + "enter",j,e,_),
                        w.target = g,
                        w.relatedTarget = Rt,
                        z = w),
                        Rt = z,
                        E && j)
                            l: {
                                for (w = uy,
                                h = E,
                                d = j,
                                g = 0,
                                z = h; z; z = w(z))
                                    g++;
                                z = 0;
                                for (var K = d; K; K = w(K))
                                    z++;
                                for (; 0 < g - z; )
                                    h = w(h),
                                    g--;
                                for (; 0 < z - g; )
                                    d = w(d),
                                    z--;
                                for (; g--; ) {
                                    if (h === d || d !== null && h === d.alternate) {
                                        w = h;
                                        break l
                                    }
                                    h = w(h),
                                    d = w(d)
                                }
                                w = null
                            }
                        else
                            w = null;
                        E !== null && T0(M, T, E, w, !1),
                        j !== null && Rt !== null && T0(M, Rt, j, w, !0)
                    }
                }
                t: {
                    if (T = b ? bu(b) : window,
                    E = T.nodeName && T.nodeName.toLowerCase(),
                    E === "select" || E === "input" && T.type === "file")
                        var gt = Go;
                    else if (Yo(T))
                        if (Lo)
                            gt = hm;
                        else {
                            gt = mm;
                            var Q = dm
                        }
                    else
                        E = T.nodeName,
                        !E || E.toLowerCase() !== "input" || T.type !== "checkbox" && T.type !== "radio" ? b && Xi(b.elementType) && (gt = Go) : gt = ym;
                    if (gt && (gt = gt(t, b))) {
                        qo(M, gt, e, _);
                        break t
                    }
                    Q && Q(t, T, b),
                    t === "focusout" && b && T.type === "number" && b.memoizedProps.value != null && ji(T, "number", T.value)
                }
                switch (Q = b ? bu(b) : window,
                t) {
                case "focusin":
                    (Yo(Q) || Q.contentEditable === "true") && (Xa = Q,
                    tc = b,
                    Ru = null);
                    break;
                case "focusout":
                    Ru = tc = Xa = null;
                    break;
                case "mousedown":
                    lc = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    lc = !1,
                    Jo(M, e, _);
                    break;
                case "selectionchange":
                    if (gm)
                        break;
                case "keydown":
                case "keyup":
                    Jo(M, e, _)
                }
                var ut;
                if (Fi)
                    t: {
                        switch (t) {
                        case "compositionstart":
                            var mt = "onCompositionStart";
                            break t;
                        case "compositionend":
                            mt = "onCompositionEnd";
                            break t;
                        case "compositionupdate":
                            mt = "onCompositionUpdate";
                            break t
                        }
                        mt = void 0
                    }
                else
                    ja ? Ho(t, e) && (mt = "onCompositionEnd") : t === "keydown" && e.keyCode === 229 && (mt = "onCompositionStart");
                mt && (No && e.locale !== "ko" && (ja || mt !== "onCompositionStart" ? mt === "onCompositionEnd" && ja && (ut = _o()) : (Ye = _,
                Ki = "value"in Ye ? Ye.value : Ye.textContent,
                ja = !0)),
                Q = di(b, mt),
                0 < Q.length && (mt = new Ro(mt,t,null,e,_),
                M.push({
                    event: mt,
                    listeners: Q
                }),
                ut ? mt.data = ut : (ut = Bo(e),
                ut !== null && (mt.data = ut)))),
                (ut = cm ? fm(t, e) : om(t, e)) && (mt = di(b, "onBeforeInput"),
                0 < mt.length && (Q = new Ro("onBeforeInput","beforeinput",null,e,_),
                M.push({
                    event: Q,
                    listeners: mt
                }),
                Q.data = ut)),
                ty(M, t, b, e, _)
            }
            S0(M, l)
        })
    }
    function Pu(t, l, e) {
        return {
            instance: t,
            listener: l,
            currentTarget: e
        }
    }
    function di(t, l) {
        for (var e = l + "Capture", a = []; t !== null; ) {
            var u = t
              , n = u.stateNode;
            if (u = u.tag,
            u !== 5 && u !== 26 && u !== 27 || n === null || (u = Tu(t, e),
            u != null && a.unshift(Pu(t, u, n)),
            u = Tu(t, l),
            u != null && a.push(Pu(t, u, n))),
            t.tag === 3)
                return a;
            t = t.return
        }
        return []
    }
    function uy(t) {
        if (t === null)
            return null;
        do
            t = t.return;
        while (t && t.tag !== 5 && t.tag !== 27);
        return t || null
    }
    function T0(t, l, e, a, u) {
        for (var n = l._reactName, c = []; e !== null && e !== a; ) {
            var f = e
              , r = f.alternate
              , b = f.stateNode;
            if (f = f.tag,
            r !== null && r === a)
                break;
            f !== 5 && f !== 26 && f !== 27 || b === null || (r = b,
            u ? (b = Tu(e, n),
            b != null && c.unshift(Pu(e, b, r))) : u || (b = Tu(e, n),
            b != null && c.push(Pu(e, b, r)))),
            e = e.return
        }
        c.length !== 0 && t.push({
            event: l,
            listeners: c
        })
    }
    var ny = /\r\n?/g
      , iy = /\u0000|\uFFFD/g;
    function p0(t) {
        return (typeof t == "string" ? t : "" + t).replace(ny, `
`).replace(iy, "")
    }
    function E0(t, l) {
        return l = p0(l),
        p0(t) === l
    }
    function Mt(t, l, e, a, u, n) {
        switch (e) {
        case "children":
            typeof a == "string" ? l === "body" || l === "textarea" && a === "" || qa(t, a) : (typeof a == "number" || typeof a == "bigint") && l !== "body" && qa(t, "" + a);
            break;
        case "className":
            vn(t, "class", a);
            break;
        case "tabIndex":
            vn(t, "tabindex", a);
            break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
            vn(t, e, a);
            break;
        case "style":
            Eo(t, a, n);
            break;
        case "data":
            if (l !== "object") {
                vn(t, "data", a);
                break
            }
        case "src":
        case "href":
            if (a === "" && (l !== "a" || e !== "href")) {
                t.removeAttribute(e);
                break
            }
            if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
                t.removeAttribute(e);
                break
            }
            a = Sn("" + a),
            t.setAttribute(e, a);
            break;
        case "action":
        case "formAction":
            if (typeof a == "function") {
                t.setAttribute(e, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
                break
            } else
                typeof n == "function" && (e === "formAction" ? (l !== "input" && Mt(t, l, "name", u.name, u, null),
                Mt(t, l, "formEncType", u.formEncType, u, null),
                Mt(t, l, "formMethod", u.formMethod, u, null),
                Mt(t, l, "formTarget", u.formTarget, u, null)) : (Mt(t, l, "encType", u.encType, u, null),
                Mt(t, l, "method", u.method, u, null),
                Mt(t, l, "target", u.target, u, null)));
            if (a == null || typeof a == "symbol" || typeof a == "boolean") {
                t.removeAttribute(e);
                break
            }
            a = Sn("" + a),
            t.setAttribute(e, a);
            break;
        case "onClick":
            a != null && (t.onclick = he);
            break;
        case "onScroll":
            a != null && st("scroll", t);
            break;
        case "onScrollEnd":
            a != null && st("scrollend", t);
            break;
        case "dangerouslySetInnerHTML":
            if (a != null) {
                if (typeof a != "object" || !("__html"in a))
                    throw Error(o(61));
                if (e = a.__html,
                e != null) {
                    if (u.children != null)
                        throw Error(o(60));
                    t.innerHTML = e
                }
            }
            break;
        case "multiple":
            t.multiple = a && typeof a != "function" && typeof a != "symbol";
            break;
        case "muted":
            t.muted = a && typeof a != "function" && typeof a != "symbol";
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
            break;
        case "autoFocus":
            break;
        case "xlinkHref":
            if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
                t.removeAttribute("xlink:href");
                break
            }
            e = Sn("" + a),
            t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e);
            break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
            a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, "" + a) : t.removeAttribute(e);
            break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
            a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, "") : t.removeAttribute(e);
            break;
        case "capture":
        case "download":
            a === !0 ? t.setAttribute(e, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, a) : t.removeAttribute(e);
            break;
        case "cols":
        case "rows":
        case "size":
        case "span":
            a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(e, a) : t.removeAttribute(e);
            break;
        case "rowSpan":
        case "start":
            a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(e) : t.setAttribute(e, a);
            break;
        case "popover":
            st("beforetoggle", t),
            st("toggle", t),
            hn(t, "popover", a);
            break;
        case "xlinkActuate":
            ye(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
            break;
        case "xlinkArcrole":
            ye(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
            break;
        case "xlinkRole":
            ye(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
            break;
        case "xlinkShow":
            ye(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
            break;
        case "xlinkTitle":
            ye(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
            break;
        case "xlinkType":
            ye(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
            break;
        case "xmlBase":
            ye(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
            break;
        case "xmlLang":
            ye(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
            break;
        case "xmlSpace":
            ye(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
            break;
        case "is":
            hn(t, "is", a);
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (e = Bd.get(e) || e,
            hn(t, e, a))
        }
    }
    function Mf(t, l, e, a, u, n) {
        switch (e) {
        case "style":
            Eo(t, a, n);
            break;
        case "dangerouslySetInnerHTML":
            if (a != null) {
                if (typeof a != "object" || !("__html"in a))
                    throw Error(o(61));
                if (e = a.__html,
                e != null) {
                    if (u.children != null)
                        throw Error(o(60));
                    t.innerHTML = e
                }
            }
            break;
        case "children":
            typeof a == "string" ? qa(t, a) : (typeof a == "number" || typeof a == "bigint") && qa(t, "" + a);
            break;
        case "onScroll":
            a != null && st("scroll", t);
            break;
        case "onScrollEnd":
            a != null && st("scrollend", t);
            break;
        case "onClick":
            a != null && (t.onclick = he);
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            if (!mo.hasOwnProperty(e))
                t: {
                    if (e[0] === "o" && e[1] === "n" && (u = e.endsWith("Capture"),
                    l = e.slice(2, u ? e.length - 7 : void 0),
                    n = t[Tl] || null,
                    n = n != null ? n[e] : null,
                    typeof n == "function" && t.removeEventListener(l, n, u),
                    typeof a == "function")) {
                        typeof n != "function" && n !== null && (e in t ? t[e] = null : t.hasAttribute(e) && t.removeAttribute(e)),
                        t.addEventListener(l, a, u);
                        break t
                    }
                    e in t ? t[e] = a : a === !0 ? t.setAttribute(e, "") : hn(t, e, a)
                }
        }
    }
    function dl(t, l, e) {
        switch (l) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "img":
            st("error", t),
            st("load", t);
            var a = !1, u = !1, n;
            for (n in e)
                if (e.hasOwnProperty(n)) {
                    var c = e[n];
                    if (c != null)
                        switch (n) {
                        case "src":
                            a = !0;
                            break;
                        case "srcSet":
                            u = !0;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            throw Error(o(137, l));
                        default:
                            Mt(t, l, n, c, e, null)
                        }
                }
            u && Mt(t, l, "srcSet", e.srcSet, e, null),
            a && Mt(t, l, "src", e.src, e, null);
            return;
        case "input":
            st("invalid", t);
            var f = n = c = u = null
              , r = null
              , b = null;
            for (a in e)
                if (e.hasOwnProperty(a)) {
                    var _ = e[a];
                    if (_ != null)
                        switch (a) {
                        case "name":
                            u = _;
                            break;
                        case "type":
                            c = _;
                            break;
                        case "checked":
                            r = _;
                            break;
                        case "defaultChecked":
                            b = _;
                            break;
                        case "value":
                            n = _;
                            break;
                        case "defaultValue":
                            f = _;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            if (_ != null)
                                throw Error(o(137, l));
                            break;
                        default:
                            Mt(t, l, a, _, e, null)
                        }
                }
            So(t, n, f, r, b, c, u, !1);
            return;
        case "select":
            st("invalid", t),
            a = c = n = null;
            for (u in e)
                if (e.hasOwnProperty(u) && (f = e[u],
                f != null))
                    switch (u) {
                    case "value":
                        n = f;
                        break;
                    case "defaultValue":
                        c = f;
                        break;
                    case "multiple":
                        a = f;
                    default:
                        Mt(t, l, u, f, e, null)
                    }
            l = n,
            e = c,
            t.multiple = !!a,
            l != null ? Ya(t, !!a, l, !1) : e != null && Ya(t, !!a, e, !0);
            return;
        case "textarea":
            st("invalid", t),
            n = u = a = null;
            for (c in e)
                if (e.hasOwnProperty(c) && (f = e[c],
                f != null))
                    switch (c) {
                    case "value":
                        a = f;
                        break;
                    case "defaultValue":
                        u = f;
                        break;
                    case "children":
                        n = f;
                        break;
                    case "dangerouslySetInnerHTML":
                        if (f != null)
                            throw Error(o(91));
                        break;
                    default:
                        Mt(t, l, c, f, e, null)
                    }
            To(t, a, u, n);
            return;
        case "option":
            for (r in e)
                e.hasOwnProperty(r) && (a = e[r],
                a != null) && (r === "selected" ? t.selected = a && typeof a != "function" && typeof a != "symbol" : Mt(t, l, r, a, e, null));
            return;
        case "dialog":
            st("beforetoggle", t),
            st("toggle", t),
            st("cancel", t),
            st("close", t);
            break;
        case "iframe":
        case "object":
            st("load", t);
            break;
        case "video":
        case "audio":
            for (a = 0; a < Iu.length; a++)
                st(Iu[a], t);
            break;
        case "image":
            st("error", t),
            st("load", t);
            break;
        case "details":
            st("toggle", t);
            break;
        case "embed":
        case "source":
        case "link":
            st("error", t),
            st("load", t);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
            for (b in e)
                if (e.hasOwnProperty(b) && (a = e[b],
                a != null))
                    switch (b) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        throw Error(o(137, l));
                    default:
                        Mt(t, l, b, a, e, null)
                    }
            return;
        default:
            if (Xi(l)) {
                for (_ in e)
                    e.hasOwnProperty(_) && (a = e[_],
                    a !== void 0 && Mf(t, l, _, a, e, void 0));
                return
            }
        }
        for (f in e)
            e.hasOwnProperty(f) && (a = e[f],
            a != null && Mt(t, l, f, a, e, null))
    }
    function cy(t, l, e, a) {
        switch (l) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "input":
            var u = null
              , n = null
              , c = null
              , f = null
              , r = null
              , b = null
              , _ = null;
            for (E in e) {
                var M = e[E];
                if (e.hasOwnProperty(E) && M != null)
                    switch (E) {
                    case "checked":
                        break;
                    case "value":
                        break;
                    case "defaultValue":
                        r = M;
                    default:
                        a.hasOwnProperty(E) || Mt(t, l, E, null, a, M)
                    }
            }
            for (var T in a) {
                var E = a[T];
                if (M = e[T],
                a.hasOwnProperty(T) && (E != null || M != null))
                    switch (T) {
                    case "type":
                        n = E;
                        break;
                    case "name":
                        u = E;
                        break;
                    case "checked":
                        b = E;
                        break;
                    case "defaultChecked":
                        _ = E;
                        break;
                    case "value":
                        c = E;
                        break;
                    case "defaultValue":
                        f = E;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (E != null)
                            throw Error(o(137, l));
                        break;
                    default:
                        E !== M && Mt(t, l, T, E, a, M)
                    }
            }
            Li(t, c, f, r, b, _, n, u);
            return;
        case "select":
            E = c = f = T = null;
            for (n in e)
                if (r = e[n],
                e.hasOwnProperty(n) && r != null)
                    switch (n) {
                    case "value":
                        break;
                    case "multiple":
                        E = r;
                    default:
                        a.hasOwnProperty(n) || Mt(t, l, n, null, a, r)
                    }
            for (u in a)
                if (n = a[u],
                r = e[u],
                a.hasOwnProperty(u) && (n != null || r != null))
                    switch (u) {
                    case "value":
                        T = n;
                        break;
                    case "defaultValue":
                        f = n;
                        break;
                    case "multiple":
                        c = n;
                    default:
                        n !== r && Mt(t, l, u, n, a, r)
                    }
            l = f,
            e = c,
            a = E,
            T != null ? Ya(t, !!e, T, !1) : !!a != !!e && (l != null ? Ya(t, !!e, l, !0) : Ya(t, !!e, e ? [] : "", !1));
            return;
        case "textarea":
            E = T = null;
            for (f in e)
                if (u = e[f],
                e.hasOwnProperty(f) && u != null && !a.hasOwnProperty(f))
                    switch (f) {
                    case "value":
                        break;
                    case "children":
                        break;
                    default:
                        Mt(t, l, f, null, a, u)
                    }
            for (c in a)
                if (u = a[c],
                n = e[c],
                a.hasOwnProperty(c) && (u != null || n != null))
                    switch (c) {
                    case "value":
                        T = u;
                        break;
                    case "defaultValue":
                        E = u;
                        break;
                    case "children":
                        break;
                    case "dangerouslySetInnerHTML":
                        if (u != null)
                            throw Error(o(91));
                        break;
                    default:
                        u !== n && Mt(t, l, c, u, a, n)
                    }
            bo(t, T, E);
            return;
        case "option":
            for (var j in e)
                T = e[j],
                e.hasOwnProperty(j) && T != null && !a.hasOwnProperty(j) && (j === "selected" ? t.selected = !1 : Mt(t, l, j, null, a, T));
            for (r in a)
                T = a[r],
                E = e[r],
                a.hasOwnProperty(r) && T !== E && (T != null || E != null) && (r === "selected" ? t.selected = T && typeof T != "function" && typeof T != "symbol" : Mt(t, l, r, T, a, E));
            return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
            for (var w in e)
                T = e[w],
                e.hasOwnProperty(w) && T != null && !a.hasOwnProperty(w) && Mt(t, l, w, null, a, T);
            for (b in a)
                if (T = a[b],
                E = e[b],
                a.hasOwnProperty(b) && T !== E && (T != null || E != null))
                    switch (b) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (T != null)
                            throw Error(o(137, l));
                        break;
                    default:
                        Mt(t, l, b, T, a, E)
                    }
            return;
        default:
            if (Xi(l)) {
                for (var Rt in e)
                    T = e[Rt],
                    e.hasOwnProperty(Rt) && T !== void 0 && !a.hasOwnProperty(Rt) && Mf(t, l, Rt, void 0, a, T);
                for (_ in a)
                    T = a[_],
                    E = e[_],
                    !a.hasOwnProperty(_) || T === E || T === void 0 && E === void 0 || Mf(t, l, _, T, a, E);
                return
            }
        }
        for (var h in e)
            T = e[h],
            e.hasOwnProperty(h) && T != null && !a.hasOwnProperty(h) && Mt(t, l, h, null, a, T);
        for (M in a)
            T = a[M],
            E = e[M],
            !a.hasOwnProperty(M) || T === E || T == null && E == null || Mt(t, l, M, T, a, E)
    }
    function A0(t) {
        switch (t) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
            return !0;
        default:
            return !1
        }
    }
    function fy() {
        if (typeof performance.getEntriesByType == "function") {
            for (var t = 0, l = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
                var u = e[a]
                  , n = u.transferSize
                  , c = u.initiatorType
                  , f = u.duration;
                if (n && f && A0(c)) {
                    for (c = 0,
                    f = u.responseEnd,
                    a += 1; a < e.length; a++) {
                        var r = e[a]
                          , b = r.startTime;
                        if (b > f)
                            break;
                        var _ = r.transferSize
                          , M = r.initiatorType;
                        _ && A0(M) && (r = r.responseEnd,
                        c += _ * (r < f ? 1 : (f - b) / (r - b)))
                    }
                    if (--a,
                    l += 8 * (n + c) / (u.duration / 1e3),
                    t++,
                    10 < t)
                        break
                }
            }
            if (0 < t)
                return l / t / 1e6
        }
        return navigator.connection && (t = navigator.connection.downlink,
        typeof t == "number") ? t : 5
    }
    var Rf = null
      , Df = null;
    function mi(t) {
        return t.nodeType === 9 ? t : t.ownerDocument
    }
    function O0(t) {
        switch (t) {
        case "http://www.w3.org/2000/svg":
            return 1;
        case "http://www.w3.org/1998/Math/MathML":
            return 2;
        default:
            return 0
        }
    }
    function _0(t, l) {
        if (t === 0)
            switch (l) {
            case "svg":
                return 1;
            case "math":
                return 2;
            default:
                return 0
            }
        return t === 1 && l === "foreignObject" ? 0 : t
    }
    function Nf(t, l) {
        return t === "textarea" || t === "noscript" || typeof l.children == "string" || typeof l.children == "number" || typeof l.children == "bigint" || typeof l.dangerouslySetInnerHTML == "object" && l.dangerouslySetInnerHTML !== null && l.dangerouslySetInnerHTML.__html != null
    }
    var Cf = null;
    function oy() {
        var t = window.event;
        return t && t.type === "popstate" ? t === Cf ? !1 : (Cf = t,
        !0) : (Cf = null,
        !1)
    }
    var z0 = typeof setTimeout == "function" ? setTimeout : void 0
      , sy = typeof clearTimeout == "function" ? clearTimeout : void 0
      , M0 = typeof Promise == "function" ? Promise : void 0
      , ry = typeof queueMicrotask == "function" ? queueMicrotask : typeof M0 < "u" ? function(t) {
        return M0.resolve(null).then(t).catch(dy)
    }
    : z0;
    function dy(t) {
        setTimeout(function() {
            throw t
        })
    }
    function Ie(t) {
        return t === "head"
    }
    function R0(t, l) {
        var e = l
          , a = 0;
        do {
            var u = e.nextSibling;
            if (t.removeChild(e),
            u && u.nodeType === 8)
                if (e = u.data,
                e === "/$" || e === "/&") {
                    if (a === 0) {
                        t.removeChild(u),
                        mu(l);
                        return
                    }
                    a--
                } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
                    a++;
                else if (e === "html")
                    tn(t.ownerDocument.documentElement);
                else if (e === "head") {
                    e = t.ownerDocument.head,
                    tn(e);
                    for (var n = e.firstChild; n; ) {
                        var c = n.nextSibling
                          , f = n.nodeName;
                        n[Su] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && n.rel.toLowerCase() === "stylesheet" || e.removeChild(n),
                        n = c
                    }
                } else
                    e === "body" && tn(t.ownerDocument.body);
            e = u
        } while (e);
        mu(l)
    }
    function D0(t, l) {
        var e = t;
        t = 0;
        do {
            var a = e.nextSibling;
            if (e.nodeType === 1 ? l ? (e._stashedDisplay = e.style.display,
            e.style.display = "none") : (e.style.display = e._stashedDisplay || "",
            e.getAttribute("style") === "" && e.removeAttribute("style")) : e.nodeType === 3 && (l ? (e._stashedText = e.nodeValue,
            e.nodeValue = "") : e.nodeValue = e._stashedText || ""),
            a && a.nodeType === 8)
                if (e = a.data,
                e === "/$") {
                    if (t === 0)
                        break;
                    t--
                } else
                    e !== "$" && e !== "$?" && e !== "$~" && e !== "$!" || t++;
            e = a
        } while (e)
    }
    function Uf(t) {
        var l = t.firstChild;
        for (l && l.nodeType === 10 && (l = l.nextSibling); l; ) {
            var e = l;
            switch (l = l.nextSibling,
            e.nodeName) {
            case "HTML":
            case "HEAD":
            case "BODY":
                Uf(e),
                qi(e);
                continue;
            case "SCRIPT":
            case "STYLE":
                continue;
            case "LINK":
                if (e.rel.toLowerCase() === "stylesheet")
                    continue
            }
            t.removeChild(e)
        }
    }
    function my(t, l, e, a) {
        for (; t.nodeType === 1; ) {
            var u = e;
            if (t.nodeName.toLowerCase() !== l.toLowerCase()) {
                if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden"))
                    break
            } else if (a) {
                if (!t[Su])
                    switch (l) {
                    case "meta":
                        if (!t.hasAttribute("itemprop"))
                            break;
                        return t;
                    case "link":
                        if (n = t.getAttribute("rel"),
                        n === "stylesheet" && t.hasAttribute("data-precedence"))
                            break;
                        if (n !== u.rel || t.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || t.getAttribute("title") !== (u.title == null ? null : u.title))
                            break;
                        return t;
                    case "style":
                        if (t.hasAttribute("data-precedence"))
                            break;
                        return t;
                    case "script":
                        if (n = t.getAttribute("src"),
                        (n !== (u.src == null ? null : u.src) || t.getAttribute("type") !== (u.type == null ? null : u.type) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && n && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                            break;
                        return t;
                    default:
                        return t
                    }
            } else if (l === "input" && t.type === "hidden") {
                var n = u.name == null ? null : "" + u.name;
                if (u.type === "hidden" && t.getAttribute("name") === n)
                    return t
            } else
                return t;
            if (t = wl(t.nextSibling),
            t === null)
                break
        }
        return null
    }
    function yy(t, l, e) {
        if (l === "")
            return null;
        for (; t.nodeType !== 3; )
            if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = wl(t.nextSibling),
            t === null))
                return null;
        return t
    }
    function N0(t, l) {
        for (; t.nodeType !== 8; )
            if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l || (t = wl(t.nextSibling),
            t === null))
                return null;
        return t
    }
    function Hf(t) {
        return t.data === "$?" || t.data === "$~"
    }
    function Bf(t) {
        return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading"
    }
    function hy(t, l) {
        var e = t.ownerDocument;
        if (t.data === "$~")
            t._reactRetry = l;
        else if (t.data !== "$?" || e.readyState !== "loading")
            l();
        else {
            var a = function() {
                l(),
                e.removeEventListener("DOMContentLoaded", a)
            };
            e.addEventListener("DOMContentLoaded", a),
            t._reactRetry = a
        }
    }
    function wl(t) {
        for (; t != null; t = t.nextSibling) {
            var l = t.nodeType;
            if (l === 1 || l === 3)
                break;
            if (l === 8) {
                if (l = t.data,
                l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&" || l === "F!" || l === "F")
                    break;
                if (l === "/$" || l === "/&")
                    return null
            }
        }
        return t
    }
    var Yf = null;
    function C0(t) {
        t = t.nextSibling;
        for (var l = 0; t; ) {
            if (t.nodeType === 8) {
                var e = t.data;
                if (e === "/$" || e === "/&") {
                    if (l === 0)
                        return wl(t.nextSibling);
                    l--
                } else
                    e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || l++
            }
            t = t.nextSibling
        }
        return null
    }
    function U0(t) {
        t = t.previousSibling;
        for (var l = 0; t; ) {
            if (t.nodeType === 8) {
                var e = t.data;
                if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
                    if (l === 0)
                        return t;
                    l--
                } else
                    e !== "/$" && e !== "/&" || l++
            }
            t = t.previousSibling
        }
        return null
    }
    function H0(t, l, e) {
        switch (l = mi(e),
        t) {
        case "html":
            if (t = l.documentElement,
            !t)
                throw Error(o(452));
            return t;
        case "head":
            if (t = l.head,
            !t)
                throw Error(o(453));
            return t;
        case "body":
            if (t = l.body,
            !t)
                throw Error(o(454));
            return t;
        default:
            throw Error(o(451))
        }
    }
    function tn(t) {
        for (var l = t.attributes; l.length; )
            t.removeAttributeNode(l[0]);
        qi(t)
    }
    var kl = new Map
      , B0 = new Set;
    function yi(t) {
        return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument
    }
    var Ce = H.d;
    H.d = {
        f: vy,
        r: gy,
        D: Sy,
        C: by,
        L: Ty,
        m: py,
        X: Ay,
        S: Ey,
        M: Oy
    };
    function vy() {
        var t = Ce.f()
          , l = ni();
        return t || l
    }
    function gy(t) {
        var l = Ua(t);
        l !== null && l.tag === 5 && l.type === "form" ? $s(l) : Ce.r(t)
    }
    var su = typeof document > "u" ? null : document;
    function Y0(t, l, e) {
        var a = su;
        if (a && typeof l == "string" && l) {
            var u = Xl(l);
            u = 'link[rel="' + t + '"][href="' + u + '"]',
            typeof e == "string" && (u += '[crossorigin="' + e + '"]'),
            B0.has(u) || (B0.add(u),
            t = {
                rel: t,
                crossOrigin: e,
                href: l
            },
            a.querySelector(u) === null && (l = a.createElement("link"),
            dl(l, "link", t),
            ul(l),
            a.head.appendChild(l)))
        }
    }
    function Sy(t) {
        Ce.D(t),
        Y0("dns-prefetch", t, null)
    }
    function by(t, l) {
        Ce.C(t, l),
        Y0("preconnect", t, l)
    }
    function Ty(t, l, e) {
        Ce.L(t, l, e);
        var a = su;
        if (a && t && l) {
            var u = 'link[rel="preload"][as="' + Xl(l) + '"]';
            l === "image" && e && e.imageSrcSet ? (u += '[imagesrcset="' + Xl(e.imageSrcSet) + '"]',
            typeof e.imageSizes == "string" && (u += '[imagesizes="' + Xl(e.imageSizes) + '"]')) : u += '[href="' + Xl(t) + '"]';
            var n = u;
            switch (l) {
            case "style":
                n = ru(t);
                break;
            case "script":
                n = du(t)
            }
            kl.has(n) || (t = U({
                rel: "preload",
                href: l === "image" && e && e.imageSrcSet ? void 0 : t,
                as: l
            }, e),
            kl.set(n, t),
            a.querySelector(u) !== null || l === "style" && a.querySelector(ln(n)) || l === "script" && a.querySelector(en(n)) || (l = a.createElement("link"),
            dl(l, "link", t),
            ul(l),
            a.head.appendChild(l)))
        }
    }
    function py(t, l) {
        Ce.m(t, l);
        var e = su;
        if (e && t) {
            var a = l && typeof l.as == "string" ? l.as : "script"
              , u = 'link[rel="modulepreload"][as="' + Xl(a) + '"][href="' + Xl(t) + '"]'
              , n = u;
            switch (a) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
                n = du(t)
            }
            if (!kl.has(n) && (t = U({
                rel: "modulepreload",
                href: t
            }, l),
            kl.set(n, t),
            e.querySelector(u) === null)) {
                switch (a) {
                case "audioworklet":
                case "paintworklet":
                case "serviceworker":
                case "sharedworker":
                case "worker":
                case "script":
                    if (e.querySelector(en(n)))
                        return
                }
                a = e.createElement("link"),
                dl(a, "link", t),
                ul(a),
                e.head.appendChild(a)
            }
        }
    }
    function Ey(t, l, e) {
        Ce.S(t, l, e);
        var a = su;
        if (a && t) {
            var u = Ha(a).hoistableStyles
              , n = ru(t);
            l = l || "default";
            var c = u.get(n);
            if (!c) {
                var f = {
                    loading: 0,
                    preload: null
                };
                if (c = a.querySelector(ln(n)))
                    f.loading = 5;
                else {
                    t = U({
                        rel: "stylesheet",
                        href: t,
                        "data-precedence": l
                    }, e),
                    (e = kl.get(n)) && qf(t, e);
                    var r = c = a.createElement("link");
                    ul(r),
                    dl(r, "link", t),
                    r._p = new Promise(function(b, _) {
                        r.onload = b,
                        r.onerror = _
                    }
                    ),
                    r.addEventListener("load", function() {
                        f.loading |= 1
                    }),
                    r.addEventListener("error", function() {
                        f.loading |= 2
                    }),
                    f.loading |= 4,
                    hi(c, l, a)
                }
                c = {
                    type: "stylesheet",
                    instance: c,
                    count: 1,
                    state: f
                },
                u.set(n, c)
            }
        }
    }
    function Ay(t, l) {
        Ce.X(t, l);
        var e = su;
        if (e && t) {
            var a = Ha(e).hoistableScripts
              , u = du(t)
              , n = a.get(u);
            n || (n = e.querySelector(en(u)),
            n || (t = U({
                src: t,
                async: !0
            }, l),
            (l = kl.get(u)) && Gf(t, l),
            n = e.createElement("script"),
            ul(n),
            dl(n, "link", t),
            e.head.appendChild(n)),
            n = {
                type: "script",
                instance: n,
                count: 1,
                state: null
            },
            a.set(u, n))
        }
    }
    function Oy(t, l) {
        Ce.M(t, l);
        var e = su;
        if (e && t) {
            var a = Ha(e).hoistableScripts
              , u = du(t)
              , n = a.get(u);
            n || (n = e.querySelector(en(u)),
            n || (t = U({
                src: t,
                async: !0,
                type: "module"
            }, l),
            (l = kl.get(u)) && Gf(t, l),
            n = e.createElement("script"),
            ul(n),
            dl(n, "link", t),
            e.head.appendChild(n)),
            n = {
                type: "script",
                instance: n,
                count: 1,
                state: null
            },
            a.set(u, n))
        }
    }
    function q0(t, l, e, a) {
        var u = (u = it.current) ? yi(u) : null;
        if (!u)
            throw Error(o(446));
        switch (t) {
        case "meta":
        case "title":
            return null;
        case "style":
            return typeof e.precedence == "string" && typeof e.href == "string" ? (l = ru(e.href),
            e = Ha(u).hoistableStyles,
            a = e.get(l),
            a || (a = {
                type: "style",
                instance: null,
                count: 0,
                state: null
            },
            e.set(l, a)),
            a) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        case "link":
            if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
                t = ru(e.href);
                var n = Ha(u).hoistableStyles
                  , c = n.get(t);
                if (c || (u = u.ownerDocument || u,
                c = {
                    type: "stylesheet",
                    instance: null,
                    count: 0,
                    state: {
                        loading: 0,
                        preload: null
                    }
                },
                n.set(t, c),
                (n = u.querySelector(ln(t))) && !n._p && (c.instance = n,
                c.state.loading = 5),
                kl.has(t) || (e = {
                    rel: "preload",
                    as: "style",
                    href: e.href,
                    crossOrigin: e.crossOrigin,
                    integrity: e.integrity,
                    media: e.media,
                    hrefLang: e.hrefLang,
                    referrerPolicy: e.referrerPolicy
                },
                kl.set(t, e),
                n || _y(u, t, e, c.state))),
                l && a === null)
                    throw Error(o(528, ""));
                return c
            }
            if (l && a !== null)
                throw Error(o(529, ""));
            return null;
        case "script":
            return l = e.async,
            e = e.src,
            typeof e == "string" && l && typeof l != "function" && typeof l != "symbol" ? (l = du(e),
            e = Ha(u).hoistableScripts,
            a = e.get(l),
            a || (a = {
                type: "script",
                instance: null,
                count: 0,
                state: null
            },
            e.set(l, a)),
            a) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        default:
            throw Error(o(444, t))
        }
    }
    function ru(t) {
        return 'href="' + Xl(t) + '"'
    }
    function ln(t) {
        return 'link[rel="stylesheet"][' + t + "]"
    }
    function G0(t) {
        return U({}, t, {
            "data-precedence": t.precedence,
            precedence: null
        })
    }
    function _y(t, l, e, a) {
        t.querySelector('link[rel="preload"][as="style"][' + l + "]") ? a.loading = 1 : (l = t.createElement("link"),
        a.preload = l,
        l.addEventListener("load", function() {
            return a.loading |= 1
        }),
        l.addEventListener("error", function() {
            return a.loading |= 2
        }),
        dl(l, "link", e),
        ul(l),
        t.head.appendChild(l))
    }
    function du(t) {
        return '[src="' + Xl(t) + '"]'
    }
    function en(t) {
        return "script[async]" + t
    }
    function L0(t, l, e) {
        if (l.count++,
        l.instance === null)
            switch (l.type) {
            case "style":
                var a = t.querySelector('style[data-href~="' + Xl(e.href) + '"]');
                if (a)
                    return l.instance = a,
                    ul(a),
                    a;
                var u = U({}, e, {
                    "data-href": e.href,
                    "data-precedence": e.precedence,
                    href: null,
                    precedence: null
                });
                return a = (t.ownerDocument || t).createElement("style"),
                ul(a),
                dl(a, "style", u),
                hi(a, e.precedence, t),
                l.instance = a;
            case "stylesheet":
                u = ru(e.href);
                var n = t.querySelector(ln(u));
                if (n)
                    return l.state.loading |= 4,
                    l.instance = n,
                    ul(n),
                    n;
                a = G0(e),
                (u = kl.get(u)) && qf(a, u),
                n = (t.ownerDocument || t).createElement("link"),
                ul(n);
                var c = n;
                return c._p = new Promise(function(f, r) {
                    c.onload = f,
                    c.onerror = r
                }
                ),
                dl(n, "link", a),
                l.state.loading |= 4,
                hi(n, e.precedence, t),
                l.instance = n;
            case "script":
                return n = du(e.src),
                (u = t.querySelector(en(n))) ? (l.instance = u,
                ul(u),
                u) : (a = e,
                (u = kl.get(n)) && (a = U({}, e),
                Gf(a, u)),
                t = t.ownerDocument || t,
                u = t.createElement("script"),
                ul(u),
                dl(u, "link", a),
                t.head.appendChild(u),
                l.instance = u);
            case "void":
                return null;
            default:
                throw Error(o(443, l.type))
            }
        else
            l.type === "stylesheet" && (l.state.loading & 4) === 0 && (a = l.instance,
            l.state.loading |= 4,
            hi(a, e.precedence, t));
        return l.instance
    }
    function hi(t, l, e) {
        for (var a = e.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = a.length ? a[a.length - 1] : null, n = u, c = 0; c < a.length; c++) {
            var f = a[c];
            if (f.dataset.precedence === l)
                n = f;
            else if (n !== u)
                break
        }
        n ? n.parentNode.insertBefore(t, n.nextSibling) : (l = e.nodeType === 9 ? e.head : e,
        l.insertBefore(t, l.firstChild))
    }
    function qf(t, l) {
        t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
        t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
        t.title == null && (t.title = l.title)
    }
    function Gf(t, l) {
        t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
        t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
        t.integrity == null && (t.integrity = l.integrity)
    }
    var vi = null;
    function j0(t, l, e) {
        if (vi === null) {
            var a = new Map
              , u = vi = new Map;
            u.set(e, a)
        } else
            u = vi,
            a = u.get(e),
            a || (a = new Map,
            u.set(e, a));
        if (a.has(t))
            return a;
        for (a.set(t, null),
        e = e.getElementsByTagName(t),
        u = 0; u < e.length; u++) {
            var n = e[u];
            if (!(n[Su] || n[fl] || t === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
                var c = n.getAttribute(l) || "";
                c = t + c;
                var f = a.get(c);
                f ? f.push(n) : a.set(c, [n])
            }
        }
        return a
    }
    function X0(t, l, e) {
        t = t.ownerDocument || t,
        t.head.insertBefore(e, l === "title" ? t.querySelector("head > title") : null)
    }
    function zy(t, l, e) {
        if (e === 1 || l.itemProp != null)
            return !1;
        switch (t) {
        case "meta":
        case "title":
            return !0;
        case "style":
            if (typeof l.precedence != "string" || typeof l.href != "string" || l.href === "")
                break;
            return !0;
        case "link":
            if (typeof l.rel != "string" || typeof l.href != "string" || l.href === "" || l.onLoad || l.onError)
                break;
            return l.rel === "stylesheet" ? (t = l.disabled,
            typeof l.precedence == "string" && t == null) : !0;
        case "script":
            if (l.async && typeof l.async != "function" && typeof l.async != "symbol" && !l.onLoad && !l.onError && l.src && typeof l.src == "string")
                return !0
        }
        return !1
    }
    function V0(t) {
        return !(t.type === "stylesheet" && (t.state.loading & 3) === 0)
    }
    function My(t, l, e, a) {
        if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
            if (e.instance === null) {
                var u = ru(a.href)
                  , n = l.querySelector(ln(u));
                if (n) {
                    l = n._p,
                    l !== null && typeof l == "object" && typeof l.then == "function" && (t.count++,
                    t = gi.bind(t),
                    l.then(t, t)),
                    e.state.loading |= 4,
                    e.instance = n,
                    ul(n);
                    return
                }
                n = l.ownerDocument || l,
                a = G0(a),
                (u = kl.get(u)) && qf(a, u),
                n = n.createElement("link"),
                ul(n);
                var c = n;
                c._p = new Promise(function(f, r) {
                    c.onload = f,
                    c.onerror = r
                }
                ),
                dl(n, "link", a),
                e.instance = n
            }
            t.stylesheets === null && (t.stylesheets = new Map),
            t.stylesheets.set(e, l),
            (l = e.state.preload) && (e.state.loading & 3) === 0 && (t.count++,
            e = gi.bind(t),
            l.addEventListener("load", e),
            l.addEventListener("error", e))
        }
    }
    var Lf = 0;
    function Ry(t, l) {
        return t.stylesheets && t.count === 0 && bi(t, t.stylesheets),
        0 < t.count || 0 < t.imgCount ? function(e) {
            var a = setTimeout(function() {
                if (t.stylesheets && bi(t, t.stylesheets),
                t.unsuspend) {
                    var n = t.unsuspend;
                    t.unsuspend = null,
                    n()
                }
            }, 6e4 + l);
            0 < t.imgBytes && Lf === 0 && (Lf = 62500 * fy());
            var u = setTimeout(function() {
                if (t.waitingForImages = !1,
                t.count === 0 && (t.stylesheets && bi(t, t.stylesheets),
                t.unsuspend)) {
                    var n = t.unsuspend;
                    t.unsuspend = null,
                    n()
                }
            }, (t.imgBytes > Lf ? 50 : 800) + l);
            return t.unsuspend = e,
            function() {
                t.unsuspend = null,
                clearTimeout(a),
                clearTimeout(u)
            }
        }
        : null
    }
    function gi() {
        if (this.count--,
        this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
            if (this.stylesheets)
                bi(this, this.stylesheets);
            else if (this.unsuspend) {
                var t = this.unsuspend;
                this.unsuspend = null,
                t()
            }
        }
    }
    var Si = null;
    function bi(t, l) {
        t.stylesheets = null,
        t.unsuspend !== null && (t.count++,
        Si = new Map,
        l.forEach(Dy, t),
        Si = null,
        gi.call(t))
    }
    function Dy(t, l) {
        if (!(l.state.loading & 4)) {
            var e = Si.get(t);
            if (e)
                var a = e.get(null);
            else {
                e = new Map,
                Si.set(t, e);
                for (var u = t.querySelectorAll("link[data-precedence],style[data-precedence]"), n = 0; n < u.length; n++) {
                    var c = u[n];
                    (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (e.set(c.dataset.precedence, c),
                    a = c)
                }
                a && e.set(null, a)
            }
            u = l.instance,
            c = u.getAttribute("data-precedence"),
            n = e.get(c) || a,
            n === a && e.set(null, u),
            e.set(c, u),
            this.count++,
            a = gi.bind(this),
            u.addEventListener("load", a),
            u.addEventListener("error", a),
            n ? n.parentNode.insertBefore(u, n.nextSibling) : (t = t.nodeType === 9 ? t.head : t,
            t.insertBefore(u, t.firstChild)),
            l.state.loading |= 4
        }
    }
    var an = {
        $$typeof: bt,
        Provider: null,
        Consumer: null,
        _currentValue: k,
        _currentValue2: k,
        _threadCount: 0
    };
    function Ny(t, l, e, a, u, n, c, f, r) {
        this.tag = 1,
        this.containerInfo = t,
        this.pingCache = this.current = this.pendingChildren = null,
        this.timeoutHandle = -1,
        this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null,
        this.callbackPriority = 0,
        this.expirationTimes = vu(-1),
        this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0,
        this.entanglements = vu(0),
        this.hiddenUpdates = vu(null),
        this.identifierPrefix = a,
        this.onUncaughtError = u,
        this.onCaughtError = n,
        this.onRecoverableError = c,
        this.pooledCache = null,
        this.pooledCacheLanes = 0,
        this.formState = r,
        this.incompleteTransitions = new Map
    }
    function Q0(t, l, e, a, u, n, c, f, r, b, _, M) {
        return t = new Ny(t,l,e,c,r,b,_,M,f),
        l = 1,
        n === !0 && (l |= 24),
        n = Cl(3, null, null, l),
        t.current = n,
        n.stateNode = t,
        l = vc(),
        l.refCount++,
        t.pooledCache = l,
        l.refCount++,
        n.memoizedState = {
            element: a,
            isDehydrated: e,
            cache: l
        },
        Tc(n),
        t
    }
    function Z0(t) {
        return t ? (t = Za,
        t) : Za
    }
    function x0(t, l, e, a, u, n) {
        u = Z0(u),
        a.context === null ? a.context = u : a.pendingContext = u,
        a = Ve(l),
        a.payload = {
            element: e
        },
        n = n === void 0 ? null : n,
        n !== null && (a.callback = n),
        e = Qe(t, a, l),
        e !== null && (zl(e, t, l),
        Yu(e, t, l))
    }
    function K0(t, l) {
        if (t = t.memoizedState,
        t !== null && t.dehydrated !== null) {
            var e = t.retryLane;
            t.retryLane = e !== 0 && e < l ? e : l
        }
    }
    function jf(t, l) {
        K0(t, l),
        (t = t.alternate) && K0(t, l)
    }
    function J0(t) {
        if (t.tag === 13 || t.tag === 31) {
            var l = da(t, 67108864);
            l !== null && zl(l, t, 67108864),
            jf(t, 67108864)
        }
    }
    function w0(t) {
        if (t.tag === 13 || t.tag === 31) {
            var l = ql();
            l = Hi(l);
            var e = da(t, l);
            e !== null && zl(e, t, l),
            jf(t, l)
        }
    }
    var Ti = !0;
    function Cy(t, l, e, a) {
        var u = O.T;
        O.T = null;
        var n = H.p;
        try {
            H.p = 2,
            Xf(t, l, e, a)
        } finally {
            H.p = n,
            O.T = u
        }
    }
    function Uy(t, l, e, a) {
        var u = O.T;
        O.T = null;
        var n = H.p;
        try {
            H.p = 8,
            Xf(t, l, e, a)
        } finally {
            H.p = n,
            O.T = u
        }
    }
    function Xf(t, l, e, a) {
        if (Ti) {
            var u = Vf(a);
            if (u === null)
                zf(t, l, a, pi, e),
                W0(t, a);
            else if (By(u, t, l, e, a))
                a.stopPropagation();
            else if (W0(t, a),
            l & 4 && -1 < Hy.indexOf(t)) {
                for (; u !== null; ) {
                    var n = Ua(u);
                    if (n !== null)
                        switch (n.tag) {
                        case 3:
                            if (n = n.stateNode,
                            n.current.memoizedState.isDehydrated) {
                                var c = Dl(n.pendingLanes);
                                if (c !== 0) {
                                    var f = n;
                                    for (f.pendingLanes |= 2,
                                    f.entangledLanes |= 2; c; ) {
                                        var r = 1 << 31 - vl(c);
                                        f.entanglements[1] |= r,
                                        c &= ~r
                                    }
                                    fe(n),
                                    (Tt & 6) === 0 && (ai = x() + 500,
                                    $u(0))
                                }
                            }
                            break;
                        case 31:
                        case 13:
                            f = da(n, 2),
                            f !== null && zl(f, n, 2),
                            ni(),
                            jf(n, 2)
                        }
                    if (n = Vf(a),
                    n === null && zf(t, l, a, pi, e),
                    n === u)
                        break;
                    u = n
                }
                u !== null && a.stopPropagation()
            } else
                zf(t, l, a, null, e)
        }
    }
    function Vf(t) {
        return t = Qi(t),
        Qf(t)
    }
    var pi = null;
    function Qf(t) {
        if (pi = null,
        t = Ca(t),
        t !== null) {
            var l = A(t);
            if (l === null)
                t = null;
            else {
                var e = l.tag;
                if (e === 13) {
                    if (t = D(l),
                    t !== null)
                        return t;
                    t = null
                } else if (e === 31) {
                    if (t = Y(l),
                    t !== null)
                        return t;
                    t = null
                } else if (e === 3) {
                    if (l.stateNode.current.memoizedState.isDehydrated)
                        return l.tag === 3 ? l.stateNode.containerInfo : null;
                    t = null
                } else
                    l !== t && (t = null)
            }
        }
        return pi = t,
        null
    }
    function k0(t) {
        switch (t) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
            return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
            return 8;
        case "message":
            switch (G()) {
            case C:
                return 2;
            case et:
                return 8;
            case Gl:
            case re:
                return 32;
            case cl:
                return 268435456;
            default:
                return 32
            }
        default:
            return 32
        }
    }
    var Zf = !1
      , Pe = null
      , ta = null
      , la = null
      , un = new Map
      , nn = new Map
      , ea = []
      , Hy = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function W0(t, l) {
        switch (t) {
        case "focusin":
        case "focusout":
            Pe = null;
            break;
        case "dragenter":
        case "dragleave":
            ta = null;
            break;
        case "mouseover":
        case "mouseout":
            la = null;
            break;
        case "pointerover":
        case "pointerout":
            un.delete(l.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture":
            nn.delete(l.pointerId)
        }
    }
    function cn(t, l, e, a, u, n) {
        return t === null || t.nativeEvent !== n ? (t = {
            blockedOn: l,
            domEventName: e,
            eventSystemFlags: a,
            nativeEvent: n,
            targetContainers: [u]
        },
        l !== null && (l = Ua(l),
        l !== null && J0(l)),
        t) : (t.eventSystemFlags |= a,
        l = t.targetContainers,
        u !== null && l.indexOf(u) === -1 && l.push(u),
        t)
    }
    function By(t, l, e, a, u) {
        switch (l) {
        case "focusin":
            return Pe = cn(Pe, t, l, e, a, u),
            !0;
        case "dragenter":
            return ta = cn(ta, t, l, e, a, u),
            !0;
        case "mouseover":
            return la = cn(la, t, l, e, a, u),
            !0;
        case "pointerover":
            var n = u.pointerId;
            return un.set(n, cn(un.get(n) || null, t, l, e, a, u)),
            !0;
        case "gotpointercapture":
            return n = u.pointerId,
            nn.set(n, cn(nn.get(n) || null, t, l, e, a, u)),
            !0
        }
        return !1
    }
    function F0(t) {
        var l = Ca(t.target);
        if (l !== null) {
            var e = A(l);
            if (e !== null) {
                if (l = e.tag,
                l === 13) {
                    if (l = D(e),
                    l !== null) {
                        t.blockedOn = l,
                        oo(t.priority, function() {
                            w0(e)
                        });
                        return
                    }
                } else if (l === 31) {
                    if (l = Y(e),
                    l !== null) {
                        t.blockedOn = l,
                        oo(t.priority, function() {
                            w0(e)
                        });
                        return
                    }
                } else if (l === 3 && e.stateNode.current.memoizedState.isDehydrated) {
                    t.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
                    return
                }
            }
        }
        t.blockedOn = null
    }
    function Ei(t) {
        if (t.blockedOn !== null)
            return !1;
        for (var l = t.targetContainers; 0 < l.length; ) {
            var e = Vf(t.nativeEvent);
            if (e === null) {
                e = t.nativeEvent;
                var a = new e.constructor(e.type,e);
                Vi = a,
                e.target.dispatchEvent(a),
                Vi = null
            } else
                return l = Ua(e),
                l !== null && J0(l),
                t.blockedOn = e,
                !1;
            l.shift()
        }
        return !0
    }
    function $0(t, l, e) {
        Ei(t) && e.delete(l)
    }
    function Yy() {
        Zf = !1,
        Pe !== null && Ei(Pe) && (Pe = null),
        ta !== null && Ei(ta) && (ta = null),
        la !== null && Ei(la) && (la = null),
        un.forEach($0),
        nn.forEach($0)
    }
    function Ai(t, l) {
        t.blockedOn === l && (t.blockedOn = null,
        Zf || (Zf = !0,
        i.unstable_scheduleCallback(i.unstable_NormalPriority, Yy)))
    }
    var Oi = null;
    function I0(t) {
        Oi !== t && (Oi = t,
        i.unstable_scheduleCallback(i.unstable_NormalPriority, function() {
            Oi === t && (Oi = null);
            for (var l = 0; l < t.length; l += 3) {
                var e = t[l]
                  , a = t[l + 1]
                  , u = t[l + 2];
                if (typeof a != "function") {
                    if (Qf(a || e) === null)
                        continue;
                    break
                }
                var n = Ua(e);
                n !== null && (t.splice(l, 3),
                l -= 3,
                Xc(n, {
                    pending: !0,
                    data: u,
                    method: e.method,
                    action: a
                }, a, u))
            }
        }))
    }
    function mu(t) {
        function l(r) {
            return Ai(r, t)
        }
        Pe !== null && Ai(Pe, t),
        ta !== null && Ai(ta, t),
        la !== null && Ai(la, t),
        un.forEach(l),
        nn.forEach(l);
        for (var e = 0; e < ea.length; e++) {
            var a = ea[e];
            a.blockedOn === t && (a.blockedOn = null)
        }
        for (; 0 < ea.length && (e = ea[0],
        e.blockedOn === null); )
            F0(e),
            e.blockedOn === null && ea.shift();
        if (e = (t.ownerDocument || t).$$reactFormReplay,
        e != null)
            for (a = 0; a < e.length; a += 3) {
                var u = e[a]
                  , n = e[a + 1]
                  , c = u[Tl] || null;
                if (typeof n == "function")
                    c || I0(e);
                else if (c) {
                    var f = null;
                    if (n && n.hasAttribute("formAction")) {
                        if (u = n,
                        c = n[Tl] || null)
                            f = c.formAction;
                        else if (Qf(u) !== null)
                            continue
                    } else
                        f = c.action;
                    typeof f == "function" ? e[a + 1] = f : (e.splice(a, 3),
                    a -= 3),
                    I0(e)
                }
            }
    }
    function P0() {
        function t(n) {
            n.canIntercept && n.info === "react-transition" && n.intercept({
                handler: function() {
                    return new Promise(function(c) {
                        return u = c
                    }
                    )
                },
                focusReset: "manual",
                scroll: "manual"
            })
        }
        function l() {
            u !== null && (u(),
            u = null),
            a || setTimeout(e, 20)
        }
        function e() {
            if (!a && !navigation.transition) {
                var n = navigation.currentEntry;
                n && n.url != null && navigation.navigate(n.url, {
                    state: n.getState(),
                    info: "react-transition",
                    history: "replace"
                })
            }
        }
        if (typeof navigation == "object") {
            var a = !1
              , u = null;
            return navigation.addEventListener("navigate", t),
            navigation.addEventListener("navigatesuccess", l),
            navigation.addEventListener("navigateerror", l),
            setTimeout(e, 100),
            function() {
                a = !0,
                navigation.removeEventListener("navigate", t),
                navigation.removeEventListener("navigatesuccess", l),
                navigation.removeEventListener("navigateerror", l),
                u !== null && (u(),
                u = null)
            }
        }
    }
    function xf(t) {
        this._internalRoot = t
    }
    _i.prototype.render = xf.prototype.render = function(t) {
        var l = this._internalRoot;
        if (l === null)
            throw Error(o(409));
        var e = l.current
          , a = ql();
        x0(e, a, t, l, null, null)
    }
    ,
    _i.prototype.unmount = xf.prototype.unmount = function() {
        var t = this._internalRoot;
        if (t !== null) {
            this._internalRoot = null;
            var l = t.containerInfo;
            x0(t.current, 2, null, t, null, null),
            ni(),
            l[Na] = null
        }
    }
    ;
    function _i(t) {
        this._internalRoot = t
    }
    _i.prototype.unstable_scheduleHydration = function(t) {
        if (t) {
            var l = fo();
            t = {
                blockedOn: null,
                target: t,
                priority: l
            };
            for (var e = 0; e < ea.length && l !== 0 && l < ea[e].priority; e++)
                ;
            ea.splice(e, 0, t),
            e === 0 && F0(t)
        }
    }
    ;
    var td = s.version;
    if (td !== "19.2.6")
        throw Error(o(527, td, "19.2.6"));
    H.findDOMNode = function(t) {
        var l = t._reactInternals;
        if (l === void 0)
            throw typeof t.render == "function" ? Error(o(188)) : (t = Object.keys(t).join(","),
            Error(o(268, t)));
        return t = v(l),
        t = t !== null ? N(t) : null,
        t = t === null ? null : t.stateNode,
        t
    }
    ;
    var qy = {
        bundleType: 0,
        version: "19.2.6",
        rendererPackageName: "react-dom",
        currentDispatcherRef: O,
        reconcilerVersion: "19.2.6"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
        var zi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!zi.isDisabled && zi.supportsFiber)
            try {
                ae = zi.inject(qy),
                ft = zi
            } catch {}
    }
    return on.createRoot = function(t, l) {
        if (!S(t))
            throw Error(o(299));
        var e = !1
          , a = ""
          , u = cr
          , n = fr
          , c = or;
        return l != null && (l.unstable_strictMode === !0 && (e = !0),
        l.identifierPrefix !== void 0 && (a = l.identifierPrefix),
        l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
        l.onCaughtError !== void 0 && (n = l.onCaughtError),
        l.onRecoverableError !== void 0 && (c = l.onRecoverableError)),
        l = Q0(t, 1, !1, null, null, e, a, null, u, n, c, P0),
        t[Na] = l.current,
        _f(t),
        new xf(l)
    }
    ,
    on.hydrateRoot = function(t, l, e) {
        if (!S(t))
            throw Error(o(299));
        var a = !1
          , u = ""
          , n = cr
          , c = fr
          , f = or
          , r = null;
        return e != null && (e.unstable_strictMode === !0 && (a = !0),
        e.identifierPrefix !== void 0 && (u = e.identifierPrefix),
        e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
        e.onCaughtError !== void 0 && (c = e.onCaughtError),
        e.onRecoverableError !== void 0 && (f = e.onRecoverableError),
        e.formState !== void 0 && (r = e.formState)),
        l = Q0(t, 1, !0, l, e ?? null, a, u, r, n, c, f, P0),
        l.context = Z0(null),
        e = l.current,
        a = ql(),
        a = Hi(a),
        u = Ve(a),
        u.callback = null,
        Qe(e, u, a),
        e = a,
        l.current.lanes = e,
        gu(l, e),
        fe(l),
        t[Na] = l.current,
        _f(t),
        new _i(l)
    }
    ,
    on.version = "19.2.6",
    on
}
var sd;
function ky() {
    if (sd)
        return wf.exports;
    sd = 1;
    function i() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)
            } catch (s) {
                console.error(s)
            }
    }
    return i(),
    wf.exports = wy(),
    wf.exports
}
var Wy = ky();
const Fy = W.forwardRef(function({onTap: s}, y) {
    return lt.jsxs(lt.Fragment, {
        children: [lt.jsx("canvas", {
            ref: y,
            className: "canvas"
        }), lt.jsx("div", {
            className: "tap-layer",
            onPointerDown: o => {
                o.preventDefault(),
                s()
            }
            ,
            onContextMenu: o => o.preventDefault()
        })]
    })
});
function $y({payload: i, onRetry: s}) {
    const y = i != null;
    return lt.jsx("div", {
        className: `modal-backdrop${y ? " show" : ""}`,
        "aria-hidden": !y,
        "aria-live": "polite",
        children: lt.jsxs("div", {
            className: "modal-card",
            role: "dialog",
            "aria-modal": "true",
            children: [lt.jsx("div", {
                className: "modal-eyebrow",
                children: "Round Over"
            }), lt.jsx("div", {
                className: "modal-title",
                children: i?.score ?? 0
            }), i?.isNewRecord && lt.jsx("div", {
                className: "modal-badge",
                children: "New Record"
            }), lt.jsxs("div", {
                className: "modal-row",
                children: [lt.jsxs("div", {
                    className: "modal-cell",
                    children: [lt.jsx("div", {
                        className: "k",
                        children: "Best"
                    }), lt.jsx("div", {
                        className: "v",
                        children: i?.best ?? 0
                    })]
                }), lt.jsxs("div", {
                    className: "modal-cell",
                    children: [lt.jsx("div", {
                        className: "k",
                        children: "Clean %"
                    }), lt.jsxs("div", {
                        className: "v",
                        children: [i?.cleanShotPct ?? 0, "%"]
                    })]
                })]
            }), lt.jsx("button", {
                type: "button",
                className: "modal-cta",
                onPointerDown: o => o.stopPropagation(),
                onClick: o => {
                    o.stopPropagation(),
                    s()
                }
                ,
                children: "Tap to Retry"
            })]
        })
    })
}
function Iy(i) {
    return i <= .25 ? "danger" : i <= .5 ? "warn" : ""
}
function Py({score: i, best: s, hotStreak: y, timerFraction: o, hasScored: S}) {
    const A = W.useRef(null)
      , D = W.useRef(i);
    W.useEffect( () => {
        if (i === D.current)
            return;
        D.current = i;
        const p = A.current;
        p && (p.classList.remove("score-pop"),
        p.offsetWidth,
        p.classList.add("score-pop"))
    }
    , [i]);
    const Y = Iy(o);
    return lt.jsxs("div", {
        className: "hud",
        children: [lt.jsxs("div", {
            className: "hud-row",
            children: [lt.jsxs("div", {
                className: "pill",
                ref: A,
                children: [lt.jsx("span", {
                    className: "label",
                    children: "Score"
                }), lt.jsx("span", {
                    className: "value",
                    children: i
                })]
            }), lt.jsxs("div", {
                className: "pill",
                children: [lt.jsx("span", {
                    className: "label",
                    children: "Best"
                }), lt.jsx("span", {
                    className: "value",
                    children: s
                })]
            })]
        }), lt.jsx("div", {
            className: `timer-shell${S ? " show" : ""}`,
            "aria-hidden": !S,
            children: lt.jsx("div", {
                className: `timer-fill ${Y}`,
                style: {
                    width: `${Math.max(0, Math.min(1, o)) * 100}%`
                }
            })
        }), y >= 2 && lt.jsx("div", {
            className: "hud-row",
            style: {
                justifyContent: "center"
            },
            children: lt.jsxs("div", {
                className: "pill hot",
                children: [lt.jsx("span", {
                    className: "label",
                    children: "Hot Streak"
                }), lt.jsxs("span", {
                    className: "value",
                    children: ["x", y]
                })]
            })
        })]
    })
}
function th({muted: i, onToggle: s}) {
    return lt.jsxs("button", {
        type: "button",
        className: "pill interactive",
        "aria-pressed": i,
        "aria-label": i ? "Unmute" : "Mute",
        onPointerDown: y => {
            y.stopPropagation()
        }
        ,
        onClick: y => {
            y.stopPropagation(),
            s()
        }
        ,
        style: {
            pointerEvents: "auto"
        },
        children: [lt.jsx("span", {
            className: "label",
            children: i ? "Muted" : "Sound"
        }), lt.jsx("span", {
            className: "value",
            style: {
                fontSize: 16
            },
            children: i ? "off" : "on"
        })]
    })
}
const Z = Object.freeze({
    CANVAS_WIDTH: 720,
    CANVAS_HEIGHT: 1280,
    BALL_SIZE: 60,
    BALL_RADIUS: 30,
    HOOP_WIDTH: 120,
    COUNTDOWN_TIME: 6,
    MAX_DELTA_TIME: .1,
    PIXELS_PER_METER: 100,
    GRAVITY: 980,
    JUMP_FORCE: 600,
    HORIZONTAL_FORCE: 300,
    AIR_DRAG: .15,
    FLOOR_FRICTION: .6,
    BOUNCE_COEF: .7,
    SOFT_RIM_THRESHOLD: -150,
    MIN_H_SPEED: 50,
    FLOOR_OFFSET: 0,
    SLOW_MOTION_TARGET: .5,
    SLOW_MOTION_LERP: 3,
    GAME_OVER_DELAY: .2,
    HOOP_SLIDE_DURATION: .3,
    RIM_TILT_SPRING: .08,
    RIM_TILT_DAMPING: .92,
    RIM_TILT_MAX: .12
})
  , le = Object.freeze({
    backboard: Object.freeze({
        offsetX: 12,
        offsetTop: 80,
        width: 24,
        height: 200
    }),
    rimLeft: Object.freeze({
        offsetY: 60,
        thickness: 8,
        width: 15,
        offsetFromBackboard: 12
    }),
    rimRight: Object.freeze({
        offsetY: 60,
        thickness: 8,
        width: 15,
        gap: 95
    }),
    scoringZone: Object.freeze({
        offsetY: 65,
        height: 40,
        width: 70,
        offsetFromLeftRim: 15
    })
})
  , rd = Object.freeze([Object.freeze({
    minScore: 0,
    minY: 380,
    maxY: 760
}), Object.freeze({
    minScore: 5,
    minY: 320,
    maxY: 800
}), Object.freeze({
    minScore: 15,
    minY: 280,
    maxY: 840
}), Object.freeze({
    minScore: 30,
    minY: 240,
    maxY: 880
}), Object.freeze({
    minScore: 60,
    minY: 220,
    maxY: 900
})])
  , ml = Object.freeze({
    bg: "#1a1410",
    bgFar: "#0c0907",
    bgSpot: "rgba(255,224,180,0.10)",
    bgFloor: "#a87740",
    bgFloorEdge: "#7b5024",
    bgFloorDeep: "#4a2f15",
    courtLine: "rgba(255,240,210,0.30)",
    plank: "rgba(0,0,0,0.10)",
    ball: "#d4682a",
    ballHi: "#f0a064",
    ballLo: "#6a2c0c",
    ballSeam: "#1b0e07",
    backboard: "#f5f3eb",
    backboardEdge: "#bcb9ad",
    backboardRed: "#c4321c",
    bracket: "#2c2a28",
    rim: "#e0641a",
    rimHi: "#f3a361",
    rimLo: "#6b2a08",
    rimGlow: "rgba(0,0,0,0)",
    netFar: "rgba(245,243,234,0.55)",
    netNear: "rgba(245,243,234,0.92)",
    accent: "#f3c14d",
    accentHot: "#c8341e",
    accentSwish: "#f5f3eb",
    textOnDark: "#f7f3ea",
    textDim: "rgba(247,243,234,0.65)"
});
let yu = null
  , te = null
  , dd = !1
  , gd = !1;
function Sd() {
    if (yu)
        return yu;
    try {
        const i = window.AudioContext || window.webkitAudioContext;
        return i ? (yu = new i,
        te = yu.createGain(),
        te.gain.value = gd ? 0 : .85,
        te.connect(yu.destination),
        yu) : null
    } catch {
        return null
    }
}
function lh() {
    const i = Sd();
    !i || dd || (i.state === "suspended" && i.resume(),
    dd = !0)
}
function eh(i) {
    gd = i,
    te && (te.gain.value = i ? 0 : .85)
}
function Mi(i, s, y, o) {
    const S = i.createGain()
      , A = i.currentTime;
    return S.gain.setValueAtTime(0, A),
    S.gain.linearRampToValueAtTime(o, A + s / 1e3),
    S.gain.exponentialRampToValueAtTime(1e-4, A + (s + y) / 1e3),
    S
}
function _a(i) {
    const s = Sd();
    if (!s || !te || s.state === "suspended")
        return;
    const y = s.currentTime;
    switch (i) {
    case "tap":
        {
            const S = Math.floor(s.sampleRate * .06)
              , A = s.createBuffer(1, S, s.sampleRate)
              , D = A.getChannelData(0);
            for (let N = 0; N < S; N++) {
                const U = N / S;
                D[N] = (Math.random() * 2 - 1) * (1 - U) * .55
            }
            const Y = s.createBufferSource();
            Y.buffer = A;
            const p = s.createBiquadFilter();
            p.type = "lowpass",
            p.frequency.value = 1800,
            p.Q.value = .6;
            const v = Mi(s, 2, .06 * 1e3, .22);
            Y.connect(p).connect(v).connect(te),
            Y.start(y),
            Y.stop(y + .06 + .02);
            break
        }
    case "swoosh":
        {
            const S = Math.floor(s.sampleRate * .32)
              , A = s.createBuffer(1, S, s.sampleRate)
              , D = A.getChannelData(0);
            for (let N = 0; N < S; N++) {
                const U = N / S;
                D[N] = (Math.random() * 2 - 1) * (1 - U) * .6
            }
            const Y = s.createBufferSource();
            Y.buffer = A;
            const p = s.createBiquadFilter();
            p.type = "bandpass",
            p.frequency.setValueAtTime(800, y),
            p.frequency.exponentialRampToValueAtTime(3200, y + .32),
            p.Q.value = 1.4;
            const v = Mi(s, 12, .32 * 1e3, .55);
            Y.connect(p).connect(v).connect(te),
            Y.start(y),
            Y.stop(y + .32 + .05);
            break
        }
    case "bounce":
        {
            const S = Math.floor(s.sampleRate * .03)
              , A = s.createBuffer(1, S, s.sampleRate)
              , D = A.getChannelData(0);
            for (let V = 0; V < S; V++) {
                const J = V / S;
                D[V] = (Math.random() * 2 - 1) * (1 - J)
            }
            const Y = s.createBufferSource();
            Y.buffer = A;
            const p = s.createBiquadFilter();
            p.type = "lowpass",
            p.frequency.value = 1200,
            p.Q.value = 1.2;
            const v = Mi(s, 1, 28, .55);
            Y.connect(p).connect(v).connect(te),
            Y.start(y),
            Y.stop(y + .05);
            const N = s.createOscillator();
            N.type = "sine",
            N.frequency.setValueAtTime(95, y),
            N.frequency.exponentialRampToValueAtTime(48, y + .16);
            const U = Mi(s, 1, .16 * 1e3, .6);
            N.connect(U).connect(te),
            N.start(y),
            N.stop(y + .16 + .02);
            break
        }
    case "gameOver":
        {
            const A = s.createOscillator();
            A.type = "sawtooth",
            A.frequency.value = 220;
            const D = s.createOscillator();
            D.type = "sawtooth",
            D.frequency.value = 220 * .5;
            const Y = s.createOscillator();
            Y.type = "sawtooth",
            Y.frequency.value = 220 * 1.005;
            const p = s.createBiquadFilter();
            p.type = "lowpass",
            p.frequency.value = 1100,
            p.Q.value = .6;
            const v = s.createGain();
            v.gain.setValueAtTime(0, y),
            v.gain.linearRampToValueAtTime(.36, y + .04),
            v.gain.linearRampToValueAtTime(.34, y + .65 - .1),
            v.gain.exponentialRampToValueAtTime(1e-4, y + .65),
            A.connect(p),
            D.connect(p),
            Y.connect(p),
            p.connect(v).connect(te),
            A.start(y),
            D.start(y),
            Y.start(y),
            A.stop(y + .65 + .05),
            D.stop(y + .65 + .05),
            Y.stop(y + .65 + .05);
            break
        }
    }
}
var ao = class extends Error {
    code;
    cause;
    constructor(i, s, y) {
        super(s ?? i),
        this.name = "PlayablError",
        this.code = i,
        this.cause = y
    }
}
, ah = () => import(uh).then(i => i.default), uh = "https://cdn.playabl.ai/Runtime-Script/sdk/v1/runtime.js", nh = ah, $f, bd;
async function xt() {
    if (typeof window > "u")
        throw new ao("SDK_NOT_READY","Playabl SDK runtime can only be loaded in a browser.");
    return $f ??= nh().then(i => (bd = i,
    i), i => {
        throw $f = void 0,
        new ao("SDK_NOT_READY","Playabl SDK runtime could not be loaded.",i)
    }
    ),
    $f
}
function Ue() {
    return bd
}
var ih = {
    ready: async () => (await xt()).ready(),
    leaderboard: {
        submit: async i => (await xt()).leaderboard.submit(i)
    },
    gameState: {
        save: async i => (await xt()).gameState.save(i),
        load: async () => (await xt()).gameState.load(),
        clear: async () => (await xt()).gameState.clear()
    },
    tweaks: {
        init: async i => (await xt()).tweaks.init(i)
    },
    assets: {
        register: async i => (await xt()).assets.register(i)
    },
    device: {
        haptics: {
            isSupported: () => {
                const i = Ue();
                return i ? i.device.haptics.isSupported() : !1
            }
            ,
            vibrate: async i => (await xt()).device.haptics.vibrate(i),
            cancel: async () => (await xt()).device.haptics.cancel()
        },
        camera: {
            isSupported: () => {
                const i = Ue();
                return i ? i.device.camera.isSupported() : !1
            }
            ,
            getStream: async i => (await xt()).device.camera.getStream(i),
            capturePhoto: async i => (await xt()).device.camera.capturePhoto(i),
            stopStream: () => {
                const i = Ue();
                i && i.device.camera.stopStream()
            }
        },
        geolocation: {
            isSupported: () => {
                const i = Ue();
                return i ? i.device.geolocation.isSupported() : !1
            }
            ,
            getCurrentPosition: async i => (await xt()).device.geolocation.getCurrentPosition(i),
            watchPosition: (i, s) => {
                let y = null
                  , o = !1;
                return xt().then(S => {
                    o || (y = S.device.geolocation.watchPosition(i, s))
                }
                ),
                () => {
                    o = !0,
                    y && y()
                }
            }
        },
        fileSystem: {
            isSupported: () => {
                const i = Ue();
                return i ? i.device.fileSystem.isSupported() : !1
            }
            ,
            isLegacySupported: () => {
                const i = Ue();
                return i ? i.device.fileSystem.isLegacySupported() : !1
            }
            ,
            openFile: async i => (await xt()).device.fileSystem.openFile(i),
            saveFile: async (i, s) => (await xt()).device.fileSystem.saveFile(i, s),
            readAsText: async i => (await xt()).device.fileSystem.readAsText(i),
            readAsDataURL: async i => (await xt()).device.fileSystem.readAsDataURL(i)
        },
        sensors: {
            isMotionSupported: () => {
                const i = Ue();
                return i ? i.device.sensors.isMotionSupported() : !1
            }
            ,
            isOrientationSupported: () => {
                const i = Ue();
                return i ? i.device.sensors.isOrientationSupported() : !1
            }
            ,
            requestMotionPermission: async () => (await xt()).device.sensors.requestMotionPermission(),
            watchMotion: (i, s) => {
                let y = null
                  , o = !1;
                return xt().then(S => {
                    o || (y = S.device.sensors.watchMotion(i, s))
                }
                ),
                () => {
                    o = !0,
                    y && y()
                }
            }
            ,
            watchOrientation: i => {
                let s = null
                  , y = !1;
                return xt().then(o => {
                    y || (s = o.device.sensors.watchOrientation(i))
                }
                ),
                () => {
                    y = !0,
                    s && s()
                }
            }
        }
    },
    audio: {
        isSupported: () => {
            const i = Ue();
            return i ? i.audio.isSupported() : !1
        }
        ,
        getContext: async i => (await xt()).audio.getContext(i),
        createContext: async i => (await xt()).audio.createContext(i)
    }
}
  , ia = ih;
const ch = {
    type: "color",
    value: "#dcc89c",
    name: "Page background",
    description: "Color shown behind the game canvas / arena.",
    group: "scene",
    index: 0
}
  , fh = {
    type: "color",
    value: "#e0641a",
    name: "Accent color",
    description: "Primary accent applied to UI pills and CTAs.",
    group: "scene",
    index: 1
}
  , oh = {
    type: "boolean",
    value: !0,
    name: "Haptics",
    description: "Vibrate on clean shots and hot streaks (when supported).",
    group: "feel",
    index: 2
}
  , sh = {
    type: "boolean",
    value: !1,
    name: "Debug mode",
    description: "Logs SDK + gameplay diagnostics to the console.",
    group: "debug",
    index: 10
}
  , md = {
    backgroundColor: ch,
    accentColor: fh,
    hapticsEnabled: oh,
    debugMode: sh
}
  , If = {}
  , Td = {
    version: 1,
    highScore: 0,
    muted: !1
}
  , rh = 1500;
let Pf = null
  , to = null
  , lo = null
  , pd = 0
  , yd = -1 / 0
  , sn = null
  , Di = !1
  , Ed = !0;
function ca(...i) {
    Di && console.warn("[playabl]", ...i)
}
function za(i) {
    return i instanceof ao ? `${i.code}: ${i.message}` : i instanceof Error ? i.message : String(i)
}
function Ma() {
    return Pf || (Pf = ia.ready().then(i => {
        Di && console.info("[playabl] ready", i.isLocalDev ? "(local dev)" : i.parentOrigin)
    }
    ).catch(i => {
        ca("ready failed:", za(i))
    }
    )),
    Pf
}
function dh() {
    return to || (to = (async () => (await Ma(),
    ia.tweaks.init(md)))().catch(i => (ca("tweaks init failed:", za(i)),
    ph(md)))),
    to
}
function mh() {
    return lo || (lo = (async () => (await Ma(),
    ia.assets.register(If)))().catch(i => (ca("assets register failed:", za(i)),
    {
        get: y => If[y] ?? "",
        getReplacedUrl: y => y,
        snapshot: () => ({
            ...If
        })
    }))),
    lo
}
function yh(i, s=!1) {
    if (!Number.isFinite(i))
        return;
    const y = Date.now()
      , o = rh - (y - pd);
    if (s || o <= 0) {
        hd(i);
        return
    }
    if (sn) {
        sn.score = i;
        return
    }
    sn = {
        score: i,
        timer: window.setTimeout( () => {
            const S = sn;
            sn = null,
            S && hd(S.score)
        }
        , o)
    }
}
function hd(i) {
    i <= yd || (pd = Date.now(),
    yd = i,
    Ma().then( () => ia.leaderboard.submit(i)).then(s => {
        Di && console.info("[playabl] leaderboard", i, s)
    }
    ).catch(s => ca("leaderboard submit failed:", za(s))))
}
function hh(i) {
    Ed && Ma().then( () => {
        if (ia.device.haptics.isSupported())
            return ia.device.haptics.vibrate(i)
    }
    ).catch(s => ca("vibrate failed:", za(s)))
}
async function vh() {
    try {
        await Ma();
        const i = await ia.gameState.load();
        return Th(i)
    } catch (i) {
        return ca("save load failed:", za(i)),
        {
            ...Td
        }
    }
}
async function gh(i) {
    try {
        await Ma();
        const s = await ia.gameState.save(i);
        s.ok || ca("save not ok:", s.error?.code)
    } catch (s) {
        ca("save write failed:", za(s))
    }
}
function Sh(i) {
    Di = i
}
function bh(i) {
    Ed = i
}
function Th(i) {
    return !i || typeof i != "object" ? {
        ...Td
    } : {
        version: 1,
        highScore: typeof i.highScore == "number" && i.highScore >= 0 ? i.highScore : 0,
        muted: typeof i.muted == "boolean" ? i.muted : !1
    }
}
function ph(i) {
    const s = {};
    for (const y of Object.keys(i))
        s[y] = i[y].value;
    return {
        values: s,
        get: y => s[y],
        subscribe: () => () => {}
        ,
        onChange: () => () => {}
        ,
        snapshot: () => ({
            ...s
        })
    }
}
const Eh = () => ({
    backboard: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    rimLeft: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    rimRight: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    corner: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    hoopSide: "right"
});
function Ah(i, s, y, o) {
    const {backboard: S, rimLeft: A, rimRight: D} = le;
    i.backboard.left = s - S.offsetX,
    i.backboard.right = s + S.offsetX,
    i.backboard.top = y - S.offsetTop,
    i.backboard.bottom = y + (S.height - S.offsetTop),
    i.hoopSide = o,
    i.rimLeft.top = y + A.offsetY,
    i.rimLeft.bottom = y + A.offsetY + A.thickness,
    o === "right" ? (i.rimLeft.left = s - A.width - A.offsetFromBackboard,
    i.rimLeft.right = s - A.offsetFromBackboard) : (i.rimLeft.left = s + A.offsetFromBackboard,
    i.rimLeft.right = s + A.width + A.offsetFromBackboard),
    i.rimRight.top = y + D.offsetY,
    i.rimRight.bottom = y + D.offsetY + D.thickness,
    o === "right" ? (i.rimRight.left = s - D.width - D.gap - A.offsetFromBackboard,
    i.rimRight.right = s - D.gap - A.offsetFromBackboard) : (i.rimRight.left = s + D.gap + A.offsetFromBackboard,
    i.rimRight.right = s + D.width + D.gap + A.offsetFromBackboard),
    i.corner.top = i.rimLeft.top - 10,
    i.corner.bottom = i.rimLeft.bottom + 10,
    o === "right" ? (i.corner.left = i.rimLeft.right - 5,
    i.corner.right = i.backboard.left + 5) : (i.corner.left = i.backboard.right - 5,
    i.corner.right = i.rimLeft.left + 5)
}
function Oh(i, s, y, o, S, A, D, Y) {
    const p = y - i
      , v = o - s;
    let N, U, V, J;
    if (Math.abs(p) > 1e-4) {
        const nt = 1 / p
          , I = (S - i) * nt
          , qt = (D - i) * nt;
        N = Math.min(I, qt),
        U = Math.max(I, qt)
    } else {
        if (i < S || i > D)
            return -1;
        N = -1 / 0,
        U = 1 / 0
    }
    if (Math.abs(v) > 1e-4) {
        const nt = 1 / v
          , I = (A - s) * nt
          , qt = (Y - s) * nt;
        V = Math.min(I, qt),
        J = Math.max(I, qt)
    } else {
        if (s < A || s > Y)
            return -1;
        V = -1 / 0,
        J = 1 / 0
    }
    const ct = Math.max(N, V)
      , ht = Math.min(U, J);
    return ct > ht || ht < 0 || ct > 1 ? -1 : Math.max(0, ct)
}
function _h(i, s, y, o, S, A) {
    const D = y - i
      , Y = o - s;
    if (y + S > A.left && y - S < A.right && o + S > A.top && o - S < A.bottom) {
        const rt = y + S - A.left
          , F = A.right - (y - S)
          , Ut = o + S - A.top
          , wt = A.bottom - (o - S)
          , Ml = Math.min(rt, F)
          , il = Math.min(Ut, wt);
        let Gt, yl = 0, kt = 0, Wt = y, O = o, H = !1;
        return Ml < il ? rt < F ? (Gt = "left",
        yl = -1,
        Wt = A.left - S - .1,
        H = D > 0) : (Gt = "right",
        yl = 1,
        Wt = A.right + S + .1,
        H = D < 0) : Ut < wt ? (Gt = "top",
        kt = -1,
        O = A.top - S - .1,
        H = Y > 0) : (Gt = "bottom",
        kt = 1,
        O = A.bottom + S + .1,
        H = Y < 0),
        H || (yl = 0,
        kt = 0),
        {
            t: 0,
            x: Wt,
            y: O,
            face: Gt,
            normalX: yl,
            normalY: kt
        }
    }
    const v = {
        left: A.left - S,
        right: A.right + S,
        top: A.top - S,
        bottom: A.bottom + S
    }
      , N = Oh(i, s, y, o, v.left, v.top, v.right, v.bottom);
    if (N < 0)
        return null;
    const U = i + (y - i) * N
      , V = s + (o - s) * N
      , J = Math.abs(U - A.left)
      , ct = Math.abs(U - A.right)
      , ht = Math.abs(V - A.top)
      , nt = Math.abs(V - A.bottom)
      , I = Math.min(J, ct)
      , qt = Math.min(ht, nt);
    let bt, Ct = 0, pt = 0;
    return I < qt ? D > 0 ? (bt = "left",
    Ct = -1) : (bt = "right",
    Ct = 1) : Y > 0 ? (bt = "top",
    pt = -1) : (bt = "bottom",
    pt = 1),
    {
        t: N,
        x: U,
        y: V,
        face: bt,
        normalX: Ct,
        normalY: pt
    }
}
const Pl = Z.CANVAS_HEIGHT - Z.FLOOR_OFFSET
  , Nt = Z.CANVAS_WIDTH
  , el = Z.CANVAS_HEIGHT
  , dn = el - Z.FLOOR_OFFSET;
function zh(i) {
    let s = i >>> 0;
    return () => {
        s = s + 1831565813 >>> 0;
        let y = s;
        return y = Math.imul(y ^ y >>> 15, y | 1),
        y ^= y + Math.imul(y ^ y >>> 7, y | 61),
        ((y ^ y >>> 14) >>> 0) / 4294967296
    }
}
const Ad = .18
  , Mh = .52
  , Rh = .44
  , Dh = .48
  , Od = .52;
let eo = null;
function Nh() {
    if (eo)
        return eo;
    const i = zh(2594659345)
      , s = [];
    let o = el * Od;
    for (; o < el; ) {
        const S = 22 + i() * 18;
        s.push({
            y: o,
            height: Math.min(S, el - o),
            shade: -.06 + i() * .12
        }),
        o += S
    }
    return eo = s
}
function Ch(i) {
    const s = el * Ad
      , y = i.createLinearGradient(0, 0, 0, s);
    y.addColorStop(0, "#9a8a6a"),
    y.addColorStop(.6, "#c5b58e"),
    y.addColorStop(1, "#dccba2"),
    i.fillStyle = y,
    i.fillRect(0, 0, Nt, s),
    i.strokeStyle = "rgba(80,60,30,0.35)",
    i.lineWidth = 1;
    const o = 6
      , S = 3;
    for (let p = 1; p < o; p++) {
        const v = p / o * Nt;
        i.beginPath(),
        i.moveTo(v, 0),
        i.lineTo(v, s),
        i.stroke()
    }
    for (let p = 1; p < S; p++) {
        const v = p / S * s;
        i.beginPath(),
        i.moveTo(0, v),
        i.lineTo(Nt, v),
        i.stroke()
    }
    const A = Nt / o
      , D = s / S
      , Y = [[0, 1], [2, 1], [4, 1], [1, 0], [3, 0], [5, 0], [1, 2], [3, 2], [5, 2]];
    for (const [p,v] of Y) {
        const N = p * A + A * .18
          , U = v * D + D * .28
          , V = A * .64
          , J = D * .44;
        i.fillStyle = "#fff3c8",
        i.fillRect(N, U, V, J);
        const ct = i.createRadialGradient(N + V / 2, U + J / 2, V * .1, N + V / 2, U + J / 2, V * 1.4);
        ct.addColorStop(0, "rgba(255,240,180,0.45)"),
        ct.addColorStop(1, "rgba(255,240,180,0)"),
        i.fillStyle = ct,
        i.fillRect(N - V, U - J * .6, V * 3, J * 2.2),
        i.strokeStyle = "rgba(40,30,15,0.4)",
        i.lineWidth = 1,
        i.strokeRect(N, U, V, J)
    }
}
function Uh(i) {
    const s = el * Ad
      , y = el * Mh
      , o = y - s
      , S = i.createLinearGradient(0, s, 0, y);
    S.addColorStop(0, "#c5b58e"),
    S.addColorStop(.5, "#d8c89f"),
    S.addColorStop(1, "#cdbb91"),
    i.fillStyle = S,
    i.fillRect(0, s, Nt, o),
    i.strokeStyle = "rgba(80,60,30,0.18)",
    i.lineWidth = 1;
    const A = 28;
    for (let N = s + A; N < y; N += A)
        i.beginPath(),
        i.moveTo(0, N),
        i.lineTo(Nt, N),
        i.stroke();
    const D = 60;
    for (let N = 0; N < Math.ceil(o / A); N++) {
        const U = s + N * A
          , V = N % 2 ? D / 2 : 0;
        for (let J = V; J < Nt; J += D)
            i.beginPath(),
            i.moveTo(J, U),
            i.lineTo(J, U + A),
            i.stroke()
    }
    Hh(i, s, o);
    const Y = el * Rh
      , p = el * Dh
      , v = p - Y;
    i.fillStyle = "#7e9a82",
    i.fillRect(0, Y, Nt, v),
    i.fillStyle = "rgba(255,255,255,0.18)",
    i.fillRect(0, Y, Nt, 2),
    i.fillStyle = "#1a1612",
    i.fillRect(0, p, Nt, 2)
}
function Hh(i, s, y) {
    const o = s + y * .12
      , S = y * .22;
    vd(i, Nt * .06, o, Nt * .36, S, 3),
    vd(i, Nt * .52, o, Nt * .3, S, 2)
}
function vd(i, s, y, o, S, A) {
    i.fillStyle = "#8a7858",
    i.fillRect(s - 2, y - 2, o + 4, S + 4);
    const D = (o - (A + 1) * 3) / A;
    for (let Y = 0; Y < A; Y++) {
        const p = s + 3 + Y * (D + 3)
          , v = i.createLinearGradient(p, y, p, y + S);
        v.addColorStop(0, "#aab3a4"),
        v.addColorStop(1, "#909a8e"),
        i.fillStyle = v,
        i.fillRect(p, y, D, S),
        i.save(),
        i.beginPath(),
        i.rect(p, y, D, S),
        i.clip(),
        i.fillStyle = "rgba(255,255,255,0.12)",
        i.beginPath(),
        i.moveTo(p - S, y),
        i.lineTo(p - S + S * 1.4, y),
        i.lineTo(p + S * 1.4, y + S),
        i.lineTo(p, y + S),
        i.closePath(),
        i.fill(),
        i.restore(),
        i.fillStyle = "#7a6a4a",
        i.fillRect(p, y + S * .5 - 1, D, 2)
    }
    i.fillStyle = "rgba(0,0,0,0.25)",
    i.fillRect(s - 2, y - 2, o + 4, 2),
    i.fillRect(s - 2, y + S, o + 4, 2)
}
function Bh(i) {
    const s = el * Od
      , y = i.createLinearGradient(0, s, 0, el);
    y.addColorStop(0, "#c98a47"),
    y.addColorStop(.5, "#a86a2c"),
    y.addColorStop(1, "#7a4818"),
    i.fillStyle = y,
    i.fillRect(0, s, Nt, el - s);
    const o = i.createLinearGradient(0, s, 0, s + 60);
    o.addColorStop(0, "rgba(20,10,4,0.55)"),
    o.addColorStop(1, "rgba(20,10,4,0)"),
    i.fillStyle = o,
    i.fillRect(0, s, Nt, 60);
    const S = i.createRadialGradient(Nt * .5, s - el * .05, 20, Nt * .5, s - el * .05, el * .9);
    S.addColorStop(0, "rgba(255,220,160,0.18)"),
    S.addColorStop(1, "rgba(255,220,160,0)"),
    i.fillStyle = S,
    i.fillRect(0, s, Nt, el - s);
    const A = Nh();
    for (const D of A)
        D.shade > 0 && (i.fillStyle = `rgba(40,20,8,${D.shade * .7})`,
        i.fillRect(0, D.y, Nt, D.height)),
        i.strokeStyle = "rgba(40,20,8,0.45)",
        i.lineWidth = 1.2,
        i.beginPath(),
        i.moveTo(0, D.y + .5),
        i.lineTo(Nt, D.y + .5),
        i.stroke();
    i.strokeStyle = "rgba(40,20,8,0.4)";
    for (let D = 0; D < A.length; D++) {
        const Y = A[D]
          , p = D % 2 * 120;
        for (let v = p; v < Nt; v += 240)
            i.beginPath(),
            i.moveTo(v, Y.y),
            i.lineTo(v, Y.y + Y.height),
            i.stroke()
    }
    Yh(i, s)
}
function Yh(i, s) {
    i.save(),
    i.strokeStyle = "rgba(255,255,255,0.7)",
    i.lineWidth = 3,
    i.beginPath(),
    i.moveTo(0, s + 5),
    i.lineTo(Nt, s + 5),
    i.stroke(),
    i.beginPath(),
    i.moveTo(Nt * .5, s + 5),
    i.lineTo(Nt * .5, el),
    i.stroke(),
    i.beginPath(),
    i.ellipse(Nt * .5, el * .75, Nt * .35, el * .12, 0, 0, Math.PI * 2),
    i.stroke(),
    i.restore()
}
function qh(i, s) {
    Ch(i),
    Uh(i),
    Bh(i)
}
function Gh(i, s, y, o) {
    const S = dn - y
      , A = dn * .6
      , D = Math.max(0, Math.min(1, S / A))
      , Y = 1 - D * .5
      , p = .45 * (1 - D * .7)
      , v = o * 1.25 * Y
      , N = o * .32 * Y;
    i.save(),
    i.globalAlpha = p,
    i.fillStyle = "#000",
    i.beginPath(),
    i.ellipse(s, dn - 2, v, N, 0, 0, Math.PI * 2),
    i.fill(),
    i.restore()
}
const ua = 256;
let na = null
  , Ri = !1;
function _d() {
    if (Ri && na)
        return na;
    if (typeof document > "u")
        return null;
    na || (na = document.createElement("canvas"),
    na.width = ua,
    na.height = ua);
    const i = na.getContext("2d");
    if (!i)
        return null;
    i.clearRect(0, 0, ua, ua),
    i.font = '220px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif',
    i.textAlign = "center",
    i.textBaseline = "middle",
    i.fillText("🏀", ua / 2, ua / 2 + 8);
    try {
        i.getImageData(ua / 2 + 18, ua / 2, 1, 1).data[3] > 8 && (Ri = !0)
    } catch {
        Ri = !0
    }
    return na
}
typeof document < "u" && document.fonts && document.fonts.ready.then( () => {
    _d()
}
);
function Lh(i, s, y, o, S) {
    const A = _d();
    if (i.save(),
    i.translate(s, y),
    i.rotate(S),
    i.fillStyle = "#e0641a",
    i.beginPath(),
    i.arc(0, 0, o * .95, 0, Math.PI * 2),
    i.fill(),
    A && Ri) {
        const D = o * 2.4;
        i.drawImage(A, -D / 2, -D / 2, D, D)
    }
    i.restore()
}
function jh(i, s, y) {
    const o = le.backboard.offsetX * 2
      , S = le.backboard.height
      , A = s - o / 2
      , D = y - le.backboard.offsetTop
      , Y = 6;
    i.fillStyle = ml.backboardEdge,
    i.fillRect(A, D - Y, o, Y);
    const p = i.createLinearGradient(A, D, A, D + S);
    p.addColorStop(0, "#ffffff"),
    p.addColorStop(.18, ml.backboard),
    p.addColorStop(1, "#d3d0c6"),
    i.fillStyle = p,
    i.fillRect(A, D, o, S),
    i.fillStyle = "rgba(255,255,255,0.55)",
    i.fillRect(A, D, 2, S),
    i.fillStyle = "rgba(0,0,0,0.18)",
    i.fillRect(A + o - 2, D, 2, S),
    i.strokeStyle = "rgba(20,18,16,0.85)",
    i.lineWidth = 2,
    i.strokeRect(A + 1, D + 1, o - 2, S - 2);
    const v = o * .34
      , N = S * .36
      , U = s - v / 2 + 6
      , V = D + S * .5;
    i.lineWidth = 3.5,
    i.strokeStyle = ml.backboardRed,
    i.strokeRect(U, V, v, N),
    i.fillStyle = ml.bracket,
    i.fillRect(s + 6, y + 36, 16, 30),
    i.fillStyle = "rgba(255,255,255,0.18)",
    i.fillRect(s + 6, y + 36, 2, 30),
    i.fillStyle = "#555",
    i.beginPath(),
    i.arc(s + 14, y + 42, 1.8, 0, Math.PI * 2),
    i.arc(s + 14, y + 60, 1.8, 0, Math.PI * 2),
    i.fill()
}
function Xh(i, s) {
    i.save(),
    s.side === "left" && (i.translate(s.x, 0),
    i.scale(-1, 1),
    i.translate(-s.x, 0));
    const {rimLeft: y, rimRight: o} = le
      , S = s.y + y.offsetY
      , A = y.offsetFromBackboard
      , D = s.x - A
      , Y = s.x - o.gap - A - o.width
      , p = (Y + D) / 2
      , v = S + y.thickness / 2
      , N = (D - Y) / 2
      , U = 7
      , V = y.thickness + 1;
    i.save(),
    i.translate(D, S),
    i.rotate(-s.rimTilt),
    i.translate(-D, -S),
    i.lineCap = "butt",
    i.lineWidth = V,
    i.strokeStyle = ml.rimLo,
    i.beginPath(),
    i.ellipse(p, v, N, U, 0, Math.PI, Math.PI * 2),
    i.stroke();
    const J = v + U * .4
      , ct = J + 80
      , ht = 16
      , nt = Y + 2
      , I = D - 2
      , qt = nt + ht
      , bt = I - ht;
    i.strokeStyle = ml.netNear,
    i.lineWidth = 1.2;
    const Ct = 9;
    for (let pt = 0; pt <= Ct; pt++) {
        const rt = pt / Ct
          , F = nt + (I - nt) * rt
          , Ut = qt + (bt - qt) * rt;
        i.beginPath(),
        i.moveTo(F, J),
        i.lineTo(Ut, ct),
        i.stroke()
    }
    i.strokeStyle = ml.netFar,
    i.lineWidth = 1;
    for (let pt = 1; pt <= 3; pt++) {
        const rt = pt / 4
          , F = J + (ct - J) * rt
          , Ut = nt + (qt - nt) * rt
          , wt = I + (bt - I) * rt;
        i.beginPath(),
        i.moveTo(Ut, F),
        i.lineTo(wt, F),
        i.stroke()
    }
    i.restore(),
    jh(i, s.x, s.y),
    i.restore()
}
function Vh(i, s) {
    i.save(),
    s.side === "left" && (i.translate(s.x, 0),
    i.scale(-1, 1),
    i.translate(-s.x, 0));
    const {rimLeft: y, rimRight: o} = le
      , S = s.y + y.offsetY
      , A = y.offsetFromBackboard
      , D = s.x - A
      , Y = s.x - o.gap - A - o.width
      , p = (Y + D) / 2
      , v = S + y.thickness / 2
      , N = (D - Y) / 2
      , U = 7
      , V = y.thickness + 1;
    i.save(),
    i.translate(D, S),
    i.rotate(-s.rimTilt),
    i.translate(-D, -S),
    i.lineWidth = V;
    const J = i.createLinearGradient(0, v - U, 0, v + U);
    J.addColorStop(0, ml.rimHi),
    J.addColorStop(.5, ml.rim),
    J.addColorStop(1, ml.rimLo),
    i.strokeStyle = J,
    i.beginPath(),
    i.ellipse(p, v, N, U, 0, 0, Math.PI),
    i.stroke(),
    i.strokeStyle = "rgba(255,225,180,0.75)",
    i.lineWidth = 1.5,
    i.beginPath(),
    i.ellipse(p, v - 1.5, N - 1, U - 1, 0, Math.PI * 1.1, Math.PI * 1.9),
    i.stroke(),
    i.restore(),
    i.restore()
}
function Qh(i, s, y) {
    const o = dn - (y + 120)
      , S = Math.max(0, Math.min(1, o / 600))
      , A = 1 - S * .3
      , D = .3 * (1 - S * .4);
    i.save(),
    i.globalAlpha = D,
    i.fillStyle = "#000",
    i.beginPath(),
    i.ellipse(s, dn - 8, 88 * A, 7 * A, 0, 0, Math.PI * 2),
    i.fill(),
    i.restore()
}
function Zh(i, s) {
    for (let y = 0; y < s.length; y++) {
        const o = s[y];
        o.active && (i.globalAlpha = Math.max(0, o.life),
        i.fillStyle = o.color,
        i.beginPath(),
        i.arc(o.x, o.y, o.size, 0, Math.PI * 2),
        i.fill())
    }
    i.globalAlpha = 1
}
function xh(i, s) {
    for (let y = 0; y < s.length; y++) {
        const o = s[y];
        o.active && (i.save(),
        i.globalAlpha = Math.max(0, o.life),
        i.font = "700 56px 'Space Grotesk', system-ui, sans-serif",
        i.textAlign = "center",
        i.textBaseline = "middle",
        i.lineWidth = 6,
        i.strokeStyle = "rgba(0,0,0,0.55)",
        i.strokeText(o.text, o.x, o.y),
        i.fillStyle = o.color,
        i.fillText(o.text, o.x, o.y),
        i.restore())
    }
    i.globalAlpha = 1
}
function Kh(i, s) {
    for (let y = 0; y < s.length; y++) {
        const o = s[y];
        if (!o.active)
            continue;
        const S = Math.max(0, o.life / o.maxLife);
        i.globalAlpha = S * .7,
        i.fillStyle = o.color,
        i.beginPath(),
        i.arc(o.x, o.y, o.size * S, 0, Math.PI * 2),
        i.fill()
    }
    i.globalAlpha = 1
}
const Jh = 80
  , wh = 60
  , kh = 6
  , Wh = {
    score: 0,
    hotStreak: 0,
    timerFraction: 1,
    hasScored: !1,
    phase: "playing",
    lastGameOver: null
};
function Fh(i) {
    let s = rd[0];
    for (const y of rd)
        if (i >= y.minScore)
            s = y;
        else
            break;
    return {
        minY: s.minY,
        maxY: s.maxY
    }
}
function $h({canvasRef: i, best: s, onBestChange: y, muted: o}) {
    const [S,A] = W.useState(Wh)
      , D = W.useRef(s);
    D.current = s;
    const Y = W.useRef(y);
    Y.current = y;
    const p = W.useRef({
        x: 200,
        y: Pl - Z.BALL_RADIUS,
        vx: 0,
        vy: 0,
        radius: Z.BALL_RADIUS,
        rotation: 0,
        fallingThrough: !1,
        hasHitRim: !1,
        minVelocityYAfterRim: 1 / 0,
        frameStartX: 0,
        frameStartY: 0,
        frameStartVelY: 0,
        inScoringZone: !1
    })
      , v = W.useRef({
        x: Z.CANVAS_WIDTH - 12,
        y: Z.CANVAS_HEIGHT * .5,
        side: "right",
        scored: !1,
        rimTilt: 0,
        rimTiltVelocity: 0,
        animating: !1,
        animStartX: 0,
        animTargetX: 0,
        animProgress: 0,
        targetDirection: 1
    })
      , N = W.useRef(0)
      , U = W.useRef(Z.COUNTDOWN_TIME)
      , V = W.useRef(!1)
      , J = W.useRef(!1)
      , ct = W.useRef(!1)
      , ht = W.useRef(!1)
      , nt = W.useRef(0)
      , I = W.useRef(0)
      , qt = W.useRef(0)
      , bt = W.useRef(0)
      , Ct = W.useRef(!1)
      , pt = W.useRef(1)
      , rt = W.useRef("playing")
      , F = W.useRef(!1)
      , Ut = W.useRef(Eh())
      , wt = W.useRef(Array.from({
        length: Jh
    }, () => ({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        size: 0,
        color: "#fff",
        active: !1
    })))
      , Ml = W.useRef(Array.from({
        length: wh
    }, () => ({
        x: 0,
        y: 0,
        life: 0,
        maxLife: 1,
        size: 0,
        color: ml.ball,
        active: !1
    })))
      , il = W.useRef(Array.from({
        length: kh
    }, () => ({
        x: 0,
        y: 0,
        vy: 0,
        life: 0,
        text: "",
        color: "#fff",
        active: !1
    })))
      , Gt = W.useRef(0)
      , yl = W.useRef(null)
      , kt = W.useRef(null)
      , Wt = W.useRef({
        intensity: 0,
        duration: 0,
        x: 0,
        y: 0
    })
      , O = W.useCallback( () => {
        A({
            score: N.current,
            hotStreak: I.current,
            timerFraction: Math.max(0, Math.min(1, U.current / Z.COUNTDOWN_TIME)),
            hasScored: J.current,
            phase: rt.current,
            lastGameOver: null
        })
    }
    , [])
      , H = (B, L, $, Ht) => {
        const Xt = il.current;
        for (let Vt = 0; Vt < Xt.length; Vt++)
            if (!Xt[Vt].active) {
                Xt[Vt] = {
                    x: B,
                    y: L,
                    vy: -60,
                    life: 1,
                    text: $,
                    color: Ht,
                    active: !0
                };
                return
            }
    }
      , k = (B, L, $) => {
        const Ht = wt.current
          , Xt = $ ? 32 : 18
          , Vt = $ ? 250 : 150
          , al = $ ? 1.6 : 1;
        let Lt = 0;
        for (let Rl = 0; Rl < Ht.length && Lt < Xt; Rl++) {
            if (Ht[Rl].active)
                continue;
            const oe = Math.PI * 2 * Lt / Xt
              , se = Vt + Math.random() * Vt
              , tl = Ht[Rl];
            if (tl.x = B,
            tl.y = L,
            tl.vx = Math.cos(oe) * se,
            tl.vy = Math.sin(oe) * se,
            tl.life = 1,
            tl.size = (3 + Math.random() * 4) * al,
            $) {
                const ee = Math.random();
                tl.color = ee > .6 ? "#FFFFFF" : ee > .3 ? ml.accent : ml.accentSwish
            } else
                tl.color = Math.random() > .5 ? ml.ball : ml.accent;
            tl.active = !0,
            Lt++
        }
    }
      , Et = (B, L) => {
        const $ = Ml.current
          , Ht = I.current
          , Xt = Ht >= 3 ? "#ff3a3a" : Ht >= 2 ? "#ff9a3a" : Ht >= 1 ? "#ffd33a" : "rgba(255,255,255,0.4)"
          , Vt = Ht >= 1 ? 1.4 : .6
          , al = Ht >= 1 ? 10 : 4;
        for (let Lt = 0; Lt < $.length; Lt++)
            if (!$[Lt].active) {
                $[Lt].x = B,
                $[Lt].y = L,
                $[Lt].life = Vt,
                $[Lt].maxLife = Vt,
                $[Lt].size = al,
                $[Lt].color = Xt,
                $[Lt].active = !0;
                return
            }
    }
      , At = (B, L) => {
        Wt.current.intensity = B,
        Wt.current.duration = L
    }
      , m = B => {
        hh(B)
    }
      , R = () => {
        const B = v.current
          , L = p.current;
        B.side = B.side === "left" ? "right" : "left";
        const $ = Fh(N.current);
        let Ht = 0, Xt;
        do
            Xt = $.minY + Math.random() * ($.maxY - $.minY),
            Ht++;
        while (Math.abs(Xt - B.y) < 50 && Ht < 20);
        B.y = Xt,
        B.scored = !1,
        B.rimTilt = 0,
        B.rimTiltVelocity = 0,
        U.current = Z.COUNTDOWN_TIME,
        V.current = !1,
        ct.current = !1,
        ht.current = !1,
        B.targetDirection = B.side === "right" ? 1 : -1,
        B.animTargetX = B.side === "left" ? 12 : Z.CANVAS_WIDTH - 12,
        B.animStartX = B.side === "left" ? -150 : Z.CANVAS_WIDTH + 150,
        B.x = B.animStartX,
        B.animProgress = 0,
        B.animating = !0,
        L.fallingThrough = !1,
        L.hasHitRim = !1,
        L.minVelocityYAfterRim = 1 / 0,
        L.inScoringZone = !1
    }
      , q = B => 1 - Math.pow(1 - B, 3)
      , X = () => {
        const B = v.current
          , L = p.current;
        if (B.scored || L.fallingThrough)
            return {
                scored: !1,
                isSwish: !1
            };
        const $ = le
          , Ht = B.y + $.rimLeft.offsetY + $.rimLeft.thickness;
        let Xt, Vt;
        B.side === "right" ? (Xt = B.x - $.rimRight.gap - $.rimLeft.offsetFromBackboard,
        Vt = B.x - $.rimLeft.width - $.rimLeft.offsetFromBackboard) : (Xt = B.x + $.rimLeft.width + $.rimLeft.offsetFromBackboard,
        Vt = B.x + $.rimRight.gap + $.rimLeft.offsetFromBackboard);
        const al = L.frameStartY - L.radius
          , Lt = L.y - L.radius;
        if (al < Ht && Lt >= Ht && L.frameStartVelY > 0) {
            const Rl = (Ht - al) / (Lt - al)
              , oe = L.frameStartX + (L.x - L.frameStartX) * Rl
              , se = oe - L.radius
              , tl = oe + L.radius;
            if (se > Xt && tl < Vt)
                return {
                    scored: !0,
                    isSwish: !L.hasHitRim
                }
        }
        return {
            scored: !1,
            isSwish: !1
        }
    }
      , P = W.useCallback( () => {
        if (rt.current === "gameOver")
            return;
        rt.current = "gameOver",
        _a("gameOver");
        const B = N.current
          , L = B > D.current;
        L && Y.current(B);
        const $ = bt.current === 0 ? 0 : Math.round(qt.current / bt.current * 100);
        A({
            score: B,
            hotStreak: I.current,
            timerFraction: 0,
            hasScored: J.current,
            phase: "gameOver",
            lastGameOver: {
                score: B,
                best: Math.max(B, D.current),
                isNewRecord: L,
                cleanShotPct: $
            }
        })
    }
    , [])
      , it = W.useCallback( () => {
        if (lh(),
        rt.current === "gameOver")
            return;
        const B = p.current
          , L = v.current;
        if (!F.current) {
            F.current = !0,
            B.vy = -Z.JUMP_FORCE,
            B.vx = L.targetDirection * Z.HORIZONTAL_FORCE,
            _a("tap"),
            bt.current++;
            return
        }
        B.fallingThrough && !ht.current && R(),
        ct.current || (B.vy = -Z.JUMP_FORCE,
        B.vx = L.targetDirection * Z.HORIZONTAL_FORCE,
        _a("tap"),
        bt.current++)
    }
    , [])
      , vt = W.useCallback( () => {
        N.current = 0,
        U.current = Z.COUNTDOWN_TIME,
        V.current = !1,
        J.current = !1,
        ct.current = !1,
        ht.current = !1,
        nt.current = 0,
        I.current = 0,
        qt.current = 0,
        bt.current = 0,
        Ct.current = !1,
        pt.current = 1,
        rt.current = "playing",
        F.current = !1;
        for (const $ of wt.current)
            $.active = !1;
        for (const $ of Ml.current)
            $.active = !1;
        for (const $ of il.current)
            $.active = !1;
        const B = p.current;
        B.x = 200,
        B.y = Pl - Z.BALL_RADIUS,
        B.vx = 0,
        B.vy = 0,
        B.rotation = 0,
        B.fallingThrough = !1,
        B.hasHitRim = !1,
        B.minVelocityYAfterRim = 1 / 0,
        B.inScoringZone = !1;
        const L = v.current;
        L.side = "right",
        L.x = Z.CANVAS_WIDTH - 12,
        L.y = Z.CANVAS_HEIGHT * .5,
        L.scored = !1,
        L.rimTilt = 0,
        L.rimTiltVelocity = 0,
        L.animating = !1,
        L.targetDirection = 1,
        O()
    }
    , [O]);
    return W.useEffect( () => {
        const B = i.current;
        if (!B)
            return;
        const L = B.getContext("2d");
        if (!L)
            return;
        const $ = x => {
            const G = yl.current;
            yl.current = x;
            const C = G == null ? 0 : (x - G) / 1e3
              , et = Math.min(C, Z.MAX_DELTA_TIME);
            Ht(et),
            hu(L),
            kt.current = requestAnimationFrame($)
        }
          , Ht = x => {
            if (rt.current === "gameOver") {
                Xt(x);
                return
            }
            if (x <= 0)
                return;
            Ct.current && (pt.current += (Z.SLOW_MOTION_TARGET - pt.current) * Z.SLOW_MOTION_LERP * x,
            pt.current < Z.SLOW_MOTION_TARGET + .01 && (pt.current = Z.SLOW_MOTION_TARGET));
            const G = x * pt.current
              , C = p.current;
            if (C.frameStartX = C.x,
            C.frameStartY = C.y,
            C.frameStartVelY = C.vy,
            F.current && J.current && !ct.current && !V.current && (U.current -= x,
            U.current <= 0 && (ct.current = !0,
            ht.current = !0,
            Ct.current = !0,
            U.current = 0,
            H(Z.CANVAS_WIDTH / 2, 340, "TIME UP", ml.accentHot))),
            !F.current) {
                ee();
                return
            }
            C.vy += Z.GRAVITY * G;
            const et = Math.pow(1 - Z.AIR_DRAG, G);
            if (C.vx *= et,
            C.vy *= et,
            C.y + C.radius >= Pl - 5) {
                const He = Math.pow(1 - Z.FLOOR_FRICTION, G);
                C.vx *= He
            }
            Math.abs(C.vx) > 10 && Math.abs(C.vx) < Z.MIN_H_SPEED && (C.vx = C.vx > 0 ? Z.MIN_H_SPEED : -Z.MIN_H_SPEED),
            C.rotation += C.vx / C.radius * G;
            const re = Math.sqrt(C.vx * C.vx + C.vy * C.vy)
              , cl = C.radius * .5
              , de = re * G
              , Da = Math.max(1, Math.ceil(de / cl))
              , ae = G / Da
              , ft = v.current;
            Ah(Ut.current, ft.x, ft.y, ft.side),
            Gt.current -= G,
            Gt.current <= 0 && re > 100 && rt.current === "playing" && (Et(C.x, C.y),
            Gt.current = I.current >= 1 ? .02 : .08);
            for (let He = 0; He < Da; He++) {
                const gl = C.x
                  , Sl = C.y;
                C.x += C.vx * ae,
                C.y += C.vy * ae,
                C.fallingThrough || (Vt(gl, Sl, "backboard"),
                Vt(gl, Sl, "rimLeft"),
                Vt(gl, Sl, "rimRight"),
                Vt(gl, Sl, "corner")),
                C.x + C.radius < 0 && (C.x = Z.CANVAS_WIDTH + C.radius),
                C.x - C.radius > Z.CANVAS_WIDTH && (C.x = -C.radius);
                const Ll = Sl + C.radius
                  , Dl = C.y + C.radius;
                if (Ll < Pl && Dl >= Pl) {
                    const ue = (Pl - Ll) / (Dl - Ll);
                    C.x = gl + (C.x - gl) * ue,
                    C.y = Pl - C.radius - .1;
                    const me = Math.abs(C.vy);
                    C.vy = -Math.abs(C.vy) * Z.BOUNCE_COEF,
                    me > 150 && _a("bounce"),
                    ht.current && nt.current === 0 && rt.current === "playing" && (nt.current = Z.GAME_OVER_DELAY)
                } else if (C.y + C.radius > Pl && (C.y = Pl - C.radius,
                C.vy > 0)) {
                    const ue = C.vy;
                    C.vy = -C.vy * Z.BOUNCE_COEF,
                    ue > 150 && _a("bounce"),
                    ht.current && nt.current === 0 && rt.current === "playing" && (nt.current = Z.GAME_OVER_DELAY)
                }
            }
            const Wl = X();
            if (Wl.scored && rt.current === "playing") {
                const He = C.hasHitRim && C.minVelocityYAfterRim > Z.SOFT_RIM_THRESHOLD
                  , gl = Wl.isSwish || He;
                let Sl, Ll;
                gl ? (I.current++,
                Sl = I.current + 1,
                Ll = I.current >= 3 ? "#ff5555" : I.current >= 2 ? "#ffaa00" : ml.accent,
                qt.current++) : (I.current = 0,
                Sl = 1,
                Ll = "#ffffff"),
                N.current += Sl,
                ft.scored = !0,
                V.current = !0,
                C.fallingThrough = !0,
                _a("swoosh");
                const Dl = le.rimLeft.offsetFromBackboard + le.rimRight.gap / 2
                  , ue = ft.side === "right" ? ft.x - Dl : ft.x + Dl
                  , me = ft.y - 10;
                H(ue, me, `+${Sl}`, Ll),
                ht.current = !1,
                nt.current = 0,
                ct.current = !1,
                Ct.current && (Ct.current = !1,
                pt.current = 1),
                J.current || (J.current = !0);
                const Ui = ft.y + le.rimLeft.offsetY + le.rimLeft.thickness;
                if (k(C.x, Ui, gl),
                gl) {
                    const yn = Math.min(8 + I.current * 2, 20)
                      , vu = .2 + I.current * .05;
                    At(yn, vu),
                    m(Math.min(50 + I.current * 20, 150))
                }
                O()
            }
            if (nt.current > 0 && rt.current === "playing" && (nt.current -= x,
            nt.current <= 0)) {
                P();
                return
            }
            C.fallingThrough && C.y > Z.CANVAS_HEIGHT - 150 && C.vy > 0 && !ht.current && !ct.current && R(),
            al(G),
            Lt(G),
            Rl(G),
            oe(G),
            se(G);
            const vl = Z.RIM_TILT_SPRING
              , Ni = Z.RIM_TILT_DAMPING
              , Ci = Z.RIM_TILT_MAX;
            ft.rimTiltVelocity += -ft.rimTilt * vl,
            ft.rimTiltVelocity *= Ni,
            ft.rimTilt += ft.rimTiltVelocity,
            ft.rimTilt = Math.max(0, Math.min(Ci, ft.rimTilt)),
            ft.rimTilt < .003 && Math.abs(ft.rimTiltVelocity) < .003 && (ft.rimTilt = 0,
            ft.rimTiltVelocity = 0),
            ee()
        }
          , Xt = x => {
            const G = p.current
              , C = Math.min(x, Z.MAX_DELTA_TIME);
            G.vy += Z.GRAVITY * C,
            G.x += G.vx * C,
            G.y += G.vy * C,
            G.y + G.radius > Pl && (G.y = Pl - G.radius,
            G.vy = -G.vy * Z.BOUNCE_COEF * .5,
            G.vx *= .85),
            al(C),
            Lt(C),
            Rl(C)
        }
          , Vt = (x, G, C) => {
            const et = p.current
              , Gl = v.current
              , re = Ut.current[C]
              , cl = _h(x, G, et.x, et.y, et.radius, re);
            if (cl) {
                if (et.x = cl.x,
                et.y = cl.y,
                C === "rimLeft" || C === "rimRight") {
                    if (cl.face === "top") {
                        et.vy = -Math.abs(et.vy) * Z.BOUNCE_COEF,
                        et.vx *= .9;
                        const de = 100;
                        Math.abs(et.vx) < de && (et.vx = Ut.current.hoopSide === "right" ? -de : de),
                        Gl.rimTiltVelocity += .05
                    } else
                        cl.face === "bottom" ? (et.vy = Math.abs(et.vy) * Z.BOUNCE_COEF,
                        Gl.rimTiltVelocity -= .03) : (et.vx = -et.vx * Z.BOUNCE_COEF,
                        Math.abs(et.vx) < 100 && (et.vx = cl.normalX * 100),
                        Gl.rimTiltVelocity += .03);
                    et.hasHitRim = !0,
                    et.minVelocityYAfterRim = Math.min(et.minVelocityYAfterRim, et.vy)
                } else
                    C === "backboard" ? (cl.normalX !== 0 && (et.vx = -et.vx * Z.BOUNCE_COEF),
                    cl.normalY !== 0 && (et.vy = -et.vy * Z.BOUNCE_COEF)) : (cl.normalX !== 0 && (et.vx = -et.vx * Z.BOUNCE_COEF),
                    cl.normalY !== 0 && (et.vy = -et.vy * Z.BOUNCE_COEF),
                    et.hasHitRim = !0,
                    et.minVelocityYAfterRim = Math.min(et.minVelocityYAfterRim, et.vy));
                _a("bounce")
            }
        }
          , al = x => {
            for (const C of wt.current)
                C.active && (C.x += C.vx * x,
                C.y += C.vy * x,
                C.vy += 400 * x,
                C.life -= x * 1.1,
                C.life <= 0 && (C.active = !1))
        }
          , Lt = x => {
            for (const G of Ml.current)
                G.active && (G.life -= x,
                G.life <= 0 && (G.active = !1))
        }
          , Rl = x => {
            for (const G of il.current)
                G.active && (G.y += G.vy * x,
                G.life -= x * .8,
                G.life <= 0 && (G.active = !1))
        }
          , oe = x => {
            const G = v.current;
            if (G.animating)
                if (G.animProgress += x / Z.HOOP_SLIDE_DURATION,
                G.animProgress >= 1)
                    G.animProgress = 1,
                    G.animating = !1,
                    G.x = G.animTargetX;
                else {
                    const C = q(G.animProgress);
                    G.x = G.animStartX + (G.animTargetX - G.animStartX) * C
                }
        }
          , se = x => {
            const G = Wt.current;
            if (G.duration <= 0) {
                G.x = 0,
                G.y = 0;
                return
            }
            G.duration -= x,
            G.duration <= 0 ? (G.intensity = 0,
            G.x = 0,
            G.y = 0) : (G.x = (Math.random() - .5) * 2 * G.intensity,
            G.y = (Math.random() - .5) * 2 * G.intensity)
        }
        ;
        let tl = 0;
        const ee = () => {
            tl++,
            tl >= 6 && (tl = 0,
            (S.score !== N.current || S.hotStreak !== I.current || S.hasScored !== J.current || Math.abs(S.timerFraction - Math.max(0, Math.min(1, U.current / Z.COUNTDOWN_TIME))) > .005) && O())
        }
          , hu = (x, G, C) => {
            const {width: et, height: Gl} = B
              , re = window.devicePixelRatio || 1
              , cl = Z.CANVAS_WIDTH
              , de = Z.CANVAS_HEIGHT
              , Da = et / cl
              , ae = Gl / de;
            x.setTransform(1, 0, 0, 1, 0, 0),
            x.clearRect(0, 0, et, Gl);
            const ft = Wt.current;
            x.setTransform(Da, 0, 0, ae, ft.x * re * .5, ft.y * re * .5),
            qh(x),
            Qh(x, v.current.x, v.current.y),
            Xh(x, {
                x: v.current.x,
                y: v.current.y,
                side: v.current.side,
                rimTilt: v.current.rimTilt
            }),
            Kh(x, Ml.current),
            Zh(x, wt.current),
            xh(x, il.current),
            Gh(x, p.current.x, p.current.y, p.current.radius),
            Lh(x, p.current.x, p.current.y, p.current.radius, p.current.rotation),
            Vh(x, {
                x: v.current.x,
                y: v.current.y,
                side: v.current.side,
                rimTilt: v.current.rimTilt
            })
        }
          , Ra = () => {
            const x = window.devicePixelRatio || 1
              , G = B.getBoundingClientRect();
            B.width = Math.round(G.width * x),
            B.height = Math.round(G.height * x)
        }
        ;
        Ra();
        const mn = new ResizeObserver(Ra);
        return mn.observe(B),
        window.addEventListener("resize", Ra),
        kt.current = requestAnimationFrame($),
        () => {
            kt.current != null && cancelAnimationFrame(kt.current),
            kt.current = null,
            yl.current = null,
            mn.disconnect(),
            window.removeEventListener("resize", Ra)
        }
    }
    , []),
    {
        snapshot: S,
        handleTap: it,
        reset: vt
    }
}
function Ih() {
    const i = W.useRef(null)
      , [s,y] = W.useState(0)
      , [o,S] = W.useState(!1)
      , [A,D] = W.useState(!1)
      , [Y,p] = W.useState(!0);
    W.useEffect( () => {
        let nt = !1;
        return vh().then(I => {
            nt || (y(I.highScore),
            S(I.muted),
            D(!0))
        }
        ),
        () => {
            nt = !0
        }
    }
    , []),
    W.useEffect( () => {
        A && gh({
            version: 1,
            highScore: s,
            muted: o
        })
    }
    , [s, o, A]),
    W.useEffect( () => {
        eh(o)
    }
    , [o]);
    const v = W.useCallback(nt => {
        y(nt)
    }
    , [])
      , {snapshot: N, handleTap: U, reset: V} = $h({
        canvasRef: i,
        best: s,
        onBestChange: v,
        muted: o
    });
    W.useEffect( () => {
        N.phase === "gameOver" && N.lastGameOver && yh(N.lastGameOver.score, !0)
    }
    , [N.phase, N.lastGameOver]);
    const J = W.useCallback( () => {
        Y && p(!1),
        N.phase !== "gameOver" && U()
    }
    , [U, Y, N.phase])
      , ct = W.useCallback( () => {
        V(),
        p(!0)
    }
    , [V])
      , ht = W.useCallback( () => {
        S(nt => !nt)
    }
    , []);
    return lt.jsx("div", {
        className: "app",
        children: lt.jsxs("div", {
            className: "stage",
            children: [lt.jsx(Fy, {
                ref: i,
                onTap: J
            }), lt.jsx(Py, {
                score: N.score,
                best: s,
                hotStreak: N.hotStreak,
                timerFraction: N.timerFraction,
                hasScored: N.hasScored
            }), lt.jsx("div", {
                style: {
                    position: "absolute",
                    right: 14,
                    bottom: 18,
                    pointerEvents: "auto"
                },
                children: lt.jsx(th, {
                    muted: o,
                    onToggle: ht
                })
            }), Y && N.phase === "playing" && !N.hasScored && lt.jsx("div", {
                className: "hint",
                children: "Tap anywhere to launch"
            }), lt.jsx($y, {
                payload: N.phase === "gameOver" ? N.lastGameOver : null,
                onRetry: ct
            })]
        })
    })
}
function rn(i, s) {
    switch (i) {
    case "backgroundColor":
        typeof s == "string" && (document.documentElement.style.setProperty("--bg-far", s),
        document.documentElement.style.setProperty("--bg", s));
        break;
    case "accentColor":
        typeof s == "string" && document.documentElement.style.setProperty("--accent", s);
        break;
    case "hapticsEnabled":
        typeof s == "boolean" && bh(s);
        break;
    case "debugMode":
        typeof s == "boolean" && Sh(s);
        break
    }
}
async function Ph() {
    Ma(),
    mh();
    try {
        const s = await dh();
        rn("backgroundColor", s.get("backgroundColor")),
        rn("accentColor", s.get("accentColor")),
        rn("hapticsEnabled", s.get("hapticsEnabled")),
        rn("debugMode", s.get("debugMode")),
        s.onChange( (y, o) => rn(y, o))
    } catch {}
    const i = document.getElementById("root");
    i && Wy.createRoot(i).render(lt.jsx(Qy.StrictMode, {
        children: lt.jsx(Ih, {})
    }))
}
Ph();
