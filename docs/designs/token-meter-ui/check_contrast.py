import math, json, sys
def oklch_to_srgb(L,C,h):
    a=C*math.cos(math.radians(h)); b=C*math.sin(math.radians(h))
    l_=L+0.3963377774*a+0.2158037573*b; m_=L-0.1055613458*a-0.0638541728*b; s_=L-0.0894841775*a-1.2914855480*b
    l,m,s=l_**3,m_**3,s_**3
    r=4.0767416621*l-3.3077115913*m+0.2309699292*s; g=-1.2684380046*l+2.6097574011*m-0.3413193965*s; bb=-0.0041960863*l-0.7034186147*m+1.7076147010*s
    def enc(x):
        x=min(max(x,0),1); return 12.92*x if x<=0.0031308 else 1.055*x**(1/2.4)-0.055
    return tuple(enc(v) for v in (r,g,bb))
def hexc(t): return '#'+''.join(f'{round(v*255):02x}' for v in t)
def lum(t):
    f=lambda c: c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    r,g,b=(f(v) for v in t); return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
steps=[50,100,200,300,400,500,600,700,800,900,950]
Ls=[0.97,0.93,0.86,0.78,0.70,0.62,0.54,0.46,0.37,0.27,0.20]
def scale(C,h,peak=1):
    out={}
    for s,L in zip(steps,Ls):
        c=C*(1-abs(L-0.62)/0.6*0.6)  # taper chroma at the ends
        out[s]=hexc(oklch_to_srgb(L,c,h))
    return out
scales={'brand':scale(0.14,42),'neutral':scale(0.008,70),'amber':scale(0.15,75),'red':scale(0.19,20),'green':scale(0.15,150)}
tok={ # semantic tokens, dark set (the bar is always dark)
 'bar-bg':(0.20,0.006,70),'track':(0.33,0.006,70),'toggle-off':(0.38,0.006,70),'toggle-off-border':(0.62,0.008,70),
 'text':(0.96,0.005,80),'text-muted':(0.74,0.008,70),'fill-normal':(0.68,0.14,150),
 'fill-warning':(0.80,0.145,75),'fill-danger':(0.71,0.185,20),'toggle-on':(0.80,0.008,70),'toggle-knob-on':(0.20,0.006,70),'toggle-paused':(0.56,0.008,70),
 'focus-ring':(0.84,0.09,235),'pace-tick':(0.98,0.003,80)}
T={k:oklch_to_srgb(*v) for k,v in tok.items()}
pairs=[('text','bar-bg',4.5),('text-muted','bar-bg',4.5),('fill-warning','bar-bg',4.5),('fill-danger','bar-bg',4.5),
 ('fill-normal','track',3),('fill-warning','track',3),('fill-danger','track',3),('fill-normal','bar-bg',3),
 ('toggle-on','bar-bg',3),('toggle-knob-on','toggle-on',3),('toggle-paused','bar-bg',3),('toggle-knob-on','toggle-paused',3),('fill-warning','fill-normal',1.0),('toggle-off-border','bar-bg',3),('focus-ring','bar-bg',3),('pace-tick','bar-bg',3),('pace-tick','track',3)]
rows=[];ok=True
for a,b,need in pairs:
    v=cr(T[a],T[b]); p=v>=need; ok&=p; rows.append((a,b,round(v,2),need,'pass' if p else 'FAIL'))
json.dump({'scales':scales,'tokens':{k:{'oklch':f'oklch({v[0]} {v[1]} {v[2]})','hex':hexc(T[k])} for k,v in tok.items()},'contrast':rows},open(sys.argv[1],'w'),indent=1)
for r in rows: print(r)
print('ALL PASS' if ok else 'SOME FAIL')
