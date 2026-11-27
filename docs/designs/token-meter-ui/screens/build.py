import math
T=dict(bg='#181613',track='#373532',text='#f3f1ee',mut='#aeaaa5',norm='#4eb068',warn='#f4af41',dang='#ff6870',tick='#f9f8f6',prim='#c1bdb8',knobon='#181613',off='#44423f',offb='#898581',focus='#8fd5fd')
def ring(pct,col,pace,size=20,sw=3):
    r=(size-sw)/2;c=2*math.pi*r;cx=size/2
    s=f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" style="flex:none;overflow:visible"><circle cx="{cx}" cy="{cx}" r="{r}" fill="none" stroke="{T["track"]}" stroke-width="{sw}"/>'
    if pct: s+=f'<circle cx="{cx}" cy="{cx}" r="{r}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-dasharray="{c*min(pct,100)/100:.2f} {c:.2f}" transform="rotate(-90 {cx} {cx})"/>'
    if pace is not None:
        a=math.radians(pace*3.6-90);p=lambda d:(cx+(r+d)*math.cos(a),cx+(r+d)*math.sin(a))
        (x1,y1),(x2,y2)=p(-sw),p(sw)
        s+=f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{T["bg"]}" stroke-width="4.5" stroke-linecap="round"/><line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{T["tick"]}" stroke-width="1.5" stroke-linecap="round"/>'
    return s+'</svg>'
def gauge(lbl,pct,pace,reset,size=20,txt=None,mutpct=False):
    col=T['norm'] if pct is None or pct<70 else T['warn'] if pct<90 else T['dang']
    pc=T['mut'] if (mutpct or pct is None) else col; w=500 if pct is None or pct<70 else 600
    val=txt or ('–' if pct is None else f'{pct}%')
    rs=f'<span style="color:{T["mut"]}">{reset}</span>' if reset else ''
    ah=''
    if pct is not None and pace is not None and not txt and pct-pace>5: ah=f'<span style="color:{pc};font-weight:500">▲{round(pct-pace)}</span>'
    return f'<span class="g">{ring(pct or 0,col,pace,size)}<span style="color:{T["mut"]}">{lbl}</span><span style="color:{pc};font-weight:{w}">{val}</span>{ah}{rs}</span>'
def toggle(state,cost,focus=False):
    on=state in('on','ping','fail','paused-on');trk=T['prim'] if state in('on','ping','fail','paused') else T['off']
    border='' if state in('on','ping','fail','paused') else f'box-shadow:inset 0 0 0 1px {T["offb"]};'
    knob='right:2px' if on or state=='paused' else 'left:2px'
    op='opacity:.6;' if state=='ping' else ''
    lab=T['text'] if state in('on','ping','fail') else T['mut']
    f=f'outline:2px solid {T["focus"]};outline-offset:2px;border-radius:8px;' if focus else ''
    cc=T['dang'] if state=='fail' else T['mut']
    dis='opacity:.4;' if state=='disabled' else ''
    if state=='paused': trk='#78746f'
    kb=T["knobon"] if state in ("on","ping","fail","paused") else "#fff"
    return f'<span class="g" style="{f}{dis}"><span class="sw" style="background:{trk};{border}"><i style="{knob};{op}background:{kb}"></i></span><span style="color:{lab}">Keep warm</span><span style="color:{cc}">{cost}</span></span>'
def lap(g1,g2,tg,note):
    return f'<div class="st"><div class="nt">{note}</div><div class="bar">{g1}{g2}<span class="sp"></span>{tg}</div></div>'
def ph(g1,g2,tg,right,cost,note):
    c3=f'<div class="l3">{cost}</div>' if cost else ''
    return f'<div class="st"><div class="nt">{note}</div><div class="bar ph"><div class="l1">{g1}<span class="sp"></span>{g2}</div><div class="l2">{tg}<span class="sp"></span><span style="color:{T["mut"]}">{right}</span></div>{c3}</div></div>'
C='$0.003 per ping · $0.04 so far, est. · off in 42 min'
L=[
 (gauge('5h',42,64,'1h 48m'),gauge('Week',34,41,'Thu 09:00'),toggle('off',''),'Normal · keep warm off'),
 (gauge('5h',78,64,'1h 48m'),gauge('Week',34,41,'Thu 09:00'),toggle('on',C),'Warning (70-89%) · keep warm on'),
 (gauge('5h',93,70,'1h 30m'),gauge('Week',71,55,'Thu 09:00'),toggle('ping','pinging… · off in 40 min'),'Danger (90%+) · weekly in warning · pinging'),
 (gauge('5h',100,82,'54m',txt='Limit reached'),gauge('Week',76,58,'Thu 09:00'),toggle('paused','Paused at 5h limit (95%+)'),'Limit reached · keep warm paused at limit'),
 (gauge('5h',61,64,'1h 48m'),gauge('Week',34,41,'Thu 09:00'),toggle('fail','Ping failed · retrying in 1 min · off in 38 min'),'Ping failed'),
 (gauge('5h',None,None,None),gauge('Week',None,None,None),toggle('disabled',''),'No reading yet (before first reply, or not on a subscription)'),
 (gauge('5h',0,0,'5h 00m',mutpct=True),gauge('Week',34,41,'Thu 09:00'),toggle('on',C,focus=True),'5h window just reset · toggle focused (keyboard)'),
 (gauge('5h',52,64,'1h 48m'),gauge('Week',34,41,'Thu 09:00'),toggle('on','$0.003 per ping · $0.06 so far, est. · off in 3 min'),'Keep warm about to stop (57 min idle)'),
 (gauge('5h',52,64,'1h 48m'),gauge('Week',34,41,'Thu 09:00'),toggle('off','Turned off after 60 min idle · $0.07 est.'),'Keep warm stopped itself after 60 min idle'),
]
P=[
 (gauge('5h',78,64,'1h 48m',24),gauge('Wk',34,41,'Thu 09:00',24),toggle('on',''),'off in 42 min','$0.003 per ping · $0.04 so far, est.','Warning · keep warm on'),
 (gauge('5h',93,70,'1h 30m',24),gauge('Wk',71,55,'Thu',24),toggle('ping','pinging…'),'off in 40 min','$0.003 per ping · $0.05 so far, est.','Danger · pinging'),
 (gauge('5h',100,82,'54m',24,txt='Limit'),gauge('Wk',76,58,'Thu',24),toggle('paused','Paused'),'at 5h limit','$0.003 per ping · $0.05 so far, est.','Limit reached · keep warm paused'),
 (gauge('5h',61,64,'1h 48m',24),gauge('Wk',34,41,'Thu 09:00',24),toggle('fail','Ping failed'),'retry in 1 min','$0.003 per ping · $0.04 so far, est.','Ping failed'),
 (gauge('5h',0,0,'5h 00m',24,mutpct=True),gauge('Wk',34,41,'Thu 09:00',24),toggle('off',''),'','','5h just reset · keep warm off'),
 (gauge('5h',None,None,None,24),gauge('Wk',None,None,None,24),toggle('disabled',''),'','','No reading yet'),
 (gauge('5h',52,64,'1h 48m',24),gauge('Wk',34,41,'Thu 09:00',24),toggle('off',''),'Off after 60 min idle','$0.07 est. this session','Stopped itself after 60 min idle'),
]
css=f'''*{{box-sizing:border-box}}body{{margin:0;background:#262624;color:{T["text"]};font:12px/16px -apple-system,"SF Pro Text",system-ui,sans-serif;font-variant-numeric:tabular-nums;padding:24px;display:flex;gap:32px;align-items:flex-start}}
h2{{font-size:13px;font-weight:600;margin:0 0 12px;color:#d9d6d0}}.col{{display:flex;flex-direction:column;gap:14px}}.nt{{font-size:11px;color:#8d8a84;margin-bottom:5px}}
.bar{{background:{T["bg"]};border-radius:8px;padding:4px 10px;min-height:28px;display:flex;align-items:center;gap:16px;white-space:nowrap}}
.g{{display:inline-flex;align-items:center;gap:6px}}.sp{{flex:1}}
.sw{{position:relative;width:26px;height:15px;border-radius:8px;flex:none}}.sw i{{position:absolute;top:2px;width:11px;height:11px;border-radius:50%;background:#fff}}
.ph{{display:block;font-size:13px;line-height:18px;padding:2px 12px}}.ph .l1{{display:flex;align-items:center;gap:8px;min-height:28px}}.ph .l1 .g{{gap:6px}}.ph .l2{{display:flex;align-items:center;min-height:44px;border-top:1px solid #2a2825}}
.ph .l3{{min-height:28px;display:flex;align-items:center;color:#aeaaa5;border-top:1px solid #2a2825}}.ph .sw{{width:34px;height:20px;border-radius:10px}}.ph .sw i{{width:16px;height:16px}}'''
html=f'<!doctype html><html><head><meta charset="utf-8"><title>Token meter states</title><style>{css}</style></head><body><div class="col" style="width:780px"><h2>Laptop · 780px chat column</h2>{"".join(lap(*x) for x in L)}</div><div class="col" style="width:375px"><h2>Phone · 375px</h2>{"".join(ph(*x) for x in P)}</div></body></html>'
open('screens/states.html','w').write(html)
