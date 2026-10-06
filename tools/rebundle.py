#!/usr/bin/env python3
"""Sync the .jsx sources into the packed index.html.

index.html is a self-unpacking bundle: a JSON manifest of gzip+base64 files and
an HTML template that references them by uuid. Edit Panels.jsx, Nerd.jsx,
RouteMap.jsx or app.jsx, then run:  python3 tools/rebundle.py
"""
import re, json, base64, gzip, uuid, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
s = HTML.read_text()

def block(name):
    m = re.search(r'(<script type="__bundler/%s">)(.*?)(</script>)' % name, s, re.S)
    return m

man_m = block('manifest'); tpl_m = block('template')
man = json.loads(man_m.group(2)); tpl = json.loads(tpl_m.group(2))

def decode(v):
    b = base64.b64decode(v['data'])
    return gzip.decompress(b) if str(v.get('compressed')) == 'True' else b
def encode(text):
    return {'mime': 'application/javascript', 'compressed': True,
            'data': base64.b64encode(gzip.compress(text.encode(), mtime=0)).decode()}

# babel script tags in template order → which uuid holds which source
babel = re.findall(r'<script type="text/babel" src="([0-9a-f-]{36})"></script>', tpl)
by_head = {}
for u in babel:
    head = decode(man[u]).decode()[:400]
    for name in ('Panels.jsx', 'Nerd.jsx', 'RouteMap.jsx'):
        src = (ROOT / name).read_text()
        if head == src[:400] or ('function ' + name[:-4] + '(' in decode(man[u]).decode()):
            by_head[name] = u
for name in ('Panels.jsx', 'Nerd.jsx'):
    if name not in by_head:
        # fall back on the first identifying line
        for u in babel:
            if (ROOT / name).read_text().split('\n')[0] == decode(man[u]).decode().split('\n')[0] and u not in by_head.values():
                by_head[name] = u; break
assert 'Panels.jsx' in by_head and 'Nerd.jsx' in by_head, 'could not locate Panels/Nerd in bundle'
for name in ('Panels.jsx', 'Nerd.jsx', 'RouteMap.jsx'):
    src = (ROOT / name).read_text()
    if name in by_head:
        man[by_head[name]] = encode(src)
    else:
        u = str(uuid.uuid4()); man[u] = encode(src)
        after = '<script type="text/babel" src="%s"></script>' % by_head['Nerd.jsx']
        assert after in tpl
        tpl = tpl.replace(after, after + '\n<script type="text/babel" src="%s"></script>' % u)
        by_head[name] = u

i = tpl.rfind('<script type="text/babel">'); j = tpl.rfind('</script>')
tpl = tpl[:i] + '<script type="text/babel">\n' + (ROOT / 'app.jsx').read_text() + tpl[j:]

esc = lambda o: json.dumps(o).replace('</', '<\\/')
s = s[:man_m.start(2)] + esc(man) + s[man_m.end(2):]
tpl_m = block('template')
s = s[:tpl_m.start(2)] + esc(tpl) + s[tpl_m.end(2):]
HTML.write_text(s)
print('rebundled:', {k: v[:8] for k, v in by_head.items()})
